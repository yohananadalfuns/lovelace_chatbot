"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendMessage as callGemini } from "../actions/chat";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
  attachment?: string | null;
};

type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

type StoredState = {
  sessions: Session[];
  activeId: string | null;
};

export function useChatSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionsRef = useRef<Session[]>([]);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("chat_sessions");
      if (!raw) return;
      const { sessions: saved, activeId: savedActiveId }: StoredState =
        JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) {
        setSessions(saved);
        sessionsRef.current = saved;
        setActiveId(savedActiveId ?? saved[0].id);
      }
    } catch {
      console.error("Failed to restore sessions from localStorage.");
    }
  }, []);

  useEffect(() => {
    try {
      const payload: StoredState = { sessions, activeId };
      localStorage.setItem("chat_sessions", JSON.stringify(payload));
    } catch (e) {
      console.error("Storage quota exceeded — attachment may be too large.", e);
    }
  }, [sessions, activeId]);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  const createSession = (initialMsg?: string): string => {
    const newSession: Session = {
      id: uuidv4(),
      title: initialMsg?.slice(0, 30) || "New Chat",
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => {
      const next = [newSession, ...prev];
      sessionsRef.current = next;
      return next;
    });
    setActiveId(newSession.id);
    return newSession.id;
  };

  const addMessage = async (content: string, attachment?: string | null) => {
    setError(null);

    const currentId = activeId ?? createSession(content);

    const userMsg: Message = { role: "user", content, attachment };

    setSessions((prev) => {
      const next = prev.map((s) =>
        s.id === currentId
          ? {
              ...s,
              messages: [...s.messages, userMsg],
              title: s.title === "New Chat" ? content.slice(0, 30) : s.title,
            }
          : s,
      );
      sessionsRef.current = next;
      return next;
    });

    setLoading(true);
    try {
      const session = sessionsRef.current.find((s) => s.id === currentId);
      const history: Message[] = session?.messages ?? [];

      const reply = await callGemini([...history, userMsg]);
      const assistantMsg: Message = {
        role: "assistant",
        content: String(reply),
      };

      setSessions((prev) => {
        const next = prev.map((s) =>
          s.id === currentId
            ? { ...s, messages: [...s.messages, assistantMsg] }
            : s,
        );
        sessionsRef.current = next;
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      sessionsRef.current = next;
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };

  return {
    sessions,
    setSessions,
    activeSession,
    activeId,
    setActiveId,
    addMessage,
    createSession,
    deleteSession,
    loading,
    error,
  };
}
