import "server-only";

import { Redis } from "@upstash/redis";
import { randomBytes, randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  FindTaCommonChallengeInput,
  FindTaCommonChallengeStatus,
  FindTaExplorationStatus,
  FindTaExplorationTask,
  FindTaHostPair,
  FindTaHostParticipant,
  FindTaHostRoomView,
  FindTaHarmonyAnswerMap,
  FindTaHarmonyChoice,
  FindTaHarmonyQuestion,
  FindTaHarmonyStatus,
  FindTaLobbyView,
  FindTaParticipantInput,
  FindTaParticipantView,
  FindTaProfileFields,
  FindTaPublicProfile,
  FindTaRoomStatus,
  FindTaRoomSummary,
  FindTaScripturePuzzleStatus
} from "@/lib/find-ta-types";

type ParticipantRecord = FindTaParticipantInput & {
  id: string;
  joinedAt: string;
  roomCode: string;
};

type CommonChallengeRecord = FindTaCommonChallengeInput & {
  completed: boolean;
  completedAt: string | null;
  confirmedIds: string[];
  submittedAt: string;
  submittedBy: string;
};

type HarmonyChallengeRecord = {
  answers: Record<string, FindTaHarmonyAnswerMap>;
  completed: boolean;
  completedAt: string | null;
};

type ExplorationChallengeRecord = {
  caption: string;
  completed: boolean;
  completedAt: string | null;
  photoDataUrl: string;
  submittedBy: string;
};

type ScripturePuzzleRecord = {
  completed: boolean;
  completedAt: string | null;
};

type PairRecord = {
  completed: boolean;
  completedAt: string | null;
  commonChallenge?: CommonChallengeRecord;
  confirmedIds?: string[];
  createdAt?: string;
  explorationChallenge?: ExplorationChallengeRecord;
  explorationTaskId?: string;
  harmonyChallenge?: HarmonyChallengeRecord;
  harmonyQuestionIds?: string[];
  id: string;
  memberIds: string[];
  scripturePuzzle?: ScripturePuzzleRecord;
};

type RoomRecord = {
  code: string;
  createdAt: string;
  hostToken: string;
  pairs: PairRecord[];
  participants: Record<string, ParticipantRecord>;
  round: number;
  status: FindTaRoomStatus;
};

type RoomMemory = {
  rooms: Map<string, RoomRecord>;
};

type PersistedRoomMemory = {
  rooms?: RoomRecord[];
};

const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_DATA_DIR = process.env.FIND_TA_DATA_DIR || join(process.cwd(), ".local-data");
const ROOM_DATA_FILE = join(ROOM_DATA_DIR, "find-ta-rooms.json");
const ROOM_REDIS_KEY = process.env.FIND_TA_REDIS_KEY || "heartfire:find-ta:rooms";
const ROOM_LOCK_KEY = `${ROOM_REDIS_KEY}:lock`;
const LOCK_TTL_MS = 5000;
const LOCK_WAIT_MS = 5000;
const TARGET_PARTICIPANTS = 60;
const TARGET_GROUP_SIZE = 4;

let redisClient: Redis | null | undefined;

const HARMONY_QUESTION_POOL: FindTaHarmonyQuestion[] = [
  { id: "drink", prompt: "现在最想喝什么？", left: "咖啡", right: "奶茶" },
  { id: "place", prompt: "更想去哪里放松？", left: "海边", right: "山上" },
  { id: "phone", prompt: "手机阵营更接近？", left: "iPhone", right: "Android" },
  { id: "sleep", prompt: "作息更像哪一种？", left: "早起", right: "晚睡" },
  { id: "talk", prompt: "认识新朋友时？", left: "先观察", right: "先开口" },
  { id: "music", prompt: "听音乐更偏向？", left: "安静旋律", right: "热闹节奏" },
  { id: "food", prompt: "聚会食物更想选？", left: "火锅", right: "烧烤" },
  { id: "weather", prompt: "更喜欢哪种天气？", left: "晴天", right: "下雨" },
  { id: "activity", prompt: "营会空档更想？", left: "运动", right: "聊天" },
  { id: "memory", prompt: "更容易记住？", left: "人的名字", right: "人的故事" },
  { id: "photo", prompt: "拍照风格更像？", left: "认真摆拍", right: "随手抓拍" },
  { id: "city", prompt: "旅行更喜欢？", left: "老城散步", right: "自然风景" }
];

const EXPLORATION_TASK_POOL: FindTaExplorationTask[] = [
  {
    description: "找到一位工作人员，全队一起完成合照。",
    id: "staff-photo",
    title: "工作人员合照"
  },
  {
    description: "找到另一组小队，两个小队一起完成一张合照。",
    id: "team-photo",
    title: "寻找另一组"
  },
  {
    description: "找到营地里最有代表性的地点，全队一起拍照打卡。",
    id: "camp-spot",
    title: "营地地点打卡"
  },
  {
    description: "找到一个能代表“爱，怎么翻译”的物件或场景，并拍照上传。",
    id: "love-translation",
    title: "主题照片"
  }
];

