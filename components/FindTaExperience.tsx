"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  CheckCircle2,
  Copy,
  DoorOpen,
  Download,
  Monitor,
  QrCode,
  RotateCcw,
  ScanLine,
  UserRound
} from "lucide-react";
import type { Language } from "@/components/Navbar";

type ParticipantProfile = {
  alias: string;
  code: string;
  interests: string;
  outfit: string;
  personality: string;
};

type SharedProfile = ParticipantProfile & {
  createdAt: string;
};

const emptyProfile: ParticipantProfile = {
  alias: "",
  code: "",
  interests: "",
  outfit: "",
  personality: ""
};

const STORAGE_KEY = "heartfire-find-ta-profile";

const copy = {
  zh: {
    actions: {
      copy: "复制链接",
      copied: "已复制",
      download: "下载 QR",
      generate: "生成我的 QR",
      reset: "重新填写"
    },
    checklist: ["填写匿名线索", "进入活动房间", "查看队友线索", "线下找到小队", "完成气球挑战并由裁判录入"],
    fields: {
      alias: "匿名代号",
      code: "确认暗号",
      interests: "兴趣爱好",
      outfit: "今日穿搭",
      personality: "备用线索"
    },
    helper:
      "正式活动建议使用上方房间入口：主持人开房间，营员扫码加入，系统随机分成四人小队。备用线索卡只保留匿名信息。",
    placeholders: {
      alias: "例如：星火 27",
      code: "例如：营火三拍",
      interests: "例如：音乐、桌游、散步",
      outfit: "例如：浅色外套、蓝色手环",
      personality: "例如：慢热、喜欢听故事、熟了很能聊"
    },
    qrEmpty: "填写必要线索后生成二维码",
    scannedEyebrow: "你扫到的队友",
    sectionEyebrow: "现场操作",
    sectionTitle: "填写线索，生成你的活动 QR",
    statusReady: "二维码已生成，可以展示给对方扫码。",
    taskTitle: "网页流程",
    yourCard: "我的匿名线索卡",
    yourQr: "我的 QR"
  },
  en: {
    actions: {
      copy: "Copy Link",
      copied: "Copied",
      download: "Download QR",
      generate: "Generate My QR",
      reset: "Reset"
    },
    checklist: [
      "Fill anonymous clues",
      "Join the activity room",
      "View teammate clues",
      "Find the team",
      "Complete the balloon challenge with judge scoring"
    ],
    fields: {
      alias: "Anonymous Code",
      code: "Code Phrase",
      interests: "Interests",
      outfit: "Outfit Clue",
      personality: "Backup Clue"
    },
    helper:
      "For the main activity, use the room flow above: the host opens a room, campers join by QR, and the system creates random four-person teams.",
    placeholders: {
      alias: "Example: Ember 27",
      code: "Example: Three campfire taps",
      interests: "Example: music, board games, evening walks",
      outfit: "Example: light jacket, blue wristband",
      personality: "Example: quiet at first, good listener, talkative after warming up"
    },
    qrEmpty: "Fill the required clues to generate a QR",
    scannedEyebrow: "Scanned Teammate",
    sectionEyebrow: "On-site Flow",
    sectionTitle: "Fill Your Clues and Generate an Activity QR",
    statusReady: "Your QR is ready to show for scanning.",
    taskTitle: "Website Flow",
    yourCard: "My Anonymous Clue Card",
    yourQr: "My QR"
  }
} satisfies Record<Language, unknown>;

function encodeProfile(profile: SharedProfile) {
  return encodeURIComponent(JSON.stringify(profile));
}

function decodeProfile(value: string): SharedProfile | null {
  try {
    const json = value.startsWith("{") ? value : decodeURIComponent(value);
    const parsed = JSON.parse(json) as Partial<SharedProfile>;

    if (
      typeof parsed.alias === "string" &&
      typeof parsed.interests === "string" &&
      typeof parsed.outfit === "string" &&
      typeof parsed.code === "string"
    ) {
      return {
        alias: parsed.alias,
        code: parsed.code,
        createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
        interests: parsed.interests,
        outfit: parsed.outfit,
        personality: typeof parsed.personality === "string" ? parsed.personality : ""
      };
    }
  } catch {
    return null;
  }

  return null;
}

function Field({
  label,
  name,
  onChange,
  placeholder,
  required = false,
  value
}: {
  label: string;
  name: keyof ParticipantProfile;
  onChange: (name: keyof ParticipantProfile, value: string) => void;
  placeholder: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <textarea
        className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </label>
  );
}

