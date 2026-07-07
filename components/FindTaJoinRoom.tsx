"use client";

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, LockKeyhole, UserRound } from "lucide-react";
import { Container } from "@/components/Container";
import { FindTaRoomFrame } from "@/components/FindTaRoomFrame";
import { StatusPill, TextField } from "@/components/FindTaRoomFields";
import type { FindTaParticipantInput, FindTaParticipantView, FindTaRoomSummary } from "@/lib/find-ta-types";

type JoinResponse = FindTaParticipantView & {
  participantUrl: string;
};

const emptyForm: FindTaParticipantInput = {
  alias: "",
  codePhrase: "",
  group: "",
  interests: "",
  outfit: "",
  realName: ""
};

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data.message === "string" ? data.message : "请求失败，请稍后再试。");
  }

  return data as T;
}

export function FindTaJoinRoom({ roomCode }: { roomCode: string }) {
  const normalizedRoomCode = useMemo(() => roomCode.trim().toUpperCase(), [roomCode]);
  const [busy, setBusy] = useState(false);
  const [existingUrl, setExistingUrl] = useState("");
  const [form, setForm] = useState<FindTaParticipantInput>(emptyForm);
  const [message, setMessage] = useState("");
  const [participantUrl, setParticipantUrl] = useState("");
  const [room, setRoom] = useState<FindTaRoomSummary | null>(null);

  useEffect(() => {
    const storageKey = `heartfire-find-ta-participant-${normalizedRoomCode}`;
    const savedUrl = window.localStorage.getItem(storageKey);

    if (savedUrl) {
      setExistingUrl(savedUrl);
    }

    async function loadRoom() {
      try {
        setMessage("");
        setRoom(
          await readJson<FindTaRoomSummary>(
            await fetch(`/api/find-ta/rooms/${normalizedRoomCode}`, {
              cache: "no-store"
            })
          )
        );
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "读取房间失败。");
      }
    }

    void loadRoom();
  }, [normalizedRoomCode]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setBusy(true);
      setMessage("");

      const joined = await readJson<JoinResponse>(
        await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants`, {
          body: JSON.stringify(form),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        })
      );

      setParticipantUrl(joined.participantUrl);
      window.localStorage.setItem(`heartfire-find-ta-participant-${normalizedRoomCode}`, joined.participantUrl);
      window.location.assign(joined.participantUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加入房间失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FindTaRoomFrame
      description="填写真实身份给主持人核对，同时填写匿名线索给小队队友寻找你。"
      eyebrow="营员加入"
      title={`进入房间 ${normalizedRoomCode}`}
    >
      <section className="py-10 sm:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="space-y-5">
              <div className="rounded-[1.25rem] border border-orange-100 bg-white p-6 shadow-card">
                <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">房间状态</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusPill tone={room?.status === "paired" ? "emerald" : "amber"}>
                    {room?.status === "paired" ? "已经开始分组" : "等待主持人分组"}
                  </StatusPill>
                  <StatusPill tone="slate">{room ? `${room.participantCount} 人已加入` : "读取中"}</StatusPill>
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-orange-700">{message}</p> : null}
              </div>

              {existingUrl ? (
                <div className="rounded-[1.25rem] border border-emerald-100 bg-emerald-50 p-6 shadow-card">
                  <div className="inline-flex rounded-2xl bg-white p-3 text-emerald-600">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">你已经加入过这个房间</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">可以直接回到自己的小队页等待结果。</p>
                  <Link
                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
                    href={existingUrl}
                  >
                    回到我的页面
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}

              <div className="rounded-[1.25rem] border border-orange-100 bg-[#fff8ef] p-6 shadow-card">
                <div className="inline-flex rounded-2xl bg-white p-3 text-orange-600">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">身份保护</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  真实姓名只给主持人后台核对。队友看到的是你的匿名代号和线索。
                </p>
              </div>
            </aside>

            <form
              className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                  <UserRound className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">填写资料</p>
                  <h2 className="text-2xl font-semibold text-slate-950">加入活动房间</h2>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-stone-200 bg-[#fffaf3] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">后台可见</h3>
                  <StatusPill tone="slate">主持人核对</StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  后台小组只给主持人看，可以填写原本报名小组、营会小组或城市小组。
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <TextField
                    autoComplete="name"
                    label="真实姓名"
                    name="realName"
                    onChange={handleChange}
                    placeholder="例如：王小明"
                    required
                    value={form.realName}
                  />
                  <TextField
                    label="后台小组"
                    name="group"
                    onChange={handleChange}
                    placeholder="例如：柏林组、红队，可选"
                    value={form.group}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-100 bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">别人可见</h3>
                  <StatusPill tone="amber">匿名线索</StatusPill>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <TextField
                    label="匿名代号"
                    name="alias"
                    onChange={handleChange}
                    placeholder="例如：星火 27"
                    required
                    value={form.alias}
                  />
                  <TextField
                    label="确认暗号"
                    name="codePhrase"
                    onChange={handleChange}
                    placeholder="例如：营火三拍"
                    required
                    value={form.codePhrase}
                  />
                  <TextField
                    label="兴趣爱好"
                    name="interests"
                    onChange={handleChange}
                    placeholder="例如：音乐、桌游、散步"
                    required
                    textarea
                    value={form.interests}
                  />
                  <TextField
                    label="今日穿搭"
                    name="outfit"
                    onChange={handleChange}
                    placeholder="例如：浅色外套、蓝色手环"
                    required
                    textarea
                    value={form.outfit}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#a93616] disabled:cursor-wait disabled:opacity-60 sm:text-base"
                  disabled={busy}
                  type="submit"
                >
                  {busy ? "加入中" : "加入房间"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                {participantUrl ? (
                  <Link className="text-sm font-semibold text-[#9a4a1f]" href={participantUrl}>
                    进入我的小队页
                  </Link>
                ) : null}
              </div>
              {message ? <p className="mt-4 text-sm font-semibold text-orange-700">{message}</p> : null}
            </form>
          </div>
        </Container>
      </section>
    </FindTaRoomFrame>
  );
}