function parseRoomMemory(value: unknown): RoomMemory {
  const rooms = new Map<string, RoomRecord>();
  let data = value;

  if (typeof value === "string") {
    try {
      data = JSON.parse(value) as PersistedRoomMemory;
    } catch {
      return { rooms };
    }
  }

  if (!data || typeof data !== "object") {
    return { rooms };
  }

  for (const room of (data as PersistedRoomMemory).rooms ?? []) {
    if (
      room &&
      typeof room.code === "string" &&
      typeof room.hostToken === "string" &&
      room.participants &&
      typeof room.participants === "object" &&
      Array.isArray(room.pairs)
    ) {
      rooms.set(room.code.trim().toUpperCase(), room);
    }
  }

  return { rooms };
}

function loadFileRoomMemory(): RoomMemory {
  if (!existsSync(ROOM_DATA_FILE)) {
    return { rooms: new Map() };
  }

  try {
    return parseRoomMemory(JSON.parse(readFileSync(ROOM_DATA_FILE, "utf8")) as PersistedRoomMemory);
  } catch {
    return { rooms: new Map() };
  }
}

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({ token, url });
  return redisClient;
}

async function loadRoomMemory(): Promise<RoomMemory> {
  const redis = getRedisClient();

  if (redis) {
    const data = await redis.get<PersistedRoomMemory | string>(ROOM_REDIS_KEY);
    return parseRoomMemory(data);
  }

  return loadFileRoomMemory();
}

async function saveRoomMemory(nextMemory: RoomMemory) {
  const persisted: PersistedRoomMemory = {
    rooms: Array.from(nextMemory.rooms.values())
  };
  const redis = getRedisClient();

  if (redis) {
    await redis.set(ROOM_REDIS_KEY, persisted);
    return;
  }

  if (process.env.VERCEL === "1") {
    throw new Error("Find TA persistent storage is not configured. Add Upstash Redis REST environment variables.");
  }

  mkdirSync(ROOM_DATA_DIR, { recursive: true });
  writeFileSync(ROOM_DATA_FILE, JSON.stringify(persisted, null, 2));
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withRedisRoomLock<T>(callback: () => Promise<T>) {
  const redis = getRedisClient();

  if (!redis) {
    return callback();
  }

  const token = randomUUID();
  const deadline = Date.now() + LOCK_WAIT_MS;

  while (Date.now() < deadline) {
    const locked = await redis.set(ROOM_LOCK_KEY, token, { nx: true, px: LOCK_TTL_MS });

    if (locked) {
      try {
        return await callback();
      } finally {
        const currentToken = await redis.get<string>(ROOM_LOCK_KEY);

        if (currentToken === token) {
          await redis.del(ROOM_LOCK_KEY);
        }
      }
    }

    await delay(75);
  }

  throw new Error("Find TA room storage is busy. Please retry.");
}

async function withRoomMemory<T>(
  callback: (nextMemory: RoomMemory) => T | Promise<T>,
  options: { save?: boolean } = {}
) {
  const shouldSave = Boolean(options.save);

  if (shouldSave && getRedisClient()) {
    return withRedisRoomLock(async () => {
      const nextMemory = await loadRoomMemory();
      const result = await callback(nextMemory);
      await saveRoomMemory(nextMemory);
      return result;
    });
  }

  const nextMemory = await loadRoomMemory();
  const result = await callback(nextMemory);

  if (shouldSave) {
    await saveRoomMemory(nextMemory);
  }

  return result;
}

export class FindTaRoomError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "FindTaRoomError";
    this.status = status;
  }
}

export function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function cleanText(value: unknown, maxLength = 360) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function makeRoomCode() {
  let code = "";

  for (let index = 0; index < 5; index += 1) {
    const randomIndex = randomBytes(1)[0] % ROOM_ALPHABET.length;
    code += ROOM_ALPHABET[randomIndex];
  }

  return code;
}

function makeHostToken() {
  return randomBytes(24).toString("base64url");
}

function makeSummary(room: RoomRecord): FindTaRoomSummary {
  return {
    code: room.code,
    createdAt: room.createdAt,
    participantCount: Object.keys(room.participants).length,
    round: room.round,
    status: room.status
  };
}

function toPublicProfile(participant: ParticipantRecord): FindTaPublicProfile {
  return {
    alias: participant.alias,
    codePhrase: participant.codePhrase,
    id: participant.id,
    interests: participant.interests,
    joinedAt: participant.joinedAt,
    outfit: participant.outfit
  };
}

function getPairForParticipant(room: RoomRecord, participantId: string) {
  return room.pairs.find((pair) => pair.memberIds.includes(participantId)) ?? null;
}

function getPairConfirmedIds(pair: PairRecord) {
  if (pair.completed && (!pair.confirmedIds || pair.confirmedIds.length === 0)) {
    return [...pair.memberIds];
  }

  return pair.confirmedIds ?? [];
}

function getPairConfirmedCount(pair: PairRecord) {
  const confirmedIds = new Set(getPairConfirmedIds(pair));

  return pair.memberIds.filter((id) => confirmedIds.has(id)).length;
}

function getCommonChallengeConfirmedCount(pair: PairRecord) {
  const confirmedIds = new Set(pair.commonChallenge?.confirmedIds ?? []);

  return pair.memberIds.filter((id) => confirmedIds.has(id)).length;
}

