"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  CheckCircle2,
  ClipboardCopy,
  Download,
  Monitor,
  Play,
  QrCode,
  RefreshCcw,
  Shuffle,
  UserCheck,
  Users
} from "lucide-react";
import { Container } from "@/components/Container";
import { FindTaRoomFrame } from "@/components/FindTaRoomFrame";
import { StatusPill } from "@/components/FindTaRoomFields";
import type { FindTaHostRoomView } from "@/lib/find-ta-types";

type CreatedRoomResponse = FindTaHostRoomView & {
  hostUrl: string;
  joinUrl: string;
};

const HOST_STORAGE_KEY = "heartfire-find-ta-host-room";

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data.message === "string" ? data.message : "请求失败，请稍后再试。");
  }

  return data as T;
}

function formatTime(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function FindTaHostRoom() {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hostToken, setHostToken] = useState("");
  const [hostUrl, setHostUrl] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [message, setMessage] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [room, setRoom] = useState<FindTaHostRoomView | null>(null);
  const [roomCode, setRoomCode] = useState("");

  const completedPairCount = useMemo(
    () => room?.pairs.filter((pair) => pair.completed).length ?? 0,
    [room]
  );
  const screenUrl = roomCode && joinUrl ? joinUrl.replace(`/join/${roomCode}`, `/screen/${roomCode}`) : "";
  const exportUrl =
    roomCode && hostToken
      ? `/api/find-ta/rooms/${roomCode}/export?token=${encodeURIComponent(hostToken)}`
      : "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("room") ?? "";
    const tokenFromUrl = params.get("token") ?? "";

    if (codeFromUrl && tokenFromUrl) {
      const normalizedCode = codeFromUrl.trim().toUpperCase();
      setRoomCode(normalizedCode);
      setHostToken(tokenFromUrl);
      setHostUrl(`${window.location.origin}/find-ta/host?room=${normalizedCode}&token=${tokenFromUrl}`);
      setJoinUrl(`${window.location.origin}/find-ta/join/${normalizedCode}`);
      void loadRoom(normalizedCode, tokenFromUrl);
      return;
    }

    const saved = window.localStorage.getItem(HOST_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { code?: string; token?: string };

        if (parsed.code && parsed.token) {
          const normalizedCode = parsed.code.trim().toUpperCase();
          setRoomCode(normalizedCode);
          setHostToken(parsed.token);
          setHostUrl(`${window.location.origin}/find-ta/host?room=${normalizedCode}&token=${parsed.token}`);
          setJoinUrl(`${window.location.origin}/find-ta/join/${normalizedCode}`);
          void loadRoom(normalizedCode, parsed.token);
        }
      } catch {
        window.localStorage.removeItem(HOST_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!roomCode || !hostToken) {
      return;
    }

    const timer = window.setInterval(() => {
      void loadRoom(roomCode, hostToken, true);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [roomCode, hostToken]);

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
      width: 320
    }).then((url) => {
      if (active) {
        setQrDataUrl(url);
      }
    });

    return () => {
      active = false;
    };
  }, [joinUrl]);

  async function loadRoom(code: string, token: string, quiet = false) {
    try {
      if (!quiet) {
        setMessage("");
      }

      const nextRoom = await readJson<FindTaHostRoomView>(
        await fetch(`/api/find-ta/rooms/${code}/host?token=${encodeURIComponent(token)}`, {
          cache: "no-store"
        })
      );

      setRoom(nextRoom);
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "读取房间失败。";
      const shouldForgetSavedRoom =
        nextMessage.includes("没有找到这个房间") || nextMessage.includes("主持人验证失败");

      if (!quiet && !shouldForgetSavedRoom) {
        setMessage(nextMessage);
      }

      if (!quiet && shouldForgetSavedRoom) {
        window.localStorage.removeItem(HOST_STORAGE_KEY);
        setHostToken("");
        setHostUrl("");
        setJoinUrl("");
        setMessage("");
        setRoom(null);
        setRoomCode("");
      }
    }
  }

  async function handleCreateRoom() {
    try {
      setBusy(true);
      setCopied(false);
      setMessage("");

      const created = await readJson<CreatedRoomResponse>(
        await fetch("/api/find-ta/rooms", {
          method: "POST"
        })
      );
      const browserOrigin = window.location.origin;
      const nextHostUrl = `${browserOrigin}/find-ta/host?room=${created.code}&token=${created.hostToken}`;
      const nextJoinUrl = `${browserOrigin}/find-ta/join/${created.code}`;

      setRoom(created);
      setRoomCode(created.code);
      setHostToken(created.hostToken);
      setHostUrl(nextHostUrl);
      setJoinUrl(nextJoinUrl);
      window.localStorage.setItem(
        HOST_STORAGE_KEY,
        JSON.stringify({
          code: created.code,
          token: created.hostToken
        })
      );
      window.history.replaceState(null, "", nextHostUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "创建房间失败。");
    } finally {
      setBusy(false);
    }
  }

  async function handlePair() {
    if (!roomCode || !hostToken) {
      return;
    }

    try {
      setBusy(true);
      setMessage("");

      const nextRoom = await readJson<FindTaHostRoomView>(
        await fetch(`/api/find-ta/rooms/${roomCode}/pair`, {
          body: JSON.stringify({ token: hostToken }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        })
      );

      setRoom(nextRoom);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "分组失败。");
    } finally {
      setBusy(false);
    }
  }

  async function handlePuzzleComplete(pairId: string) {
    if (!roomCode || !hostToken) {
      return;
    }

    try {
      setBusy(true);
      setMessage("");

      const nextRoom = await readJson<FindTaHostRoomView>(
        await fetch(`/api/find-ta/rooms/${roomCode}/pairs/${pairId}/puzzle`, {
          body: JSON.stringify({ token: hostToken }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        })
      );

      setRoom(nextRoom);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "金句拼图标记失败。");
    } finally {
      setBusy(false);
    }
  }

  async function handleExplorationComplete(pairId: string) {
    if (!roomCode || !hostToken) {
      return;
    }

    try {
      setBusy(true);
      setMessage("");

      const nextRoom = await readJson<FindTaHostRoomView>(
        await fetch(`/api/find-ta/rooms/${roomCode}/pairs/${pairId}/exploration`, {
          body: JSON.stringify({ token: hostToken }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        })
      );

      setRoom(nextRoom);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "营地探索通过失败。");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopyJoinUrl() {
    if (!joinUrl || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
  }

  return (
    <FindTaRoomFrame
      description="主持人创建房间，把二维码投到屏幕上。营员扫码填写资料后，主持人一键随机分成四人小队。"
      eyebrow="主持人后台"
      title="房间分组控制台"
    >
      <section className="py-10 sm:py-12">
        <Container>
          {!room ? (
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="section-card bg-white">
                <div className="inline-flex rounded-2xl bg-orange-50 p-3 text-orange-600">
                  <Play className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-display text-3xl font-semibold text-slate-950">创建活动房间</h2>
                <p className="mt-4 text-base leading-8 text-slate-700">
                  创建后会得到一个房间码和加入二维码，营员用自己的手机进入同一个房间。
                </p>
                <button
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#a93616] disabled:cursor-wait disabled:opacity-60 sm:text-base"
                  disabled={busy}
                  onClick={handleCreateRoom}
                  type="button"
                >
                  <QrCode className="h-5 w-5" />
                  {busy ? "创建中" : "创建房间"}
                </button>
                {message ? <p className="mt-4 text-sm font-semibold text-orange-700">{message}</p> : null}
              </div>

              <div className="rounded-[1.25rem] border border-orange-100 bg-[#fff8ef] p-6 shadow-card">
                <p className="text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">流程</p>
                <div className="mt-5 grid gap-4">
                  {["创建房间", "营员扫码填写", "后台确认人数", "一键随机分组", "线下寻找队友"].map(
                    (item, index) => (
                      <div className="flex items-center gap-4 rounded-2xl bg-white p-4" key={item}>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-50 text-sm font-semibold text-[#9a4a1f]">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-slate-900">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
              <aside className="space-y-5">
                <div className="rounded-[1.25rem] border border-orange-100 bg-white p-6 text-center shadow-card">
                  <p className="text-sm font-semibold text-[#9a4a1f]">房间码</p>
                  <p className="mt-2 font-display text-6xl font-semibold tracking-[0.14em] text-slate-950">
                    {room.code}
                  </p>
                  <div className="mt-5 grid min-h-72 place-items-center rounded-2xl border border-dashed border-orange-200 bg-[#fffaf3] p-4">
                    {qrDataUrl ? (
                      <img className="h-64 w-64 rounded-xl bg-white p-3 shadow-sm" src={qrDataUrl} alt="加入二维码" />
                    ) : (
                      <QrCode className="h-16 w-16 text-orange-200" />
                    )}
                  </div>
                  <button
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a3a18] transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                    onClick={handleCopyJoinUrl}
                    type="button"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    {copied ? "已复制加入链接" : "复制加入链接"}
                  </button>
                  {screenUrl ? (
                    <Link
                      className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#a93616]"
                      href={screenUrl}
                      target="_blank"
                    >
                      <Monitor className="h-4 w-4" />
                      打开大屏幕
                    </Link>
                  ) : null}
                  <p className="mt-3 break-all text-xs leading-5 text-slate-500">{joinUrl}</p>
                </div>

                <div className="rounded-[1.25rem] border border-orange-100 bg-white p-6 shadow-card">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-[#fff8ef] p-4">
                      <p className="text-2xl font-semibold text-slate-950">{room.participantCount}</p>
                      <p className="mt-1 text-xs font-semibold text-[#9a4a1f]">已加入</p>
                    </div>
                    <div className="rounded-2xl bg-[#fff8ef] p-4">
                      <p className="text-2xl font-semibold text-slate-950">{room.pairs.length}</p>
                      <p className="mt-1 text-xs font-semibold text-[#9a4a1f]">小队数</p>
                    </div>
                    <div className="rounded-2xl bg-[#fff8ef] p-4">
                      <p className="text-2xl font-semibold text-slate-950">{completedPairCount}</p>
                      <p className="mt-1 text-xs font-semibold text-[#9a4a1f]">已会合小队</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#a93616] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={busy || room.participantCount < 2}
                      onClick={handlePair}
                      type="button"
                    >
                      <Shuffle className="h-4 w-4" />
                      {room.status === "paired" ? "重新随机分组" : "开始随机分组"}
                    </button>
                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a3a18] transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                      onClick={() => void loadRoom(roomCode, hostToken)}
                      type="button"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      刷新名单
                    </button>
                    {exportUrl ? (
                      <a
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a3a18] transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                        href={exportUrl}
                      >
                        <Download className="h-4 w-4" />
                        导出 CSV
                      </a>
                    ) : null}
                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-[#fff8ef] px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white disabled:cursor-wait disabled:opacity-60"
                      disabled={busy}
                      onClick={handleCreateRoom}
                      type="button"
                    >
                      <QrCode className="h-4 w-4" />
                      重新开新房间
                    </button>
                  </div>
                  {message ? <p className="mt-4 text-sm font-semibold text-orange-700">{message}</p> : null}
                </div>
              </aside>

              <div className="space-y-6">
                <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">后台名单</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">已加入营员</h2>
                    </div>
                    <StatusPill tone={room.status === "paired" ? "emerald" : "amber"}>
                      {room.status === "paired" ? `第 ${room.round} 轮已分组` : "等待分组"}
                    </StatusPill>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200">
                    {room.participants.length ? (
                      <div className="divide-y divide-stone-200">
                        {room.participants.map((participant, index) => (
                          <div className="grid gap-3 bg-white p-4 md:grid-cols-[3rem_1.2fr_1fr]" key={participant.id}>
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-50 text-sm font-semibold text-[#9a4a1f]">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-950">{participant.realName}</p>
                            </div>
                            <div className="text-sm leading-6 text-slate-600">
                              <p>后台小组：{participant.group || "未填写"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid min-h-40 place-items-center bg-[#fffaf3] p-6 text-center">
                        <div>
                          <Users className="mx-auto h-10 w-10 text-orange-300" />
                          <p className="mt-3 text-sm font-semibold text-slate-700">等待营员扫码加入</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">后台可见</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">真实分组表</h2>
                    </div>
                    <StatusPill tone="slate">{room.pairs.length ? `${room.pairs.length} 组` : "未生成"}</StatusPill>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {room.pairs.length ? (
                      room.pairs.map((pair, index) => (
                        <article className="rounded-2xl border border-stone-200 bg-[#fffaf3] p-4" key={pair.id}>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-semibold text-slate-950">小队 {index + 1}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusPill tone="slate">{pair.score} 分</StatusPill>
                              <StatusPill tone={pair.completed ? "emerald" : "amber"}>
                                {pair.completed
                                  ? `已会合 ${formatTime(pair.completedAt)}`
                                  : pair.confirmedCount > 0
                                    ? `${pair.confirmedCount}/${pair.totalCount} 已确认`
                                    : "寻找中"}
                              </StatusPill>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {pair.members.map((member) => (
                              <div className="rounded-2xl bg-white p-4 shadow-sm" key={member.id}>
                                <div className="flex items-start gap-3">
                                  <span className="rounded-full bg-orange-50 p-2 text-orange-600">
                                    <UserCheck className="h-4 w-4" />
                                  </span>
                                  <div>
                                    <p className="font-semibold text-slate-950">{member.realName}</p>
                                    <p className="mt-1 text-sm text-slate-600">
                                      后台小组：{member.group || "未填写"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-slate-700 shadow-sm">
                            <div>探索任务：{pair.explorationTask.title}</div>
                            <div>
                              共同点挑战：
                              {pair.commonChallenge?.completed
                                ? `已完成 ${formatTime(pair.commonChallenge.completedAt)}`
                                : pair.commonChallenge
                                  ? `确认中 ${pair.commonChallenge.confirmedCount}/${pair.commonChallenge.totalCount}`
                                  : pair.completed
                                    ? "未提交"
                                    : "未解锁"}
                            </div>
                            <div>
                              默契测试：
                              {pair.harmonyChallenge?.completed
                                ? `已完成，默契度 ${pair.harmonyChallenge.percentage ?? 0}%`
                                : pair.harmonyChallenge && pair.commonChallenge?.completed
                                  ? `作答中 ${pair.harmonyChallenge.submittedCount}/${pair.harmonyChallenge.totalCount}`
                                  : pair.commonChallenge?.completed
                                    ? "未开始"
                                    : "未解锁"}
                            </div>
                            <div>
                              营地探索：
                              {pair.explorationChallenge?.completed
                                ? `已完成 ${formatTime(pair.explorationChallenge.completedAt)}`
                                : pair.harmonyChallenge?.completed
                                  ? "等待工作人员通过"
                                  : "未解锁"}
                            </div>
                            <div>
                              金句拼图：
                              {pair.scripturePuzzle.completed
                                ? pair.scripturePuzzle.isWinner
                                  ? `获胜 ${formatTime(pair.scripturePuzzle.completedAt)}`
                                  : `已完成 ${formatTime(pair.scripturePuzzle.completedAt)}`
                                : pair.explorationChallenge?.completed
                                  ? "等待工作人员检查"
                                  : "未解锁"}
                            </div>
                            {pair.explorationChallenge?.photoDataUrl ? (
                              <img
                                alt="探索任务照片"
                                className="mt-3 max-h-48 w-full rounded-2xl object-cover"
                                src={pair.explorationChallenge.photoDataUrl}
                              />
                            ) : null}
                            {pair.harmonyChallenge?.completed && !pair.explorationChallenge?.completed ? (
                              <button
                                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
                                disabled={busy}
                                onClick={() => void handleExplorationComplete(pair.id)}
                                type="button"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                确认营地探索通过
                              </button>
                            ) : null}
                            {pair.explorationChallenge?.completed && !pair.scripturePuzzle.completed ? (
                              <button
                                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#a93616] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
                                disabled={busy}
                                onClick={() => void handlePuzzleComplete(pair.id)}
                                type="button"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                标记金句拼图完成
                              </button>
                            ) : null}
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-orange-200 bg-[#fffaf3] p-8 text-center">
                        <CheckCircle2 className="mx-auto h-10 w-10 text-orange-300" />
                        <p className="mt-3 text-sm font-semibold text-slate-700">人数到齐后点击“开始随机分组”</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </Container>
      </section>
    </FindTaRoomFrame>
  );
}