function ClueCard({
  heading,
  labels,
  profile
}: {
  heading: string;
  labels: (typeof copy)["zh"]["fields"];
  profile: SharedProfile;
}) {
  return (
    <article className="rounded-2xl border border-orange-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-orange-50 p-3 text-orange-600">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#9a4a1f]">{heading}</p>
          <h3 className="text-xl font-semibold text-slate-950">{profile.alias}</h3>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
        <div className="rounded-xl bg-[#fff8ef] p-4">
          <dt className="font-semibold text-slate-900">{labels.interests}</dt>
          <dd className="mt-1">{profile.interests}</dd>
        </div>
        <div className="rounded-xl bg-[#fff8ef] p-4">
          <dt className="font-semibold text-slate-900">{labels.outfit}</dt>
          <dd className="mt-1">{profile.outfit}</dd>
        </div>
        <div className="rounded-xl bg-[#fff8ef] p-4">
          <dt className="font-semibold text-slate-900">{labels.code}</dt>
          <dd className="mt-1">{profile.code}</dd>
        </div>
      </dl>
    </article>
  );
}

export function FindTaExperience({ lang }: { lang: Language }) {
  const t = copy[lang] as (typeof copy)["zh"];
  const roomCopy =
    lang === "zh"
      ? {
          helper: "主持人创建房间，营员像 Kahoot 一样扫码进入；后台知道真实身份，队友只看匿名线索。",
          host: "主持人开房间",
          join: "进入房间",
          placeholder: "输入房间码",
          title: "房间制四人小队"
        }
      : {
          helper:
            "The host creates a room, campers join by QR, and teammates only see anonymous clues.",
          host: "Host Room",
          join: "Join Room",
          placeholder: "Enter room code",
          title: "Room-based Four-person Teams"
        };
  const [profile, setProfile] = useState<ParticipantProfile>(emptyProfile);
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joinRoomMessage, setJoinRoomMessage] = useState("");
  const [savedProfile, setSavedProfile] = useState<SharedProfile | null>(null);
  const [scannedProfile, setScannedProfile] = useState<SharedProfile | null>(null);
  const [originPath, setOriginPath] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [tasks, setTasks] = useState([false, false, false, false, false]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const restored = decodeProfile(stored);

      if (restored) {
        setSavedProfile(restored);
        setProfile({
          alias: restored.alias,
          code: restored.code,
          interests: restored.interests,
          outfit: restored.outfit,
          personality: restored.personality
        });
      }
    }

    const scanned = new URLSearchParams(window.location.search).get("profile");

    if (scanned) {
      setScannedProfile(decodeProfile(scanned));
    }

    setOriginPath(`${window.location.origin}${window.location.pathname}`);
  }, []);

  const canGenerate = useMemo(
    () =>
      Boolean(
        profile.alias.trim() &&
          profile.interests.trim() &&
          profile.outfit.trim() &&
          profile.code.trim()
      ),
    [profile]
  );

  const profileLink = useMemo(() => {
    if (!originPath || !savedProfile) {
      return "";
    }

    return `${originPath}?profile=${encodeProfile(savedProfile)}`;
  }, [originPath, savedProfile]);

  useEffect(() => {
    let active = true;

    if (!profileLink) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(profileLink, {
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
  }, [profileLink]);

  function handleChange(name: keyof ParticipantProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [name]: value
    }));
    setCopied(false);
  }

  function handleGenerate() {
    const formData = new FormData(formRef.current ?? undefined);
    const nextInput: ParticipantProfile = {
      alias: String(formData.get("alias") ?? "").trim(),
      code: String(formData.get("code") ?? "").trim(),
      interests: String(formData.get("interests") ?? "").trim(),
      outfit: String(formData.get("outfit") ?? "").trim(),
      personality: ""
    };

    if (
      !nextInput.alias ||
      !nextInput.interests ||
      !nextInput.outfit ||
      !nextInput.code
    ) {
      setFormMessage(lang === "zh" ? "请先填写必要线索。" : "Please fill the required clues first.");
      return;
    }

    const nextProfile: SharedProfile = {
      ...nextInput,
      createdAt: new Date().toISOString()
    };

    setProfile(nextInput);
    setSavedProfile(nextProfile);
    setFormMessage("");
    window.localStorage.setItem(STORAGE_KEY, encodeProfile(nextProfile));
    setTasks((current) => [true, true, current[2], current[3], current[4]]);
  }

  async function handleCopy() {
    if (!profileLink || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(profileLink);
    setCopied(true);
  }

  function handleReset() {
    setProfile(emptyProfile);
    setSavedProfile(null);
    setQrDataUrl("");
    setCopied(false);
    setTasks([false, false, false, false, false]);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = joinRoomCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!code) {
      setJoinRoomMessage(lang === "zh" ? "请先输入房间码。" : "Please enter a room code.");
      return;
    }

    window.location.href = `/find-ta/join/${code}`;
  }

  const completedTasks = tasks.filter(Boolean).length;

  return (
    <section className="border-y border-orange-100/80 bg-[#fff8ef] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex rounded-lg bg-white p-3 text-orange-500 shadow-sm">
            <QrCode className="h-6 w-6" />
          </div>
          <p className="mt-5 text-sm font-semibold tracking-[0.18em] text-[#9a4a1f]">
            {t.sectionEyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            {t.sectionTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">{t.helper}</p>

          <div className="mt-6 grid gap-4 rounded-[1.25rem] border border-orange-100 bg-white/92 p-4 shadow-card md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">{roomCopy.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{roomCopy.helper}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#a93616]"
                href="/find-ta/host"
              >
                <Monitor className="h-4 w-4" />
                {roomCopy.host}
              </Link>
              <form className="flex min-w-0 flex-col gap-2 sm:flex-row" onSubmit={handleJoinRoom}>
                <input
                  className="min-h-12 min-w-0 flex-1 rounded-full border border-orange-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm placeholder:normal-case placeholder:tracking-normal placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  onChange={(event) => {
                    setJoinRoomCode(event.target.value);
                    setJoinRoomMessage("");
                  }}
                  placeholder={roomCopy.placeholder}
                  value={joinRoomCode}
                />
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-[#8a3a18] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                  type="submit"
                >
                  <DoorOpen className="h-4 w-4" />
                  {roomCopy.join}
                </button>
              </form>
              {joinRoomMessage ? (
                <p className="text-sm font-semibold text-orange-700 sm:col-span-2">{joinRoomMessage}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.86fr]">
          <form
            className="rounded-[1.25rem] border border-stone-200/80 bg-white/95 p-5 shadow-card sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();
              handleGenerate();
            }}
            ref={formRef}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label={t.fields.alias}
                name="alias"
                onChange={handleChange}
                placeholder={t.placeholders.alias}
                required
                value={profile.alias}
              />
              <Field
                label={t.fields.code}
                name="code"
                onChange={handleChange}
                placeholder={t.placeholders.code}
                required
                value={profile.code}
              />
              <Field
                label={t.fields.interests}
                name="interests"
                onChange={handleChange}
                placeholder={t.placeholders.interests}
                required
                value={profile.interests}
              />
              <Field
                label={t.fields.outfit}
                name="outfit"
                onChange={handleChange}
                placeholder={t.placeholders.outfit}
                required
                value={profile.outfit}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8f2d12] via-[#b33a16] to-[#6f2311] px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                type="submit"
              >
                <QrCode className="h-4 w-4" />
                {t.actions.generate}
              </button>
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white/90 px-6 py-3 text-sm font-semibold text-[#8a3a18] shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-[#fbf6ef] sm:text-base"
                onClick={handleReset}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                {t.actions.reset}
              </button>
            </div>
            {formMessage ? <p className="mt-3 text-sm font-semibold text-orange-700">{formMessage}</p> : null}
          </form>

          <div className="space-y-5">
            <div className="rounded-[1.25rem] border border-orange-100 bg-white p-5 text-center shadow-card sm:p-6">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#9a4a1f]">
                <ScanLine className="h-4 w-4" />
                {t.yourQr}
              </div>

              <div className="mt-5 grid min-h-72 place-items-center rounded-2xl border border-dashed border-orange-200 bg-[#fffaf3] p-4">
                {qrDataUrl ? (
                  <img className="h-64 w-64 rounded-xl bg-white p-3 shadow-sm" src={qrDataUrl} alt={t.yourQr} />
                ) : (
                  <p className="max-w-56 text-sm leading-7 text-slate-600">{t.qrEmpty}</p>
                )}
              </div>

              {profileLink ? (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a3a18] transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                    onClick={handleCopy}
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? t.actions.copied : t.actions.copy}
                  </button>
                  <a
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#a93616]"
                    download="find-ta-qr.png"
                    href={qrDataUrl}
                  >
                    <Download className="h-4 w-4" />
                    {t.actions.download}
                  </a>
                </div>
              ) : null}

              {savedProfile ? (
                <p className="mt-4 text-sm font-medium text-emerald-700">{t.statusReady}</p>
              ) : null}
            </div>

            <div className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-950">{t.taskTitle}</h3>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-[#9a4a1f]">
                  {completedTasks}/5
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {t.checklist.map((item, index) => (
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-[#fffaf3] px-4 py-3 text-sm font-semibold text-slate-700"
                    key={item}
                  >
                    <input
                      checked={tasks[index]}
                      className="h-5 w-5 accent-[#8f2d12]"
                      onChange={(event) =>
                        setTasks((current) =>
                          current.map((value, itemIndex) => (itemIndex === index ? event.target.checked : value))
                        )
                      }
                      type="checkbox"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {savedProfile ? <ClueCard heading={t.yourCard} labels={t.fields} profile={savedProfile} /> : null}
          {scannedProfile ? <ClueCard heading={t.scannedEyebrow} labels={t.fields} profile={scannedProfile} /> : null}
        </div>
      </div>
    </section>
  );
}