function getCommonChallengeScore(pair: PairRecord) {
  return pair.commonChallenge?.completed ? 20 : 0;
}

function getHarmonyScore(pair: PairRecord) {
  return pair.harmonyChallenge?.completed ? 20 : 0;
}

function getExplorationScore(pair: PairRecord) {
  return pair.explorationChallenge?.completed ? 30 : 0;
}

function getScripturePuzzleScore(pair: PairRecord) {
  return pair.scripturePuzzle?.completed ? 20 : 0;
}

function getPairScore(pair: PairRecord) {
  return (
    (pair.completed ? 10 : 0) +
    getCommonChallengeScore(pair) +
    getHarmonyScore(pair) +
    getExplorationScore(pair) +
    getScripturePuzzleScore(pair)
  );
}

function getPairCompletedTaskCount(pair: PairRecord) {
  return (
    (pair.completed ? 1 : 0) +
    (pair.commonChallenge?.completed ? 1 : 0) +
    (pair.harmonyChallenge?.completed ? 1 : 0) +
    (pair.explorationChallenge?.completed ? 1 : 0) +
    (pair.scripturePuzzle?.completed ? 1 : 0)
  );
}

function getScripturePuzzleWinnerPairId(room: RoomRecord) {
  return (
    [...room.pairs]
      .filter((pair) => pair.scripturePuzzle?.completedAt)
      .sort((left, right) =>
        (left.scripturePuzzle?.completedAt ?? "").localeCompare(right.scripturePuzzle?.completedAt ?? "")
      )[0]?.id ?? null
  );
}

function getRandomHarmonyQuestionIds() {
  return shuffle(HARMONY_QUESTION_POOL.map((question) => question.id)).slice(0, 10);
}

function getRandomExplorationTaskId() {
  const randomIndex = randomBytes(1)[0] % EXPLORATION_TASK_POOL.length;

  return EXPLORATION_TASK_POOL[randomIndex]?.id ?? EXPLORATION_TASK_POOL[0].id;
}

function getPairHarmonyQuestions(pair: PairRecord) {
  const ids = pair.harmonyQuestionIds?.length
    ? pair.harmonyQuestionIds
    : HARMONY_QUESTION_POOL.slice(0, 10).map((question) => question.id);
  const questionMap = new Map(HARMONY_QUESTION_POOL.map((question) => [question.id, question]));

  return ids.map((id) => questionMap.get(id)).filter(Boolean) as FindTaHarmonyQuestion[];
}

function getPairExplorationTask(pair: PairRecord) {
  return (
    EXPLORATION_TASK_POOL.find((task) => task.id === pair.explorationTaskId) ??
    EXPLORATION_TASK_POOL[0]
  );
}

function getHarmonyMatchCount(pair: PairRecord) {
  const challenge = pair.harmonyChallenge;

  if (!challenge?.completed) {
    return 0;
  }

  return getPairHarmonyQuestions(pair).filter((question) => {
    const answers = pair.memberIds.map((memberId) => challenge.answers[memberId]?.[question.id]);
    const firstAnswer = answers[0];

    return Boolean(firstAnswer) && answers.every((answer) => answer === firstAnswer);
  }).length;
}

function toCommonChallengeView(
  room: RoomRecord,
  pair: PairRecord,
  participantId?: string
): FindTaCommonChallengeStatus | null {
  const challenge = pair.commonChallenge;

  if (!challenge) {
    return null;
  }

  const submittedBy = room.participants[challenge.submittedBy];

  return {
    commonPoints: challenge.commonPoints,
    completed: challenge.completed,
    completedAt: challenge.completedAt,
    confirmedCount: getCommonChallengeConfirmedCount(pair),
    differences: challenge.differences,
    selfConfirmed: participantId ? challenge.confirmedIds.includes(participantId) : false,
    selfSubmitted: participantId ? challenge.submittedBy === participantId : false,
    submittedAt: challenge.submittedAt,
    submittedByAlias: submittedBy?.alias ?? "匿名队友",
    surprise: challenge.surprise,
    totalCount: pair.memberIds.length
  };
}

function toHarmonyChallengeView(pair: PairRecord, room: RoomRecord, participantId?: string): FindTaHarmonyStatus {
  const challenge = pair.harmonyChallenge;
  const questions = getPairHarmonyQuestions(pair);
  const submittedIds = pair.memberIds.filter((memberId) => Boolean(challenge?.answers[memberId]));
  const matches = getHarmonyMatchCount(pair);
  const percentage = challenge?.completed ? Math.round((matches / questions.length) * 100) : null;

  return {
    completed: Boolean(challenge?.completed),
    completedAt: challenge?.completedAt ?? null,
    matches,
    percentage,
    questions,
    selfAnswers: participantId ? challenge?.answers[participantId] ?? {} : {},
    selfSubmitted: participantId ? Boolean(challenge?.answers[participantId]) : false,
    submittedAliases: submittedIds.map((memberId) => room.participants[memberId]?.alias ?? "匿名队友"),
    submittedCount: submittedIds.length,
    totalCount: pair.memberIds.length
  };
}

