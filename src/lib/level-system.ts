/**
 * レベルシステム - 子ども向け学習進捗管理
 */

export interface PlayerProgress {
  level: number;
  experience: number;
  totalExperience: number;
  nextLevelExp: number;
  title: string;
  completedActivities: string[];
  lastPlayDate: string;
}

export interface ExperienceReward {
  activity: string;
  baseExp: number;
  bonusExp?: number;
  reason?: string;
}

// レベルごとの経験値要件（子ども向けに緩やかな成長カーブ）
const LEVEL_REQUIREMENTS = [
  0, // レベル1: 0経験値
  50, // レベル2: 50経験値
  120, // レベル3: 120経験値
  220, // レベル4: 220経験値
  350, // レベル5: 350経験値
  520, // レベル6: 520経験値
  730, // レベル7: 730経験値
  980, // レベル8: 980経験値
  1270, // レベル9: 1270経験値
  1600, // レベル10: 1600経験値
];

// レベルごとのタイトル
const LEVEL_TITLES = [
  "はじめて の たんけんか", // レベル1
  "げんき な がくしゅうしゃ", // レベル2
  "すごい チャレンジャー", // レベル3
  "かしこい モンスター", // レベル4
  "たのしい マスター", // レベル5
  "すばらしい ヒーロー", // レベル6
  "きらきら スター", // レベル7
  "まほうつかい", // レベル8
  "でんせつ の せんしゃ", // レベル9
  "パソコン の おうじさま・おひめさま", // レベル10
];

// アクティビティごとの基本経験値
export const ACTIVITY_EXP_REWARDS = {
  "typing-lesson-complete": 15, // タイピングレッスン完了
  "typing-perfect-score": 25, // タイピング完璧クリア
  "mouse-drawing-complete": 20, // お絵かき完了
  "drag-drop-complete": 18, // ドラッグ&ドロップ完了
  "click-game-complete": 16, // クリックゲーム完了
  "scroll-book-complete": 14, // えほん読了
  "pc-basics-complete": 12, // PC基礎学習完了
  "first-time-activity": 30, // 初回アクティビティボーナス
  "daily-play": 10, // 毎日プレイボーナス
  "course-complete": 50, // コース完了ボーナス
} as const;

const STORAGE_KEY = "myfir-player-progress";

/**
 * 現在のプレイヤー進捗を取得
 */
export function getPlayerProgress(): PlayerProgress {
  if (typeof window === "undefined") {
    // サーバーサイドでは初期値を返す
    return getInitialProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getInitialProgress();
    }

    const progress = JSON.parse(stored) as PlayerProgress;

    // データの整合性チェック
    if (!isValidProgress(progress)) {
      console.warn("Invalid progress data, resetting to initial state");
      return getInitialProgress();
    }

    // レベル計算の更新
    return recalculateLevel(progress);
  } catch (error) {
    console.error("Failed to load player progress:", error);
    return getInitialProgress();
  }
}

/**
 * プレイヤー進捗を保存
 */
export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save player progress:", error);
  }
}

/**
 * 経験値を追加してレベルアップをチェック
 */
export function addExperience(reward: ExperienceReward): {
  oldProgress: PlayerProgress;
  newProgress: PlayerProgress;
  leveledUp: boolean;
  newLevel?: number;
} {
  const oldProgress = getPlayerProgress();
  const expGained = reward.baseExp + (reward.bonusExp || 0);

  const newProgress: PlayerProgress = {
    ...oldProgress,
    experience: oldProgress.experience + expGained,
    totalExperience: oldProgress.totalExperience + expGained,
    lastPlayDate: new Date().toISOString(),
  };

  // レベルアップチェック
  const recalculated = recalculateLevel(newProgress);
  const leveledUp = recalculated.level > oldProgress.level;

  savePlayerProgress(recalculated);

  return {
    oldProgress,
    newProgress: recalculated,
    leveledUp,
    newLevel: leveledUp ? recalculated.level : undefined,
  };
}

/**
 * アクティビティ完了を記録
 */
