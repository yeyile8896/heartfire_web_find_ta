export type FindTaRoomStatus = "waiting" | "paired";

export type FindTaProfileFields = {
  alias: string;
  codePhrase: string;
  interests: string;
  outfit: string;
};

export type FindTaParticipantInput = FindTaProfileFields & {
  group: string;
  realName: string;
};

export type FindTaPublicProfile = FindTaProfileFields & {
  id: string;
  joinedAt: string;
};

export type FindTaHostParticipant = FindTaPublicProfile & {
  group: string;
  pairId: string | null;
  realName: string;
};

export type FindTaRoomSummary = {
  code: string;
  createdAt: string;
  participantCount: number;
  round: number;
  status: FindTaRoomStatus;
};

export type FindTaLobbyParticipant = {
  alias: string;
  id: string;
  joinedAt: string;
};

export type FindTaLobbyActivity = {
  id: string;
  text: string;
  time: string;
  type: "complete" | "join" | "pair" | "room" | "task";
};

export type FindTaLobbyLeaderboardEntry = {
  completedTasks: number;
  id: string;
  label: string;
  rank: number;
  score: number;
  status:
    | "共同点完成"
    | "任务中"
    | "寻找中"
    | "确认中"
    | "已会合"
    | "探索完成"
    | "默契完成"
    | "拼图完成"
    | "拼图获胜";
};

export type FindTaLobbyView = FindTaRoomSummary & {
  activities: FindTaLobbyActivity[];
  leaderboard: FindTaLobbyLeaderboardEntry[];
  participants: FindTaLobbyParticipant[];
  stats: {
    completedPairCount: number;
    completedParticipantCount: number;
    pairCount: number;
    pairedParticipantCount: number;
    targetParticipants: number;
  };
};

export type FindTaPairStatus = {
  completed: boolean;
  completedAt: string | null;
  confirmedCount: number;
  id: string;
  totalCount: number;
};

export type FindTaParticipantPairStatus = FindTaPairStatus & {
  selfConfirmed: boolean;
};

export type FindTaCommonChallengeInput = {
  commonPoints: string[];
  differences: string[];
  surprise: string;
};

export type FindTaCommonChallengeStatus = FindTaCommonChallengeInput & {
  completed: boolean;
  completedAt: string | null;
  confirmedCount: number;
  selfConfirmed: boolean;
  selfSubmitted: boolean;
  submittedAt: string;
  submittedByAlias: string;
  totalCount: number;
};

export type FindTaHarmonyChoice = "left" | "right";

export type FindTaHarmonyQuestion = {
  id: string;
  left: string;
  prompt: string;
  right: string;
};

export type FindTaHarmonyAnswerMap = Record<string, FindTaHarmonyChoice>;

export type FindTaHarmonyStatus = {
  completed: boolean;
  completedAt: string | null;
  matches: number;
  percentage: number | null;
  questions: FindTaHarmonyQuestion[];
  selfAnswers: FindTaHarmonyAnswerMap;
  selfSubmitted: boolean;
  submittedAliases: string[];
  submittedCount: number;
  totalCount: number;
};

export type FindTaExplorationTask = {
  description: string;
  id: string;
  title: string;
};

export type FindTaExplorationStatus = {
  caption: string;
  completed: boolean;
  completedAt: string | null;
  photoDataUrl: string;
  submittedByAlias: string;
  task: FindTaExplorationTask;
};

export type FindTaScripturePuzzleStatus = {
  completed: boolean;
  completedAt: string | null;
  isWinner: boolean;
};

export type FindTaParticipantView = {
  commonChallenge: FindTaCommonChallengeStatus | null;
  explorationChallenge: FindTaExplorationStatus | null;
  explorationTask: FindTaExplorationTask | null;
  harmonyChallenge: FindTaHarmonyStatus | null;
  pair: FindTaParticipantPairStatus | null;
  partners: FindTaPublicProfile[];
  room: FindTaRoomSummary;
  self: FindTaPublicProfile;
  scripturePuzzle: FindTaScripturePuzzleStatus | null;
  waitingReason: "joinedAfterPairing" | "notPairedYet" | null;
};

export type FindTaHostPair = FindTaPairStatus & {
  commonChallenge: Omit<FindTaCommonChallengeStatus, "selfConfirmed" | "selfSubmitted"> | null;
  explorationChallenge: FindTaExplorationStatus | null;
  explorationTask: FindTaExplorationTask;
  harmonyChallenge: Omit<FindTaHarmonyStatus, "selfAnswers" | "selfSubmitted"> | null;
  members: FindTaHostParticipant[];
  score: number;
  scripturePuzzle: FindTaScripturePuzzleStatus;
};

export type FindTaHostRoomView = FindTaRoomSummary & {
  hostToken: string;
  participants: FindTaHostParticipant[];
  pairs: FindTaHostPair[];
};