function toExplorationChallengeView(pair: PairRecord, room: RoomRecord): FindTaExplorationStatus | null {
  const challenge = pair.explorationChallenge;

  if (!challenge) {
    return null;
  }

  return {
    caption: challenge.caption,
    completed: challenge.completed,
    completedAt: challenge.completedAt,
    photoDataUrl: challenge.photoDataUrl,
    submittedByAlias: room.participants[challenge.submittedBy]?.alias ?? "匿名队友",
    task: getPairExplorationTask(pair)
  };
}

function toScripturePuzzleView(pair: PairRecord, room: RoomRecord): FindTaScripturePuzzleStatus {
  return {
    completed: Boolean(pair.scripturePuzzle?.completed),
    completedAt: pair.scripturePuzzle?.completedAt ?? null,
    isWinner: Boolean(pair.scripturePuzzle?.completed && getScripturePuzzleWinnerPairId(room) === pair.id)
  };
}

function toHostParticipant(room: RoomRecord, participant: ParticipantRecord): FindTaHostParticipant {
  const pair = getPairForParticipant(room, participant.id);

  return {
    ...toPublicProfile(participant),
    group: participant.group,
    pairId: pair?.id ?? null,
    realName: participant.realName
  };
}

function getRoomOrThrow(nextMemory: RoomMemory, code: string) {
  const normalizedCode = normalizeRoomCode(code);
  const room = nextMemory.rooms.get(normalizedCode);

  if (!room) {
    throw new FindTaRoomError("没有找到这个房间，请确认房间码。", 404);
  }

  return room;
}

function requireHost(room: RoomRecord, token: string) {
  if (!token || token !== room.hostToken) {
    throw new FindTaRoomError("主持人验证失败，请使用创建房间时生成的后台链接进入。", 401);
  }
}

function sanitizeParticipantInput(input: Partial<FindTaParticipantInput>): FindTaParticipantInput {
  const participant = {
    alias: cleanText(input.alias, 80),
    codePhrase: cleanText(input.codePhrase, 120),
    group: cleanText(input.group, 80),
    interests: cleanText(input.interests),
    outfit: cleanText(input.outfit),
    realName: cleanText(input.realName, 80)
  };

  if (
    !participant.realName ||
    !participant.alias ||
    !participant.interests ||
    !participant.outfit ||
    !participant.codePhrase
  ) {
    throw new FindTaRoomError("请填写真实姓名和所有必要匿名线索。");
  }

  return participant;
}

function cleanTextList(value: unknown, requiredLength: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, requiredLength).map((item) => cleanText(item, 120));
}

function sanitizeCommonChallengeInput(input: Partial<FindTaCommonChallengeInput>): FindTaCommonChallengeInput {
  const challenge = {
    commonPoints: cleanTextList(input.commonPoints, 1),
    differences: cleanTextList(input.differences, 1),
    surprise: cleanText(input.surprise, 180)
  };

  if (
    challenge.commonPoints.length !== 1 ||
    challenge.differences.length !== 1 ||
    challenge.commonPoints.some((item) => !item) ||
    challenge.differences.some((item) => !item)
  ) {
    throw new FindTaRoomError("请填写 1 个小队共同点和 1 个小队不同点。");
  }

  return challenge;
}

function sanitizeHarmonyAnswers(input: unknown, questions: FindTaHarmonyQuestion[]): FindTaHarmonyAnswerMap {
  if (!input || typeof input !== "object") {
    throw new FindTaRoomError("请完成全部默契测试题目。");
  }

  const rawAnswers = input as Record<string, unknown>;
  const answers = questions.reduce<FindTaHarmonyAnswerMap>((result, question) => {
    const answer = rawAnswers[question.id];

    if (answer === "left" || answer === "right") {
      result[question.id] = answer;
    }

    return result;
  }, {});

  if (questions.some((question) => !answers[question.id])) {
    throw new FindTaRoomError("请完成全部默契测试题目。");
  }

  return answers;
}

function sanitizeExplorationInput(input: { caption?: unknown; photoDataUrl?: unknown }) {
  const caption = cleanText(input.caption, 160);
  const photoDataUrl = typeof input.photoDataUrl === "string" ? input.photoDataUrl.trim() : "";

  if (!caption) {
    throw new FindTaRoomError("请填写探索任务说明。");
  }

  if (!photoDataUrl.startsWith("data:image/")) {
    throw new FindTaRoomError("请上传一张探索任务照片。");
  }

  if (photoDataUrl.length > 1_200_000) {
    throw new FindTaRoomError("照片太大了，请换一张小一点的照片。");
  }

  return {
    caption,
    photoDataUrl
  };
}

function shuffle(values: string[]) {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const nextIndex = randomBytes(1)[0] % (index + 1);
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
  }

  return items;
}

function makeGroupMemberSets(participantIds: string[]) {
  const groups: string[][] = [];

  for (let index = 0; index < participantIds.length; index += TARGET_GROUP_SIZE) {
    groups.push(participantIds.slice(index, index + TARGET_GROUP_SIZE));
  }

  const lastGroup = groups[groups.length - 1];
  const previousGroup = groups[groups.length - 2];

  if (lastGroup?.length === 1 && previousGroup?.length) {
    const movedMember = previousGroup.pop();

    if (movedMember) {
      lastGroup.unshift(movedMember);
    }
  }

  return groups.filter((group) => group.length > 0);
}

