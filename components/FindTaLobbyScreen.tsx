"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Handshake, QrCode, RefreshCcw, Sparkles, UsersRound } from "lucide-react";
import type { FindTaLobbyView } from "@/lib/find-ta-types";

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data.message === "string" ? data.message : "请求失败，请稍后再试。");
  }

  return data as T;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function StatTile({
  label,
  tone = "light",
  value
}: {
  label: string;
  tone?: "dark" | "light";
  value: string;
}) {
  return (
    <div
      className={`rounded-[1.25rem] border p-4 shadow-sm ${
        tone === "dark"
          ? "border-[#8f2d12] bg-[#8f2d12] text-white"
          : "border-orange-100 bg-white text-slate-950"
      }`}
    >
      <p className={tone === "dark" ? "text-sm font-semibold text-orange-100" : "text-sm font-semibold text-[#9a4a1f]"}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold leading-none sm:text-4xl">{value}</p>
    </div>
  );
}

export function FindTaLobbyScreen({ roomCode }: { roomCode: string }) {
  const normalizedRoomCode = useMemo(() => roomCode.trim().toUpperCase(), [roomCode]);
  const [joinUrl, setJoinUrl] = useState("");
  const [message, setMessage] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [room, setRoom] = useState<FindTaLobbyView | null>(null);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/find-ta/join/${normalizedRoomCode}`);
    void loadLobby();

    const timer = window.setInterval(() => {
      void loadLobby(true);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [normalizedRoomCode]);

  useEffect(() => {
    let active = true;

    if (!joinUrl) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(joinUrl, {
      color: {
        dark: "#3f2a1d",
        light: "#fffaf3"
      },
      margin: 2,
      width: 420
    }).then((url) => {
      if (active) {
        setQrDataUrl(url);
      }
    });

    return () => {
      active = false;
    };
  }, [joinUrl]);

  async function loadLobby(quiet = false) {
    try {
      if (!quiet) {
        setMessage("");
      }

      setRoom(
        await readJson<FindTaLobbyView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/lobby`, {
            cache: "no-store"
          })
        )
      );
    } catch (error) {
      if (!quiet) {
        setMessage(error instanceof Error ? error.message : "读取房间失败。");
      }
    }
  }

  const participants = room?.participants ?? [];
  const activities = room?.activities ?? [];
  const leaderboard = room?.leaderboard ?? [];
  const stats = room?.stats;
  const joinedTarget = stats?.targetParticipants ?? 60;
  const pairedTotal = Math.max(participants.length, stats?.pairedParticipantCount ?? 0);
  const statusLabel = room?.status === "paired" ? `第 ${room.round} 轮已分组` : "等待加入";

  return (
    <main className="min-h-screen bg-[#fff8ef] text-slate-950" id="main-content">
      <section className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-2.5rem)] gap-5 xl:grid-cols-[0.7fr_1.3fr]">
          <aside className="flex flex-col rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">主持人大屏</p>
                <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                  寻找那个 TA
                </h1>
              </div>
              <span className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                <QrCode className="h-7 w-7" />
              </span>
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-[#fff8ef] p-4 text-center">
              <p className="text-sm font-semibold text-[#9a4a1f]">房间码</p>
              <p className="mt-2 font-display text-7xl font-semibold tracking-[0.16em] text-slate-950 sm:text-8xl">
                {normalizedRoomCode}
              </p>
            </div>

            <div className="mt-5 grid place-items-center rounded-[1.25rem] border border-dashed border-orange-200 bg-[#fffaf3] p-5">
              {qrDataUrl ? (
                <img
                  alt="加入房间二维码"
                  className="w-full max-w-[300px] rounded-[1.25rem] bg-white p-4 shadow-sm"
                  src={qrDataUrl}
                />
              ) : (
                <QrCode className="h-20 w-20 text-orange-200" />
              )}
            </div>

            <p className="mt-4 break-all text-center text-sm font-semibold leading-6 text-slate-600">{joinUrl}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatTile label="已加入" tone="dark" value={`${participants.length}/${joinedTarget}`} />
              <StatTile
                label="已进入小队"
                value={`${stats?.pairedParticipantCount ?? 0}/${pairedTotal || 0}`}
              />
              <StatTile label="已完成任务" value={`${stats?.completedParticipantCount ?? 0}/${pairedTotal || 0}`} />
              <StatTile label="小队数" value={`${stats?.pairCount ?? 0}`} />
            </div>
          </aside>

          <section className="grid gap-5 xl:grid-rows-[auto_1fr]">
            <div className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">活动状态</p>
                  <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                    实时进度
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-12 items-center gap-2 rounded-full border border-orange-200 bg-[#fff8ef] px-5 py-2 text-sm font-semibold text-[#9a4a1f]">
                    <Sparkles className="h-4 w-4" />
                    {statusLabel}
                  </span>
                  <button
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-[#8a3a18] transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                    onClick={() => void loadLobby()}
                    type="button"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    刷新
                  </button>
                </div>
              </div>

              {message ? <p className="mt-5 text-sm font-semibold text-orange-700">{message}</p> : null}
            </div>

            <div className="grid min-h-0 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <section className="flex min-h-0 flex-col rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-orange-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">匿名代号墙</p>
                    <h3 className="mt-1 text-2xl font-semibold text-slate-950">已进入的营员</h3>
                  </div>
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8f2d12] px-4 py-2 text-base font-semibold text-white shadow-sm">
                    <UsersRound className="h-5 w-5" />
                    {participants.length} 人
                  </span>
                </div>

                <div className="mt-5 min-h-0 flex-1 overflow-hidden">
                  {participants.length ? (
                    <div className="grid max-h-[calc(100vh-17rem)] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 2xl:grid-cols-3">
                      {participants.map((participant, index) => (
                        <div
                          className="flex min-h-16 items-center gap-3 rounded-2xl border border-orange-100 bg-[#fff8ef] px-4 py-3 shadow-sm"
                          key={participant.id}
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-[#9a4a1f] shadow-sm">
                            {index + 1}
                          </span>
                          <p className="min-w-0 truncate text-xl font-semibold text-slate-950">
                            {participant.alias}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid min-h-[22rem] place-items-center rounded-[1.25rem] border border-dashed border-orange-200 bg-[#fffaf3] text-center">
                      <div>
                        <UsersRound className="mx-auto h-14 w-14 text-orange-300" />
                        <p className="mt-4 text-xl font-semibold text-slate-900">等待大家扫码加入</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">加入后匿名代号会自动显示在这里。</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="grid min-h-0 gap-5">
                <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-3 border-b border-orange-100 pb-4">
                    <span className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                      <Handshake className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">排行榜 Top 10</p>
                      <h3 className="text-2xl font-semibold text-slate-950">积分排行</h3>
                    </div>
                  </div>

                  <div className="mt-4 grid max-h-[34vh] gap-3 overflow-y-auto pr-1">
                    {leaderboard.length ? (
                      leaderboard.map((entry) => (
                        <div
                          className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-2xl bg-[#fff8ef] px-4 py-3"
                          key={entry.id}
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-semibold text-[#9a4a1f]">
                            {entry.rank}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-950">{entry.label}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-600">
                              {entry.status} / 已完成 {entry.completedTasks} 项
                            </p>
                          </div>
                          <p className="text-xl font-semibold text-[#8f2d12]">{entry.score}</p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-2xl bg-[#fff8ef] p-5 text-sm font-semibold text-slate-600">
                        等待分组后生成排行榜。
                      </p>
                    )}
                  </div>
                </section>

                <section className="min-h-0 rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-3 border-b border-orange-100 pb-4">
                    <span className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">实时滚动动态</p>
                      <h3 className="text-2xl font-semibold text-slate-950">活动现场</h3>
                    </div>
                  </div>

                  <div className="mt-4 grid max-h-[34vh] gap-3 overflow-y-auto pr-1">
                    {activities.length ? (
                      activities.map((activity) => (
                        <div className="rounded-2xl border border-orange-100 bg-[#fff8ef] px-4 py-3" key={activity.id}>
                          <p className="text-xs font-semibold text-[#9a4a1f]">{formatTime(activity.time)}</p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{activity.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-2xl bg-[#fff8ef] p-5 text-sm font-semibold text-slate-600">
                        暂无动态。
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
