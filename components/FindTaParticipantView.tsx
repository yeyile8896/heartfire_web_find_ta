"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Handshake,
  RefreshCcw,
  Sparkles,
  Trophy,
  UserRound
} from "lucide-react";
import { Container } from "@/components/Container";
import { FindTaRoomFrame } from "@/components/FindTaRoomFrame";
import { StatusPill } from "@/components/FindTaRoomFields";
import type {
  FindTaCommonChallengeStatus,
  FindTaExplorationStatus,
  FindTaExplorationTask,
  FindTaHarmonyAnswerMap,
  FindTaHarmonyChoice,
  FindTaHarmonyStatus,
  FindTaParticipantView as ParticipantView,
  FindTaPublicProfile,
  FindTaScripturePuzzleStatus
} from "@/lib/find-ta-types";

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof data.message === "string" ? data.message : "请求失败，请稍后再试。");
  }

  return data as T;
}

const EXPLORATION_PHOTO_MAX_LENGTH = 120_000;
const EXPLORATION_PHOTO_MAX_SIDE = 640;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("照片读取失败，请重新选择一张照片。"));
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("照片读取失败，请重新选择一张照片。"));
    };
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject(new Error("这张照片暂时无法处理，请换一张 JPG 或 PNG 照片。"));
    image.onload = () => resolve(image);
    image.src = dataUrl;
  });
}

async function compressExplorationPhoto(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("请上传图片格式的照片。");
  }

  const originalDataUrl = await readFileAsDataUrl(file);

  if (originalDataUrl.length <= EXPLORATION_PHOTO_MAX_LENGTH) {
    return originalDataUrl;
  }

  const image = await loadImage(originalDataUrl);
  const scale = Math.min(1, EXPLORATION_PHOTO_MAX_SIDE / Math.max(image.width, image.height));
  let width = Math.max(1, Math.round(image.width * scale));
  let height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("浏览器暂时无法压缩照片，请换一张小一点的照片。");
  }

  const qualities = [0.72, 0.62, 0.52, 0.42, 0.34];

  for (let pass = 0; pass < 4; pass += 1) {
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of qualities) {
      const compressed = canvas.toDataURL("image/jpeg", quality);

      if (compressed.length <= EXPLORATION_PHOTO_MAX_LENGTH) {
        return compressed;
      }
    }

    width = Math.max(1, Math.round(width * 0.8));
    height = Math.max(1, Math.round(height * 0.8));
  }

  throw new Error("照片还是太大了，请换一张截图或更小的照片。");
}

function ClueCard({
  profile,
  title
}: {
  profile: FindTaPublicProfile;
  title: string;
}) {
  return (
    <article className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-orange-50 p-3 text-orange-600">
          <UserRound className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#9a4a1f]">{title}</p>
          <h2 className="text-2xl font-semibold text-slate-950">{profile.alias}</h2>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
        <div className="rounded-2xl bg-[#fff8ef] p-4">
          <dt className="font-semibold text-slate-900">兴趣爱好</dt>
          <dd className="mt-1">{profile.interests}</dd>
        </div>
        <div className="rounded-2xl bg-[#fff8ef] p-4">
          <dt className="font-semibold text-slate-900">今日穿搭</dt>
          <dd className="mt-1">{profile.outfit}</dd>
        </div>
        <div className="rounded-2xl bg-[#fff8ef] p-4">
          <dt className="font-semibold text-slate-900">确认暗号</dt>
          <dd className="mt-1">{profile.codePhrase}</dd>
        </div>
      </dl>
    </article>
  );
}

function ChallengeField({
  label,
  onChange,
  placeholder,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type="text"
        value={value}
      />
    </label>
  );
}