export async function createFindTaRoom() {
  return withRoomMemory(
    (nextMemory) => {
      let code = makeRoomCode();

      while (nextMemory.rooms.has(code)) {
        code = makeRoomCode();
      }

      const room: RoomRecord = {
        code,
        createdAt: new Date().toISOString(),
        hostToken: makeHostToken(),
        pairs: [],
        participants: {},
        round: 0,
        status: "waiting"
      };

      nextMemory.rooms.set(code, room);

      return makeHostRoomView(room, room.hostToken);
    },
    { save: true }
  );
}

export async function getRoomSummary(code: string) {
  return withRoomMemory((nextMemory) => makeSummary(getRoomOrThrow(nextMemory, code)));
}

function makeFindTaLobbyView(room: RoomRecord): FindTaLobbyView {
  const participants = Object.values(room.participants).sort((left, right) =>
    left.joinedAt.localeCompare(right.joinedAt)
  );
  const pairedParticipantIds = new Set(room.pairs.flatMap((pair) => pair.memberIds));
  const completedPairs = room.pairs.filter((pair) => pair.completed);
  const puzzleWinnerPairId = getScripturePuzzleWinnerPairId(room);
  const fullyCompletedPairs = room.pairs.filter((pair) => pair.scripturePuzzle?.completed);
  const completedParticipantCount = fullyCompletedPairs.reduce((total, pair) => total + pair.memberIds.length, 0);
  const leaderboard = room.pairs
    .map((pair, index) => {
      const members = pair.memberIds.map((id) => room.participants[id]).filter(Boolean);
      const confirmedCount = getPairConfirmedCount(pair);
      const score = getPairScore(pair);
      const completedTasks = getPairCompletedTaskCount(pair);

      return {
        completedTasks,
        id: pair.id,
        label: pair.completed ? members.map((member) => member.alias).join(" / ") : `匿名小队 ${index + 1}`,
        rank: 0,
        score,
        status: pair.scripturePuzzle?.completed
          ? (pair.id === puzzleWinnerPairId ? ("拼图获胜" as const) : ("拼图完成" as const))
          : pair.explorationChallenge?.completed
          ? ("探索完成" as const)
          : pair.harmonyChallenge?.completed
            ? ("默契完成" as const)
            : pair.commonChallenge?.completed
          ? ("共同点完成" as const)
          : pair.commonChallenge
            ? ("任务中" as const)
            : pair.completed
              ? ("已会合" as const)
              : confirmedCount > 0
                ? ("确认中" as const)
                : ("寻找中" as const)
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score || right.completedTasks - left.completedTasks || left.id.localeCompare(right.id)
    )
    .slice(0, 10)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  const activities = [
    {
      id: `room-${room.code}`,
      text: `房间 ${room.code} 已开启`,
      time: room.createdAt,
      type: "room" as const
    },
    ...participants.map((participant) => ({
      id: `join-${participant.id}`,
      text: `${participant.alias} 已进入房间`,
      time: participant.joinedAt,
      type: "join" as const
    })),
    ...(room.status === "paired"
      ? [
          {
            id: `pair-${room.round}`,
            text: `第 ${room.round} 轮已生成 ${room.pairs.length} 个匿名小队`,
            time: room.pairs[0]?.createdAt ?? room.createdAt,
            type: "pair" as const
          }
        ]
      : []),
    ...completedPairs.map((pair, index) => ({
      id: `complete-${pair.id}`,
      text: `一个小队完成会合，获得 10 分`,
      time: pair.completedAt ?? room.createdAt,
      type: "complete" as const
    })),
    ...room.pairs
      .filter((pair) => pair.commonChallenge?.completed)
      .map((pair) => ({
        id: `common-${pair.id}`,
        text: `一个小队完成共同点挑战，获得 20 分`,
        time: pair.commonChallenge?.completedAt ?? room.createdAt,
        type: "task" as const
      })),
    ...room.pairs
      .filter((pair) => pair.harmonyChallenge?.completed)
      .map((pair) => ({
        id: `harmony-${pair.id}`,
        text: `一个小队完成默契测试，获得 20 分`,
        time: pair.harmonyChallenge?.completedAt ?? room.createdAt,
        type: "task" as const
      })),
    ...room.pairs
      .filter((pair) => pair.explorationChallenge?.completed)
      .map((pair) => ({
        id: `exploration-${pair.id}`,
        text: `一个小队完成营地探索，获得 30 分`,
        time: pair.explorationChallenge?.completedAt ?? room.createdAt,
        type: "task" as const
      })),
    ...room.pairs
      .filter((pair) => pair.scripturePuzzle?.completed)
      .map((pair) => ({
        id: `scripture-${pair.id}`,
        text:
          pair.id === puzzleWinnerPairId
            ? `一个小队率先完成金句拼图，获得 20 分并成为拼图获胜小队`
            : `一个小队完成金句拼图，获得 20 分`,
        time: pair.scripturePuzzle?.completedAt ?? room.createdAt,
        type: "task" as const
      }))
  ]
    .sort((left, right) => right.time.localeCompare(left.time))
    .slice(0, 16);

  return {
    ...makeSummary(room),
    activities,
    leaderboard,
    participants: participants.map((participant) => ({
      alias: participant.alias,
      id: participant.id,
      joinedAt: participant.joinedAt
    })),
    stats: {
      completedPairCount: completedPairs.length,
      completedParticipantCount,
      pairCount: room.pairs.length,
      pairedParticipantCount: pairedParticipantIds.size,
      targetParticipants: TARGET_PARTICIPANTS
    }
  };
}

export async function getFindTaLobbyView(code: string): Promise<FindTaLobbyView> {
  return withRoomMemory((nextMemory) => makeFindTaLobbyView(getRoomOrThrow(nextMemory, code)));
}

export async function joinFindTaRoom(code: string, input: Partial<FindTaParticipantInput>) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      const participant = sanitizeParticipantInput(input);
      const id = randomUUID();

      room.participants[id] = {
        ...participant,
        id,
        joinedAt: new Date().toISOString(),
        roomCode: room.code
      };

      return makeParticipantView(room, id);
    },
    { save: true }
  );
}

