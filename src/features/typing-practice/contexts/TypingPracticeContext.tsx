"use client";

import { createContext, type ReactNode, useContext, useEffect, useReducer } from "react";
import { typingCourses, typingLessons } from "../data";
import type { TypingCourse, TypingLesson, TypingStats } from "../types";

// State definition
interface TypingPracticeState {
  courses: TypingCourse[];
  lessons: TypingLesson[];
  currentCourse: TypingCourse | null;
  currentLesson: TypingLesson | null;
  completedLessons: string[];
  recentStats: Record<string, TypingStats>;
  isLoading: boolean;
  error: string | null;
}

// Action definitions
type TypingPracticeAction =
  | { type: "LOAD_DATA_START" }
  | { type: "LOAD_DATA_SUCCESS"; payload: { courses: TypingCourse[]; lessons: TypingLesson[] } }
  | { type: "LOAD_DATA_ERROR"; payload: string }
  | { type: "SET_CURRENT_COURSE"; payload: TypingCourse }
  | { type: "SET_CURRENT_LESSON"; payload: TypingLesson }
  | { type: "COMPLETE_LESSON"; payload: { lessonId: string; stats: TypingStats } }
  | { type: "CLEAR_CURRENT_LESSON" }
  | { type: "RESET_PROGRESS" };

// Context value interface
interface TypingPracticeContextValue {
  state: TypingPracticeState;
  actions: {
    setCourse: (course: TypingCourse) => void;
    setLesson: (lesson: TypingLesson) => void;
    completeLesson: (lessonId: string, stats: TypingStats) => void;
    clearCurrentLesson: () => void;
    resetProgress: () => void;
    getCourseLessons: (courseId: string) => TypingLesson[];
    getNextLesson: (currentLessonId: string, courseId: string) => TypingLesson | null;
    getPreviousLesson: (currentLessonId: string, courseId: string) => TypingLesson | null;
    isLessonCompleted: (lessonId: string) => boolean;
    getCourseProgress: (courseId: string) => {
      completed: number;
      total: number;
      percentage: number;
    };
  };
}

// Reducer function
function typingPracticeReducer(
  state: TypingPracticeState,
  action: TypingPracticeAction,
): TypingPracticeState {
  switch (action.type) {
    case "LOAD_DATA_START":
      return { ...state, isLoading: true, error: null };

    case "LOAD_DATA_SUCCESS":
      return {
        ...state,
        isLoading: false,
        courses: action.payload.courses,
        lessons: action.payload.lessons,
      };

    case "LOAD_DATA_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "SET_CURRENT_COURSE":
      return { ...state, currentCourse: action.payload, currentLesson: null };

    case "SET_CURRENT_LESSON":
      return { ...state, currentLesson: action.payload };

    case "COMPLETE_LESSON": {
      const { lessonId, stats } = action.payload;
      const newCompletedLessons = state.completedLessons.includes(lessonId)
        ? state.completedLessons
        : [...state.completedLessons, lessonId];

      return {
        ...state,
        completedLessons: newCompletedLessons,
        recentStats: {
          ...state.recentStats,
          [lessonId]: stats,
        },
      };
    }

    case "CLEAR_CURRENT_LESSON":
      return { ...state, currentLesson: null };

    case "RESET_PROGRESS":
      return {
        ...state,
        completedLessons: [],
        recentStats: {},
        currentCourse: null,
        currentLesson: null,
      };

    default:
      return state;
  }
}

// Initial state
const initialState: TypingPracticeState = {
  courses: [],
  lessons: [],
  currentCourse: null,
  currentLesson: null,
  completedLessons: [],
  recentStats: {},
  isLoading: true,
  error: null,
};

// Create context
const TypingPracticeContext = createContext<TypingPracticeContextValue | null>(null);

// Storage keys
const STORAGE_KEYS = {
  COMPLETED_LESSONS: "myfir-typing-completed-lessons",
  RECENT_STATS: "myfir-typing-recent-stats",
} as const;

