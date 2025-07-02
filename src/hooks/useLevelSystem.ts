"use client";

import { useEffect, useState } from "react";
import {
  completeActivity,
  getPlayerProgress,
  type PlayerProgress,
} from "@/src/lib/level-system";

export function useLevelSystem() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title: string } | null>(null);

  useEffect(() => {
    setProgress(getPlayerProgress());
  }, []);

  const handleActivityComplete = (
    activityId: string,
    activityType: Parameters<typeof completeActivity>[1],
  ) => {
    const result = completeActivity(activityId, activityType);
    setProgress(result.progress);

    if (result.leveledUp) {
      setLevelUpData({
        level: result.progress.level,
        title: result.progress.title,
      });
      setShowLevelUp(true);
    }

    return result;
  };

  const closeLevelUpModal = () => {
    setShowLevelUp(false);
    setLevelUpData(null);
  };

  return {
    progress,
    showLevelUp,
    levelUpData,
    handleActivityComplete,
    closeLevelUpModal,
  };
}