function makeParticipantView(room: RoomRecord, participantId: string): FindTaParticipantView {
  const participant = room.participants[participantId];

  if (!participant) {
    throw new FindTaRoomError("没有找到这位营员的信息，请重新扫码或重新加入。", 404);
  }

  const pair = getPairForParticipant(room, participantId);
  const partners = pair
    ? pair.memberIds
        .filter((id) => id !== participantId)
        .map((id) => room.participants[id])
        .filter(Boolean)
        .map(toPublicProfile)
    : [];

  return {
    commonChallenge: pair ? toCommonChallengeView(room, pair, participantId) : null,
    explorationChallenge: pair ? toExplorationChallengeView(pair, room) : null,
    explorationTask: pair ? getPairExplorationTask(pair) : null,
    harmonyChallenge: pair ? toHarmonyChallengeView(pair, room, participantId) : null,
    pair: pair
      ? {
          completed: pair.completed,
          completedAt: pair.completedAt,
          confirmedCount: getPairConfirmedCount(pair),
          id: pair.id,
          selfConfirmed: getPairConfirmedIds(pair).includes(participantId),
          totalCount: pair.memberIds.length
        }
      : null,
    partners,
    room: makeSummary(room),
    self: toPublicProfile(participant),
    scripturePuzzle: pair ? toScripturePuzzleView(pair, room) : null,
    waitingReason: pair ? null : room.status === "paired" ? "joinedAfterPairing" : "notPairedYet"
  };
}

export async function getParticipantView(code: string, participantId: string): Promise<FindTaParticipantView> {
  return withRoomMemory((nextMemory) => makeParticipantView(getRoomOrThrow(nextMemory, code), participantId));
}

function makeHostRoomView(room: RoomRecord, token: string): FindTaHostRoomView {
  requireHost(room, token);

  const participants = Object.values(room.participants)
    .sort((left, right) => left.joinedAt.localeCompare(right.joinedAt))
    .map((participant) => toHostParticipant(room, participant));

  const pairs: FindTaHostPair[] = room.pairs.map((pair) => ({
    commonChallenge: toCommonChallengeView(room, pair),
    completed: pair.completed,
    completedAt: pair.completedAt,
    confirmedCount: getPairConfirmedCount(pair),
    explorationChallenge: toExplorationChallengeView(pair, room),
    explorationTask: getPairExplorationTask(pair),
    harmonyChallenge: toHarmonyChallengeView(pair, room),
    id: pair.id,
    members: pair.memberIds
      .map((id) => room.participants[id])
      .filter(Boolean)
      .map((participant) => toHostParticipant(room, participant)),
    score: getPairScore(pair),
    scripturePuzzle: toScripturePuzzleView(pair, room),
    totalCount: pair.memberIds.length
  }));

  return {
    ...makeSummary(room),
    hostToken: room.hostToken,
    pairs,
    participants
  };
}

export async function getHostRoomView(code: string, token: string): Promise<FindTaHostRoomView> {
  return withRoomMemory((nextMemory) => makeHostRoomView(getRoomOrThrow(nextMemory, code), token));
}

export async function pairFindTaRoom(code: string, token: string) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      requireHost(room, token);

  const participantIds = Object.keys(room.participants);

  if (participantIds.length < 2) {
    throw new FindTaRoomError("至少需要 2 位营员加入后才能开始随机分组；正式活动建议按 4 人小队进行。");
  }

  const shuffledIds = shuffle(participantIds);
  const memberGroups = makeGroupMemberSets(shuffledIds);

  const pairs: PairRecord[] = memberGroups.map((memberIds, index) => ({
    completed: false,
    completedAt: null,
    confirmedIds: [],
    createdAt: new Date().toISOString(),
    explorationTaskId: getRandomExplorationTaskId(),
    harmonyQuestionIds: getRandomHarmonyQuestionIds(),
    id: `round-${room.round + 1}-group-${index + 1}-${randomUUID().slice(0, 8)}`,
    memberIds
  }));

  room.pairs = pairs;
  room.round += 1;
  room.status = "paired";
      return makeHostRoomView(room, token);
    },
    { save: true }
  );
}