// Provider component
export function TypingPracticeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(typingPracticeReducer, initialState);

  // Load initial data
  useEffect(() => {
    try {
      dispatch({ type: "LOAD_DATA_START" });

      // Load from localStorage
      const savedCompletedLessons = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      const savedStats = localStorage.getItem(STORAGE_KEYS.RECENT_STATS);

      const completedLessons = savedCompletedLessons ? JSON.parse(savedCompletedLessons) : [];
      const recentStats = savedStats ? JSON.parse(savedStats) : {};

      // Load static data
      dispatch({
        type: "LOAD_DATA_SUCCESS",
        payload: { courses: typingCourses, lessons: typingLessons },
      });

      // Restore progress
      if (completedLessons.length > 0) {
        completedLessons.forEach((lessonId: string) => {
          const stats = recentStats[lessonId] || { totalKeystrokes: 0 };
          dispatch({ type: "COMPLETE_LESSON", payload: { lessonId, stats } });
        });
      }
    } catch (error) {
      dispatch({
        type: "LOAD_DATA_ERROR",
        payload: error instanceof Error ? error.message : "Failed to load typing data",
      });
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (state.completedLessons.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(state.completedLessons),
      );
    }
  }, [state.completedLessons]);

  useEffect(() => {
    if (Object.keys(state.recentStats).length > 0) {
      localStorage.setItem(STORAGE_KEYS.RECENT_STATS, JSON.stringify(state.recentStats));
    }
  }, [state.recentStats]);

  // Actions
  const actions = {
    setCourse: (course: TypingCourse) => {
      dispatch({ type: "SET_CURRENT_COURSE", payload: course });
    },

    setLesson: (lesson: TypingLesson) => {
      dispatch({ type: "SET_CURRENT_LESSON", payload: lesson });
    },

    completeLesson: (lessonId: string, stats: TypingStats) => {
      dispatch({ type: "COMPLETE_LESSON", payload: { lessonId, stats } });
    },

    clearCurrentLesson: () => {
      dispatch({ type: "CLEAR_CURRENT_LESSON" });
    },

    resetProgress: () => {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
      localStorage.removeItem(STORAGE_KEYS.RECENT_STATS);
      dispatch({ type: "RESET_PROGRESS" });
    },

    getCourseLessons: (courseId: string): TypingLesson[] => {
      return state.lessons.filter((lesson) => lesson.courseId === courseId);
    },

    getNextLesson: (currentLessonId: string, courseId: string): TypingLesson | null => {
      const courseLessons = state.lessons.filter((lesson) => lesson.courseId === courseId);
      const currentIndex = courseLessons.findIndex((lesson) => lesson.id === currentLessonId);

      if (currentIndex >= 0 && currentIndex < courseLessons.length - 1) {
        return courseLessons[currentIndex + 1];
      }
      return null;
    },

    getPreviousLesson: (currentLessonId: string, courseId: string): TypingLesson | null => {
      const courseLessons = state.lessons.filter((lesson) => lesson.courseId === courseId);
      const currentIndex = courseLessons.findIndex((lesson) => lesson.id === currentLessonId);

      if (currentIndex > 0) {
        return courseLessons[currentIndex - 1];
      }
      return null;
    },

    isLessonCompleted: (lessonId: string): boolean => {
      return state.completedLessons.includes(lessonId);
    },

    getCourseProgress: (courseId: string) => {
      const courseLessons = state.lessons.filter((lesson) => lesson.courseId === courseId);
      const completedCount = courseLessons.filter((lesson) =>
        state.completedLessons.includes(lesson.id),
      ).length;

      return {
        completed: completedCount,
        total: courseLessons.length,
        percentage:
          courseLessons.length > 0
            ? Math.round((completedCount / courseLessons.length) * 100)
            : 0,
      };
    },
  };

  const contextValue: TypingPracticeContextValue = {
    state,
    actions,
  };

  return (
    <TypingPracticeContext.Provider value={contextValue}>
      {children}
    </TypingPracticeContext.Provider>
  );
}

// Hook to use typing practice context
export function useTypingPractice() {
  const context = useContext(TypingPracticeContext);
  if (!context) {
    throw new Error("useTypingPractice must be used within a TypingPracticeProvider");
  }
  return context;
}

// Convenience hooks
export function useTypingCourses() {
  const { state } = useTypingPractice();
  return state.courses;
}

export function useTypingLessons() {
  const { state } = useTypingPractice();
  return state.lessons;
}

export function useCurrentCourse() {
  const { state } = useTypingPractice();
  return state.currentCourse;
}

export function useCurrentLesson() {
  const { state } = useTypingPractice();
  return state.currentLesson;
}
