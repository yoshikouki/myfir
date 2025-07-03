"use client";

import { createContext, type ReactNode, useContext, useEffect, useReducer } from "react";
import {
  type ActivityType,
  completeActivity,
  getPlayerProgress,
  type PlayerProgress,
} from "@/src/lib/level-system";

// Player state
interface PlayerState {
  progress: PlayerProgress;
  isLoading: boolean;
  error: string | null;
  levelUpQueue: Array<{ level: number; title: string }>;
}

// Player actions
type PlayerAction =
  | { type: "LOADING_START" }
  | { type: "LOADING_COMPLETE"; payload: PlayerProgress }
  | { type: "ERROR"; payload: string }
  | { type: "COMPLETE_ACTIVITY"; payload: { activityId: string; activityType: ActivityType } }
  | { type: "LEVEL_UP"; payload: { level: number; title: string } }
  | { type: "DISMISS_LEVEL_UP" }
  | { type: "RESET_PROGRESS" };

// Player context value
interface PlayerContextValue {
  state: PlayerState;
  actions: {
    completeActivity: (
      activityId: string,
      activityType: ActivityType,
    ) => Promise<{ leveledUp: boolean; progress: PlayerProgress }>;
    resetProgress: () => void;
    dismissLevelUp: () => void;
  };
}

// Player reducer
function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "LOADING_START":
      return { ...state, isLoading: true, error: null };

    case "LOADING_COMPLETE":
      return { ...state, isLoading: false, progress: action.payload };

    case "ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "COMPLETE_ACTIVITY":
      return state; // Activity completion is handled by the action

    case "LEVEL_UP":
      return {
        ...state,
        levelUpQueue: [...state.levelUpQueue, action.payload],
      };

    case "DISMISS_LEVEL_UP":
      return {
        ...state,
        levelUpQueue: state.levelUpQueue.slice(1),
      };

    case "RESET_PROGRESS":
      localStorage.removeItem("myfir-player-progress");
      return {
        ...state,
        progress: getPlayerProgress(),
        levelUpQueue: [],
      };

    default:
      return state;
  }
}

// Create context
const PlayerContext = createContext<PlayerContextValue | null>(null);

// Initial state
const initialState: PlayerState = {
  progress: {
    level: 1,
    experience: 0,
    totalExperience: 0,
    nextLevelExp: 50,
    title: "はじめて の たんけんか",
    completedActivities: [],
    lastPlayDate: new Date().toISOString(),
  },
  isLoading: true,
  error: null,
  levelUpQueue: [],
};

// Provider component
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Initialize player progress on mount
  useEffect(() => {
    try {
      dispatch({ type: "LOADING_START" });
      const progress = getPlayerProgress();
      dispatch({ type: "LOADING_COMPLETE", payload: progress });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error instanceof Error ? error.message : "Failed to load player progress",
      });
    }
  }, []);

  // Actions
  const actions = {
    completeActivity: async (activityId: string, activityType: ActivityType) => {
      try {
        const result = completeActivity(activityId, activityType);

        if (result.leveledUp) {
          dispatch({
            type: "LEVEL_UP",
            payload: {
              level: result.progress.level,
              title: result.progress.title,
            },
          });
        }

        dispatch({ type: "LOADING_COMPLETE", payload: result.progress });
        return result;
      } catch (error) {
        dispatch({
          type: "ERROR",
          payload: error instanceof Error ? error.message : "Failed to complete activity",
        });
        throw error;
      }
    },

    resetProgress: () => {
      dispatch({ type: "RESET_PROGRESS" });
    },

    dismissLevelUp: () => {
      dispatch({ type: "DISMISS_LEVEL_UP" });
    },
  };

  const contextValue: PlayerContextValue = {
    state,
    actions,
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
}

// Hook to use player context
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

// Convenience hooks
export function usePlayerProgress() {
  const { state } = usePlayer();
  return state.progress;
}

export function usePlayerActions() {
  const { actions } = usePlayer();
  return actions;
}

export function useLevelUpQueue() {
  const { state, actions } = usePlayer();
  return {
    queue: state.levelUpQueue,
    dismissLevelUp: actions.dismissLevelUp,
  };
}