export async function markFindTaPairComplete(code: string, participantId: string) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      const pair = getPairForParticipant(room, participantId);

  if (!pair) {
    throw new FindTaRoomError("还没有找到你的分组结果，请等待主持人开始分组。");
  }

  const confirmedIds = getPairConfirmedIds(pair);

  if (!confirmedIds.includes(participantId)) {
    confirmedIds.push(participantId);
  }

  pair.confirmedIds = confirmedIds;

  if (pair.memberIds.every((id) => confirmedIds.includes(id))) {
    pair.completed = true;
    pair.completedAt = pair.completedAt ?? new Date().toISOString();
  }

      return makeParticipantView(room, participantId);
    },
    { save: true }
  );
}

export async function submitFindTaCommonChallenge(
  code: string,
  participantId: string,
  input: Partial<FindTaCommonChallengeInput>
) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      const pair = getPairForParticipant(room, participantId);

  if (!pair) {
    throw new FindTaRoomError("还没有找到你的分组结果，请等待主持人开始分组。");
  }

  if (!pair.completed) {
    throw new FindTaRoomError("请先和小队队友完成会合确认，再完成共同点挑战。");
  }

  if (pair.commonChallenge?.completed) {
    throw new FindTaRoomError("共同点挑战已经完成。");
  }

  if (pair.commonChallenge && pair.commonChallenge.submittedBy !== participantId) {
    throw new FindTaRoomError("队友已经提交了共同点挑战，请你确认这份答案。");
  }

  pair.commonChallenge = {
    ...sanitizeCommonChallengeInput(input),
    completed: false,
    completedAt: null,
    confirmedIds: [participantId],
    submittedAt: new Date().toISOString(),
    submittedBy: participantId
  };

      return makeParticipantView(room, participantId);
    },
    { save: true }
  );
}

export async function confirmFindTaCommonChallenge(code: string, participantId: string) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      const pair = getPairForParticipant(room, participantId);

  if (!pair) {
    throw new FindTaRoomError("还没有找到你的分组结果，请等待主持人开始分组。");
  }

  if (!pair.completed) {
    throw new FindTaRoomError("请先和小队队友完成会合确认，再完成共同点挑战。");
  }

  if (!pair.commonChallenge) {
    throw new FindTaRoomError("还没有提交共同点挑战。");
  }

  if (!pair.commonChallenge.confirmedIds.includes(participantId)) {
    pair.commonChallenge.confirmedIds.push(participantId);
  }

  if (pair.memberIds.every((id) => pair.commonChallenge?.confirmedIds.includes(id))) {
    pair.commonChallenge.completed = true;
    pair.commonChallenge.completedAt = pair.commonChallenge.completedAt ?? new Date().toISOString();
  }

      return makeParticipantView(room, participantId);
    },
    { save: true }
  );
}

export async function submitFindTaHarmonyChallenge(
  code: string,
  participantId: string,
  input: { answers?: unknown }
) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      const pair = getPairForParticipant(room, participantId);

  if (!pair) {
    throw new FindTaRoomError("还没有找到你的分组结果，请等待主持人开始分组。");
  }

  if (!pair.commonChallenge?.completed) {
    throw new FindTaRoomError("请先完成共同点挑战，再进入默契测试。");
  }

  if (pair.harmonyChallenge?.completed) {
    throw new FindTaRoomError("默契测试已经完成。");
  }

  const answers = sanitizeHarmonyAnswers(input.answers, getPairHarmonyQuestions(pair));

  pair.harmonyChallenge = pair.harmonyChallenge ?? {
    answers: {},
    completed: false,
    completedAt: null
  };
  pair.harmonyChallenge.answers[participantId] = answers;

  if (pair.memberIds.every((id) => Boolean(pair.harmonyChallenge?.answers[id]))) {
    pair.harmonyChallenge.completed = true;
    pair.harmonyChallenge.completedAt = pair.harmonyChallenge.completedAt ?? new Date().toISOString();
  }

      return makeParticipantView(room, participantId);
    },
    { save: true }
  );
}

export async function submitFindTaExplorationChallenge(
  code: string,
  participantId: string,
  input: { caption?: unknown; photoDataUrl?: unknown }
) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      const pair = getPairForParticipant(room, participantId);

  if (!pair) {
    throw new FindTaRoomError("还没有找到你的分组结果，请等待主持人开始分组。");
  }

  if (!pair.harmonyChallenge?.completed) {
    throw new FindTaRoomError("请先完成默契测试，再进入营地探索。");
  }

  if (pair.explorationChallenge?.completed) {
    throw new FindTaRoomError("营地探索任务已经完成。");
  }

  const nextInput = sanitizeExplorationInput(input);

  pair.explorationChallenge = {
    ...nextInput,
    completed: true,
    completedAt: new Date().toISOString(),
    submittedBy: participantId
  };

      return makeParticipantView(room, participantId);
    },
    { save: true }
  );
}