export function completeActivity(
  activityId: string,
  experienceType: keyof typeof ACTIVITY_EXP_REWARDS,
): {
  progress: PlayerProgress;
  leveledUp: boolean;
  isFirstTime: boolean;
} {
  const currentProgress = getPlayerProgress();
  const isFirstTime = !currentProgress.completedActivities.includes(activityId);

  // 基本経験値
  const baseExp = ACTIVITY_EXP_REWARDS[experienceType];
  let bonusExp = 0;
  let reason = "";

  // 初回ボーナス
  if (isFirstTime) {
    bonusExp += ACTIVITY_EXP_REWARDS["first-time-activity"];
    reason = "はじめて クリア！";
  }

  // 毎日プレイボーナス
  const lastPlay = new Date(currentProgress.lastPlayDate);
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - lastPlay.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff >= 1) {
    bonusExp += ACTIVITY_EXP_REWARDS["daily-play"];
    reason += reason ? " + まいにち プレイ！" : "まいにち プレイ！";
  }

  const result = addExperience({
    activity: activityId,
    baseExp,
    bonusExp,
    reason,
  });

  // アクティビティを完了リストに追加
  if (isFirstTime) {
    result.newProgress.completedActivities.push(activityId);
    savePlayerProgress(result.newProgress);
  }

  return {
    progress: result.newProgress,
    leveledUp: result.leveledUp,
    isFirstTime,
  };
}

/**
 * 初期進捗データを生成
 */
function getInitialProgress(): PlayerProgress {
  return {
    level: 1,
    experience: 0,
    totalExperience: 0,
    nextLevelExp: LEVEL_REQUIREMENTS[1],
    title: LEVEL_TITLES[0],
    completedActivities: [],
    lastPlayDate: new Date().toISOString(),
  };
}

/**
 * レベルと次レベル必要経験値を再計算
 */
function recalculateLevel(progress: PlayerProgress): PlayerProgress {
  let level = 1;
  let currentLevelExp = 0;

  // 現在のレベルを計算
  for (let i = 1; i < LEVEL_REQUIREMENTS.length; i++) {
    if (progress.totalExperience >= LEVEL_REQUIREMENTS[i]) {
      level = i + 1;
      currentLevelExp = LEVEL_REQUIREMENTS[i];
    } else {
      break;
    }
  }

  // 次のレベルまでの経験値を計算
  const nextLevelIndex = Math.min(level, LEVEL_REQUIREMENTS.length - 1);
  const nextLevelExp =
    LEVEL_REQUIREMENTS[nextLevelIndex] || LEVEL_REQUIREMENTS[LEVEL_REQUIREMENTS.length - 1];
  const currentExp = progress.totalExperience - currentLevelExp;

  return {
    ...progress,
    level,
    experience: currentExp,
    nextLevelExp: nextLevelExp - currentLevelExp,
    title: LEVEL_TITLES[level - 1] || LEVEL_TITLES[LEVEL_TITLES.length - 1],
  };
}

/**
 * 進捗データの整合性をチェック
 */
function isValidProgress(progress: unknown): progress is PlayerProgress {
  return (
    typeof progress === "object" &&
    progress !== null &&
    typeof (progress as PlayerProgress).level === "number" &&
    typeof (progress as PlayerProgress).experience === "number" &&
    typeof (progress as PlayerProgress).totalExperience === "number" &&
    typeof (progress as PlayerProgress).title === "string" &&
    Array.isArray((progress as PlayerProgress).completedActivities) &&
    typeof (progress as PlayerProgress).lastPlayDate === "string"
  );
}

/**
 * レベルアップ時の演出用データを取得
 */
export function getLevelUpCelebration(level: number) {
  const celebrations = [
    { emoji: "🎉", message: "レベルアップ！" },
    { emoji: "⭐", message: "すごいね！" },
    { emoji: "🏆", message: "よくできました！" },
    { emoji: "🌟", message: "すばらしい！" },
    { emoji: "🎊", message: "かんぺき！" },
  ];

  return celebrations[level % celebrations.length];
}

/**
 * プログレスバーの進捗率を取得（0-100）
 */
export function getProgressPercentage(progress: PlayerProgress): number {
  if (progress.nextLevelExp === 0) return 100;
  return Math.min(100, Math.round((progress.experience / progress.nextLevelExp) * 100));
}

/**
 * 進捗データをリセット（開発・テスト用）
 */
export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