function ChallengeSummary({ challenge }: { challenge: FindTaCommonChallengeStatus }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-[#fff8ef] p-4">
        <p className="font-semibold text-slate-900">共同点</p>
        <ol className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
          {challenge.commonPoints.map((item, index) => (
            <li className="flex gap-2" key={`${item}-${index}`}>
              <span className="font-semibold text-[#9a4a1f]">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl bg-[#fff8ef] p-4">
        <p className="font-semibold text-slate-900">不同点</p>
        <ol className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
          {challenge.differences.map((item, index) => (
            <li className="flex gap-2" key={`${item}-${index}`}>
              <span className="font-semibold text-[#9a4a1f]">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {challenge.surprise ? (
        <div className="rounded-2xl bg-[#fff8ef] p-4">
          <p className="font-semibold text-slate-900">最意外的发现</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{challenge.surprise}</p>
        </div>
      ) : null}
    </div>
  );
}

function CommonChallengePanel({
  challenge,
  commonPoints,
  differences,
  isUnlocked,
  onCommonPointChange,
  onConfirm,
  onDifferenceChange,
  onSubmit,
  onSurpriseChange,
  surprise,
  taskBusy
}: {
  challenge: FindTaCommonChallengeStatus | null;
  commonPoints: string[];
  differences: string[];
  isUnlocked: boolean;
  onCommonPointChange: (index: number, value: string) => void;
  onConfirm: () => void;
  onDifferenceChange: (index: number, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSurpriseChange: (value: string) => void;
  surprise: string;
  taskBusy: boolean;
}) {
  const challengeStatus = !isUnlocked
    ? "会合后解锁"
    : challenge?.completed
      ? "已完成"
      : challenge?.selfConfirmed
        ? "等待队友确认"
        : challenge
          ? "请确认"
          : "可填写";

  return (
    <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">小队任务 1</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">小队共同点挑战</h2>
        </div>
        <StatusPill tone={challenge?.completed ? "emerald" : isUnlocked ? "amber" : "slate"}>
          {challengeStatus}
        </StatusPill>
      </div>

      {!isUnlocked ? (
        <div className="mt-5 rounded-2xl bg-[#fff8ef] p-5 text-sm font-semibold leading-7 text-slate-700">
          全队完成会合确认后，这里会开放填写。
        </div>
      ) : challenge ? (
        <div className="mt-5 grid gap-5">
          <div className="rounded-2xl border border-orange-100 bg-white p-4 text-sm font-semibold text-slate-700">
            提交人：{challenge.submittedByAlias} · 确认进度：{challenge.confirmedCount}/{challenge.totalCount}
          </div>
          <ChallengeSummary challenge={challenge} />
          {challenge.completed ? (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              已获得共同点挑战 20 分。
            </div>
          ) : challenge.selfConfirmed ? (
            <div className="rounded-2xl bg-[#fff8ef] p-4 text-sm font-semibold leading-7 text-slate-700">
              你已经确认，等待其他队友确认后加分。
            </div>
          ) : (
            <button
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#6f220d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
              disabled={taskBusy}
              onClick={onConfirm}
              type="button"
            >
              <CheckCircle2 className="h-4 w-4" />
              确认这份答案
            </button>
          )}
        </div>
      ) : (
        <form className="mt-5 grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            {commonPoints.map((value, index) => (
              <ChallengeField
                key={`common-${index}`}
                label="共同点"
                onChange={(nextValue) => onCommonPointChange(index, nextValue)}
                placeholder="例如：全队都喜欢音乐"
                value={value}
              />
            ))}

            {differences.map((value, index) => (
              <ChallengeField
                key={`difference-${index}`}
                label="不同点"
                onChange={(nextValue) => onDifferenceChange(index, nextValue)}
                placeholder="例如：有人早起，有人晚睡"
                value={value}
              />
            ))}
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">最意外的发现（可选）</span>
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              onChange={(event) => onSurpriseChange(event.target.value)}
              placeholder="例如：原来我们小时候都参加过类似营会"
              value={surprise}
            />
          </label>

          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#6f220d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
            disabled={taskBusy}
            type="submit"
          >
            <CheckCircle2 className="h-4 w-4" />
            提交小队任务
          </button>
        </form>
      )}
    </section>
  );
}

function HarmonyPanel({
  answers,
  challenge,
  isUnlocked,
  onAnswerChange,
  onSubmit,
  taskBusy
}: {
  answers: FindTaHarmonyAnswerMap;
  challenge: FindTaHarmonyStatus | null;
  isUnlocked: boolean;
  onAnswerChange: (questionId: string, value: FindTaHarmonyChoice) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  taskBusy: boolean;
}) {
  const status = !isUnlocked
    ? "共同点后解锁"
    : challenge?.completed
      ? "已完成"
      : challenge?.selfSubmitted
        ? "等待队友作答"
        : "可作答";

  return (
    <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">小队任务 2</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">默契测试</h2>
        </div>
        <StatusPill tone={challenge?.completed ? "emerald" : isUnlocked ? "amber" : "slate"}>{status}</StatusPill>
      </div>

      {!isUnlocked ? (
        <div className="mt-5 rounded-2xl bg-[#fff8ef] p-5 text-sm font-semibold leading-7 text-slate-700">
          小队完成共同点挑战后，这里会开放 10 题默契测试。
        </div>
      ) : challenge?.completed ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl bg-emerald-50 p-5 text-emerald-800">
            <p className="text-sm font-semibold">全队默契度</p>
            <p className="mt-2 text-4xl font-semibold">{challenge.percentage ?? 0}%</p>
            <p className="mt-2 text-sm font-semibold">
              {challenge.matches}/{challenge.questions.length} 题全队选择一致，已获得 20 分。
            </p>
          </div>
          <p className="rounded-2xl bg-[#fff8ef] p-4 text-sm font-semibold leading-7 text-slate-700">
            已作答：{challenge.submittedAliases.join(" / ")}
          </p>
        </div>
      ) : challenge?.selfSubmitted ? (
        <div className="mt-5 rounded-2xl bg-[#fff8ef] p-5 text-sm font-semibold leading-7 text-slate-700">
          你已经完成作答，等待队友提交。当前进度：{challenge.submittedCount}/{challenge.totalCount}
        </div>
      ) : (
        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          {challenge?.questions.map((question, index) => (
            <div className="rounded-2xl border border-orange-100 bg-[#fff8ef] p-4" key={question.id}>
              <p className="text-sm font-semibold text-[#9a4a1f]">第 {index + 1} 题</p>
              <p className="mt-1 font-semibold text-slate-950">{question.prompt}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["left", "right"] as const).map((choice) => {
                  const active = answers[question.id] === choice;
                  const label = choice === "left" ? question.left : question.right;

                  return (
                    <button
                      className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "border-[#8f2d12] bg-[#8f2d12] text-white shadow-sm"
                          : "border-orange-100 bg-white text-slate-800 hover:border-orange-200"
                      }`}
                      key={choice}
                      onClick={() => onAnswerChange(question.id, choice)}
                      type="button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#6f220d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
            disabled={taskBusy}
            type="submit"
          >
            <CheckCircle2 className="h-4 w-4" />
            提交默契测试
          </button>
        </form>
      )}
    </section>
  );
}

function ExplorationPanel({
  caption,
  challenge,
  feedback,
  isUnlocked,
  onCaptionChange,
  onPhotoChange,
  onSubmit,
  photoBusy,
  photoPreview,
  task,
  taskBusy
}: {
  caption: string;
  challenge: FindTaExplorationStatus | null;
  feedback: string;
  isUnlocked: boolean;
  onCaptionChange: (value: string) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  photoBusy: boolean;
  photoPreview: string;
  task: FindTaExplorationTask | null;
  taskBusy: boolean;
}) {
  const status = !isUnlocked ? "默契后解锁" : challenge?.completed ? "已完成" : "可提交";

  return (
    <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">小队任务 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">营地探索</h2>
        </div>
        <StatusPill tone={challenge?.completed ? "emerald" : isUnlocked ? "amber" : "slate"}>{status}</StatusPill>
      </div>

      <div className="mt-5 rounded-2xl bg-[#fff8ef] p-5">
        <p className="font-semibold text-slate-950">{task?.title ?? "等待任务生成"}</p>
        <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">
          {task?.description ?? "主持人分组后会自动生成探索任务。"}
        </p>
      </div>

      {!isUnlocked ? (
        <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-slate-700">
          小队完成默契测试后，这里会开放照片上传。
        </div>
      ) : challenge?.completed ? (
        <div className="mt-5 grid gap-4">
          {challenge.photoDataUrl ? (
            <img
              alt="探索任务照片"
              className="max-h-80 w-full rounded-2xl object-cover"
              src={challenge.photoDataUrl}
            />
          ) : null}
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-7 text-emerald-800">
            {challenge.submittedByAlias} 已提交：{challenge.caption}。小队已获得 30 分。
          </div>
        </div>
      ) : (
        <form className="mt-5 grid gap-5" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">上传任务照片</span>
            <input
              accept="image/*"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#8f2d12]"
              onChange={onPhotoChange}
              required
              type="file"
            />
            <span className="mt-2 block text-xs font-semibold leading-5 text-slate-500">
              系统会自动压缩照片，只保留给工作人员核对的小图。
            </span>
          </label>
          {feedback ? (
            <div className="rounded-2xl bg-orange-50 p-4 text-sm font-semibold leading-7 text-orange-700">
              {feedback}
            </div>
          ) : null}
          {photoPreview ? (
            <img alt="待提交照片预览" className="max-h-72 w-full rounded-2xl object-cover" src={photoPreview} />
          ) : (
            <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-orange-200 bg-[#fffaf3] text-orange-300">
              <Camera className="h-10 w-10" />
            </div>
          )}
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">任务说明</span>
            <textarea
              className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              onChange={(event) => onCaptionChange(event.target.value)}
              placeholder="例如：我们找到了工作人员 Sarah，一起在主会场门口完成合照。"
              required
              value={caption}
            />
          </label>
          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8f2d12] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#6f220d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
            disabled={taskBusy || photoBusy}
            type="submit"
          >
            <CheckCircle2 className="h-4 w-4" />
            {photoBusy ? "正在压缩照片" : taskBusy ? "提交中" : "提交探索任务"}
          </button>
        </form>
      )}
    </section>
  );
}

function ScripturePuzzlePanel({
  isUnlocked,
  puzzle
}: {
  isUnlocked: boolean;
  puzzle: FindTaScripturePuzzleStatus | null;
}) {
  const status = !isUnlocked ? "探索后解锁" : puzzle?.completed ? (puzzle.isWinner ? "拼图获胜" : "已完成") : "线下进行";

  return (
    <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">小队任务 4</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">金句拼图合作</h2>
        </div>
        <StatusPill tone={puzzle?.completed ? "emerald" : isUnlocked ? "amber" : "slate"}>{status}</StatusPill>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-2xl bg-[#fff8ef] p-5">
          <p className="font-semibold text-slate-950">活动目的</p>
          <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">
            通过拼图合作，促进组员沟通、团队合作，并认识不同的金句内容。
          </p>
        </div>

        {!isUnlocked ? (
          <div className="rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-slate-700">
            小队完成营地探索后，这里会作为最后一项线下任务开放。
          </div>
        ) : puzzle?.completed ? (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-7 text-emerald-800">
            {puzzle.isWinner ? "你的小队是最先完成金句拼图的小队。" : "你的小队已经完成金句拼图。"}已获得 20 分。
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-slate-700">
            拼好后举手示意工作人员检查；检查通过后，主持人会在后台标记完成。
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#fff8ef] p-4">
            <p className="font-semibold text-slate-950">活动准备</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-7 text-slate-700">
              <li>每组准备一张印有一句金句的纸。</li>
              <li>将每一句金句剪成 5 到 10 块。</li>
              <li>所有组别碎片混合放在同一区域。</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-[#fff8ef] p-4">
            <p className="font-semibold text-slate-950">活动时间</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-7 text-slate-700">
              <li>总时长约 10 到 15 分钟。</li>
              <li>说明规则 2 分钟。</li>
              <li>寻找拼图 5 到 8 分钟。</li>
              <li>拼图及检查 3 到 5 分钟。</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-[#fff8ef] p-4">
          <p className="font-semibold text-slate-950">活动规则</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-semibold leading-7 text-slate-700">
            <li>每组派代表到拼图区寻找属于自己组的拼图碎片。</li>
            <li>所有碎片混在一起，需要仔细辨认哪些属于本组金句。</li>
            <li>找到碎片后带回小队，全组合作把金句完整拼出来。</li>
            <li>拼好后举手示意工作人员检查。</li>
            <li>最先正确完成的小队获胜，或进入下一环节。</li>
          </ol>
        </div>

        <div className="rounded-2xl bg-[#fff8ef] p-4">
          <p className="font-semibold text-slate-950">注意事项</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-7 text-slate-700">
            <li>每次只能拿取自己认为属于本组的拼图碎片。</li>
            <li>如果发现拿错碎片，可以放回拼图区再寻找。</li>
            <li>不可故意藏起或带走其他组的拼图碎片。</li>
            <li>所有组员都应参与寻找或拼图。</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ScorePanel({
  commonChallenge,
  explorationChallenge,
  confirmedCount,
  harmonyChallenge,
  isCompleted,
  isPaired,
  selfConfirmed,
  scripturePuzzle,
  totalCount
}: {
  commonChallenge: FindTaCommonChallengeStatus | null;
  explorationChallenge: FindTaExplorationStatus | null;
  confirmedCount: number;
  harmonyChallenge: FindTaHarmonyStatus | null;
  isCompleted: boolean;
  isPaired: boolean;
  selfConfirmed: boolean;
  scripturePuzzle: FindTaScripturePuzzleStatus | null;
  totalCount: number;
}) {
  const commonStatus = !isCompleted
    ? "会合后解锁"
    : commonChallenge?.completed
      ? "已得分"
      : commonChallenge?.selfConfirmed
        ? "等待队友确认"
        : commonChallenge
          ? "请确认"
          : "可填写";
  const harmonyStatus = !commonChallenge?.completed
    ? "共同点后解锁"
    : harmonyChallenge?.completed
      ? "已得分"
      : harmonyChallenge?.selfSubmitted
        ? "等待队友作答"
        : "可作答";
  const explorationStatus = !harmonyChallenge?.completed
    ? "默契后解锁"
    : explorationChallenge?.completed
      ? "已得分"
      : "可提交";
  const scriptureStatus = !explorationChallenge?.completed
    ? "探索后解锁"
    : scripturePuzzle?.completed
      ? scripturePuzzle.isWinner
        ? "获胜得分"
        : "已得分"
      : "线下进行";
  const scoreItems = [
    {
      active: isCompleted,
      points: 10,
      status: isCompleted ? "已得分" : selfConfirmed ? "等待队友确认" : isPaired ? "待全队确认" : "等待分组",
      title: "找到小队"
    },
    {
      active: Boolean(commonChallenge?.completed),
      points: 20,
      status: commonStatus,
      title: "共同点挑战"
    },
    {
      active: Boolean(harmonyChallenge?.completed),
      points: 20,
      status: harmonyStatus,
      title: "默契测试"
    },
    {
      active: Boolean(explorationChallenge?.completed),
      points: 30,
      status: explorationStatus,
      title: "营地探索"
    },
    {
      active: Boolean(scripturePuzzle?.completed),
      points: 20,
      status: scriptureStatus,
      title: "金句拼图"
    }
  ];
  const currentScore =
    (isCompleted ? 10 : 0) +
    (commonChallenge?.completed ? 20 : 0) +
    (harmonyChallenge?.completed ? 20 : 0) +
    (explorationChallenge?.completed ? 30 : 0) +
    (scripturePuzzle?.completed ? 20 : 0);
  const maxScore = scoreItems.reduce((total, item) => total + item.points, 0);
  const progressLabel = isPaired ? `小队确认进度：${confirmedCount}/${totalCount}` : "确认进度：等待分组";

  return (
    <section className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-orange-50 p-3 text-orange-600">
            <Trophy className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">我的小队积分</p>
            <h2 className="text-2xl font-semibold text-slate-950">{currentScore} / {maxScore} 分</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">{progressLabel}</p>
          </div>
        </div>
        <StatusPill tone={currentScore > 0 ? "emerald" : selfConfirmed ? "slate" : "amber"}>
          {currentScore > 0 ? "已获得积分" : selfConfirmed ? "等待对方确认" : "等待得分"}
        </StatusPill>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-orange-50">
        <div
          className="h-full rounded-full bg-[#8f2d12] transition-all"
          style={{ width: `${(currentScore / maxScore) * 100}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3">
        {scoreItems.map((item) => {
          return (
            <div
              className="grid gap-3 rounded-2xl border border-orange-100 bg-[#fff8ef] p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              key={item.title}
            >
              <p className="font-semibold text-slate-950">{item.title}</p>
              <p className="text-sm font-semibold text-[#9a4a1f]">+{item.points} 分</p>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  item.active ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-600"
                }`}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FindTaParticipantView({
  participantId,
  roomCode
}: {
  participantId: string;
  roomCode: string;
}) {
  const normalizedRoomCode = roomCode.trim().toUpperCase();
  const [answers, setAnswers] = useState<FindTaHarmonyAnswerMap>({});
  const [busy, setBusy] = useState(false);
  const [explorationCaption, setExplorationCaption] = useState("");
  const [explorationFeedback, setExplorationFeedback] = useState("");
  const [explorationPhoto, setExplorationPhoto] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [commonPoints, setCommonPoints] = useState([""]);
  const [differences, setDifferences] = useState([""]);
  const [message, setMessage] = useState("");
  const [surprise, setSurprise] = useState("");
  const [taskBusy, setTaskBusy] = useState(false);
  const [view, setView] = useState<ParticipantView | null>(null);

  useEffect(() => {
    void loadView();

    const timer = window.setInterval(() => {
      void loadView(true);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [normalizedRoomCode, participantId]);

  useEffect(() => {
    if (!view?.commonChallenge) {
      return;
    }

    setCommonPoints(view.commonChallenge.commonPoints);
    setDifferences(view.commonChallenge.differences);
    setSurprise(view.commonChallenge.surprise);
  }, [view?.commonChallenge?.submittedAt]);

  useEffect(() => {
    if (!view?.harmonyChallenge?.selfSubmitted) {
      return;
    }

    setAnswers(view.harmonyChallenge.selfAnswers);
  }, [view?.harmonyChallenge?.selfSubmitted]);

  useEffect(() => {
    if (!view?.explorationChallenge) {
      return;
    }

    setExplorationCaption(view.explorationChallenge.caption);
    setExplorationPhoto(view.explorationChallenge.photoDataUrl);
  }, [view?.explorationChallenge?.completedAt]);

  async function loadView(quiet = false) {
    try {
      if (!quiet) {
        setMessage("");
      }

      setView(
        await readJson<ParticipantView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants/${participantId}`, {
            cache: "no-store"
          })
        )
      );
    } catch (error) {
      if (!quiet) {
        setMessage(error instanceof Error ? error.message : "读取分组结果失败。");
      }
    }
  }

  async function handleComplete() {
    try {
      setBusy(true);
      setMessage("");
      setView(
        await readJson<ParticipantView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants/${participantId}/complete`, {
            method: "POST"
          })
        )
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败。");
    } finally {
      setBusy(false);
    }
  }

  function updateCommonPoint(index: number, value: string) {
    setCommonPoints((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function updateDifference(index: number, value: string) {
    setDifferences((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  async function handleCommonSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setTaskBusy(true);
      setMessage("");
      setView(
        await readJson<ParticipantView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants/${participantId}/common`, {
            body: JSON.stringify({
              action: "submit",
              commonPoints,
              differences,
              surprise
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
        )
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "共同点挑战提交失败。");
    } finally {
      setTaskBusy(false);
    }
  }

  async function handleCommonConfirm() {
    try {
      setTaskBusy(true);
      setMessage("");
      setView(
        await readJson<ParticipantView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants/${participantId}/common`, {
            body: JSON.stringify({
              action: "confirm"
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
        )
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "共同点挑战确认失败。");
    } finally {
      setTaskBusy(false);
    }
  }

  function updateAnswer(questionId: string, value: FindTaHarmonyChoice) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value
    }));
  }

  async function handleHarmonySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setTaskBusy(true);
      setMessage("");
      setView(
        await readJson<ParticipantView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants/${participantId}/harmony`, {
            body: JSON.stringify({
              answers
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
        )
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "默契测试提交失败。");
    } finally {
      setTaskBusy(false);
    }
  }

  async function handleExplorationPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setExplorationPhoto("");
      setExplorationFeedback("");
      return;
    }

    try {
      setPhotoBusy(true);
      setExplorationFeedback("正在压缩照片，请稍等。");
      setMessage("");

      const compressedPhoto = await compressExplorationPhoto(file);

      setExplorationPhoto(compressedPhoto);
      setExplorationFeedback("照片已压缩，可以提交。");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "照片处理失败，请换一张照片。";

      setExplorationPhoto("");
      setExplorationFeedback(nextMessage);
      setMessage(nextMessage);
      event.target.value = "";
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handleExplorationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setTaskBusy(true);
      setMessage("");
      setExplorationFeedback("");

      if (!explorationPhoto) {
        throw new Error("请先上传探索任务照片。");
      }

      if (explorationPhoto.length > EXPLORATION_PHOTO_MAX_LENGTH) {
        throw new Error("照片太大了，请重新选择一张照片，系统会自动压缩后再提交。");
      }

      setView(
        await readJson<ParticipantView>(
          await fetch(`/api/find-ta/rooms/${normalizedRoomCode}/participants/${participantId}/exploration`, {
            body: JSON.stringify({
              caption: explorationCaption,
              photoDataUrl: explorationPhoto
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
        )
      );
      setExplorationFeedback("");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "营地探索提交失败。";

      setExplorationFeedback(nextMessage);
      setMessage(nextMessage);
    } finally {
      setTaskBusy(false);
    }
  }

  const isPaired = Boolean(view?.pair && view.partners.length > 0);
  const isCompleted = Boolean(view?.pair?.completed);
  const selfConfirmed = Boolean(view?.pair?.selfConfirmed);
  const confirmedCount = view?.pair?.confirmedCount ?? 0;
  const totalCount = view?.pair?.totalCount ?? 2;
  const commonCompleted = Boolean(view?.commonChallenge?.completed);
  const harmonyCompleted = Boolean(view?.harmonyChallenge?.completed);
  const explorationCompleted = Boolean(view?.explorationChallenge?.completed);

  return (
    <FindTaRoomFrame
      description="保持匿名，先根据线索找到同组队友。全队确认彼此后，完成击掌并点击成功会合。"
      eyebrow="我的小队页"
      title={`房间 ${normalizedRoomCode}`}
    >
      <section className="py-10 sm:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="space-y-5">
              <div className="rounded-[1.25rem] border border-orange-100 bg-white p-6 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold tracking-[0.16em] text-[#9a4a1f]">当前状态</p>
                  <StatusPill tone={isCompleted ? "emerald" : confirmedCount > 0 ? "amber" : isPaired ? "amber" : "slate"}>
                    {isCompleted
                      ? "已会合"
                      : selfConfirmed
                        ? "等队友确认"
                        : confirmedCount > 0
                          ? "有队友已确认"
                          : isPaired
                            ? "已分组"
                            : "等待中"}
                  </StatusPill>
                </div>

                {view ? (
                  <div className="mt-5 rounded-2xl bg-[#fff8ef] p-4">
                    <p className="text-sm font-semibold text-[#9a4a1f]">我的匿名代号</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">{view.self.alias}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      房间人数：{view.room.participantCount} / 轮次：{view.room.round || "尚未开始"}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid min-h-32 place-items-center rounded-2xl bg-[#fff8ef] p-4 text-center">
                    <Clock3 className="h-9 w-9 text-orange-300" />
                  </div>
                )}

                <button
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a3a18] transition hover:-translate-y-0.5 hover:bg-[#fbf6ef]"
                  onClick={() => void loadView()}
                  type="button"
                >
                  <RefreshCcw className="h-4 w-4" />
                  刷新状态
                </button>
                {message ? <p className="mt-4 text-sm font-semibold text-orange-700">{message}</p> : null}
              </div>

              <div className="rounded-[1.25rem] border border-orange-100 bg-[#fff8ef] p-6 shadow-card">
                <div className="inline-flex rounded-2xl bg-white p-3 text-orange-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">线下任务</h2>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700">
                  {["看队友线索", "找到全部队友", "用暗号互相确认", "全队击掌完成"].map((item, index) => (
                    <div className="flex items-center gap-3 rounded-2xl bg-white p-3" key={item}>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 text-[#9a4a1f]">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              {!view ? (
                <div className="rounded-[1.25rem] border border-orange-100 bg-white p-8 text-center shadow-card">
                  <Clock3 className="mx-auto h-12 w-12 text-orange-300" />
                  <p className="mt-4 font-semibold text-slate-900">正在读取你的页面</p>
                </div>
              ) : isPaired ? (
                <>
                  <div className="rounded-[1.25rem] border border-emerald-100 bg-emerald-50 p-5 shadow-card sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold tracking-[0.16em] text-emerald-700">
                          分组已生成
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                          你的小队队友已出现
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          页面不会显示真实姓名，请根据线索去现场找到全部队友。
                        </p>
                      </div>
                      <button
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={busy || isCompleted || selfConfirmed}
                        onClick={handleComplete}
                        type="button"
                      >
                        {isCompleted || selfConfirmed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Handshake className="h-4 w-4" />
                        )}
                        {isCompleted ? "已成功会合" : selfConfirmed ? "已确认，等队友" : "我已找到小队"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {view.partners.map((partner, index) => (
                      <ClueCard
                        key={partner.id}
                        profile={partner}
                        title={`队友 ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-[1.25rem] border border-orange-100 bg-white p-8 text-center shadow-card">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-orange-600">
                    <Clock3 className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-slate-950">
                    {view.waitingReason === "joinedAfterPairing" ? "等待下一轮分组" : "等待主持人开始分组"}
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-700">
                    保持这个页面打开，主持人开始分组后会自动刷新出你的小队线索卡。
                  </p>
                </div>
              )}

              <ScorePanel
                commonChallenge={view?.commonChallenge ?? null}
                explorationChallenge={view?.explorationChallenge ?? null}
                confirmedCount={confirmedCount}
                harmonyChallenge={view?.harmonyChallenge ?? null}
                isCompleted={isCompleted}
                isPaired={isPaired}
                selfConfirmed={selfConfirmed}
                scripturePuzzle={view?.scripturePuzzle ?? null}
                totalCount={totalCount}
              />

              <CommonChallengePanel
                challenge={view?.commonChallenge ?? null}
                commonPoints={commonPoints}
                differences={differences}
                isUnlocked={isCompleted}
                onCommonPointChange={updateCommonPoint}
                onConfirm={() => void handleCommonConfirm()}
                onDifferenceChange={updateDifference}
                onSubmit={(event) => void handleCommonSubmit(event)}
                onSurpriseChange={setSurprise}
                surprise={surprise}
                taskBusy={taskBusy}
              />

              <HarmonyPanel
                answers={answers}
                challenge={view?.harmonyChallenge ?? null}
                isUnlocked={commonCompleted}
                onAnswerChange={updateAnswer}
                onSubmit={(event) => void handleHarmonySubmit(event)}
                taskBusy={taskBusy}
              />

              <ExplorationPanel
                caption={explorationCaption}
                challenge={view?.explorationChallenge ?? null}
                feedback={explorationFeedback}
                isUnlocked={harmonyCompleted}
                onCaptionChange={setExplorationCaption}
                onPhotoChange={(event) => void handleExplorationPhotoChange(event)}
                onSubmit={(event) => void handleExplorationSubmit(event)}
                photoBusy={photoBusy}
                photoPreview={explorationPhoto}
                task={view?.explorationTask ?? null}
                taskBusy={taskBusy}
              />

              <ScripturePuzzlePanel
                isUnlocked={explorationCompleted}
                puzzle={view?.scripturePuzzle ?? null}
              />

              <div className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-card sm:p-6">
                <h2 className="text-xl font-semibold text-slate-950">游戏规则</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#fff8ef] p-4">
                    <p className="font-semibold text-slate-900">可以分享</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">兴趣、穿搭、指定暗号。</p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8ef] p-4">
                    <p className="font-semibold text-slate-900">不要透露</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">姓名、照片、房间号等明显身份信息。</p>
                  </div>
                </div>
                <Link className="mt-5 inline-flex text-sm font-semibold text-[#9a4a1f]" href="/find-ta">
                  返回活动说明
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </FindTaRoomFrame>
  );
}