export async function markFindTaScripturePuzzleComplete(code: string, token: string, pairId: string) {
  return withRoomMemory(
    (nextMemory) => {
      const room = getRoomOrThrow(nextMemory, code);
      requireHost(room, token);

  const pair = room.pairs.find((item) => item.id === pairId);

  if (!pair) {
    throw new FindTaRoomError("没有找到这个小队。", 404);
  }

  if (!pair.explorationChallenge?.completed) {
    throw new FindTaRoomError("请先完成营地探索，再标记金句拼图。");
  }

  pair.scripturePuzzle = pair.scripturePuzzle ?? {
    completed: true,
    completedAt: new Date().toISOString()
  };
  pair.scripturePuzzle.completed = true;
  pair.scripturePuzzle.completedAt = pair.scripturePuzzle.completedAt ?? new Date().toISOString();

      return makeHostRoomView(room, token);
    },
    { save: true }
  );
}

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function csvRow(values: unknown[]) {
  return values.map(csvCell).join(",");
}

export async function exportFindTaRoomCsv(code: string, token: string) {
  return withRoomMemory((nextMemory) => {
    const room = getRoomOrThrow(nextMemory, code);
    requireHost(room, token);

  const rows: string[] = [];
  const participants = Object.values(room.participants).sort((left, right) =>
    left.joinedAt.localeCompare(right.joinedAt)
  );

  rows.push(csvRow(["房间信息"]));
  rows.push(csvRow(["房间码", room.code]));
  rows.push(csvRow(["创建时间", room.createdAt]));
  rows.push(csvRow(["轮次", room.round]));
  rows.push(csvRow([]));

  rows.push(csvRow(["营员名单"]));
  rows.push(csvRow(["序号", "真实姓名", "后台小组", "匿名代号", "兴趣爱好", "今日穿搭", "加入时间"]));
  participants.forEach((participant, index) => {
    rows.push(
      csvRow([
        index + 1,
        participant.realName,
        participant.group,
        participant.alias,
        participant.interests,
        participant.outfit,
        participant.joinedAt
      ])
    );
  });
  rows.push(csvRow([]));

  rows.push(csvRow(["小队结果"]));
  rows.push(
    csvRow([
      "小队",
      "真实姓名",
      "后台小组",
      "匿名代号",
      "分数",
      "会合",
      "共同点挑战",
      "默契测试",
      "默契度",
      "营地探索",
      "探索任务",
      "金句拼图"
    ])
  );
  room.pairs.forEach((pair, index) => {
    const score = getPairScore(pair);
    const harmony = toHarmonyChallengeView(pair, room);
    const explorationTask = getPairExplorationTask(pair);

    pair.memberIds.forEach((memberId) => {
      const member = room.participants[memberId];

      if (!member) {
        return;
      }

      rows.push(
        csvRow([
          `小队 ${index + 1}`,
          member.realName,
          member.group,
          member.alias,
          score,
          pair.completed ? "已会合" : "未完成",
          pair.commonChallenge?.completed ? "已完成" : pair.commonChallenge ? "确认中" : "未完成",
          pair.harmonyChallenge?.completed ? "已完成" : pair.harmonyChallenge ? "进行中" : "未完成",
          harmony.percentage === null ? "" : `${harmony.percentage}%`,
          pair.explorationChallenge?.completed ? "已完成" : "未完成",
          explorationTask.title,
          pair.scripturePuzzle?.completed
            ? pair.id === getScripturePuzzleWinnerPairId(room)
              ? "获胜"
              : "已完成"
            : "未完成"
        ])
      );
    });
  });
  rows.push(csvRow([]));

  rows.push(csvRow(["排行榜"]));
  rows.push(csvRow(["排名", "小队", "匿名代号", "分数", "已完成任务数", "共同点", "不同点", "探索说明", "金句拼图"]));
  room.pairs
    .map((pair, index) => ({
      aliases: pair.memberIds.map((memberId) => room.participants[memberId]?.alias).filter(Boolean).join(" / "),
      common: pair.commonChallenge?.commonPoints.join("；") ?? "",
      differences: pair.commonChallenge?.differences.join("；") ?? "",
      explorationCaption: pair.explorationChallenge?.caption ?? "",
      index,
      puzzle: pair.scripturePuzzle?.completed
        ? pair.id === getScripturePuzzleWinnerPairId(room)
          ? "获胜"
          : "已完成"
        : "未完成",
      score: getPairScore(pair),
      tasks: getPairCompletedTaskCount(pair)
    }))
    .sort((left, right) => right.score - left.score || right.tasks - left.tasks || left.index - right.index)
    .forEach((entry, rank) => {
      rows.push(
        csvRow([
          rank + 1,
          `小队 ${entry.index + 1}`,
          entry.aliases,
          entry.score,
          entry.tasks,
          entry.common,
          entry.differences,
          entry.explorationCaption,
          entry.puzzle
        ])
      );
    });

    return rows.join("\n");
  });
}

export function isProfileField(name: string): name is keyof FindTaProfileFields {
  return ["alias", "codePhrase", "interests", "outfit"].includes(name);
}
