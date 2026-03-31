"use client";

import { useState, useRef, useEffect } from "react";
import { X, Zap, Code, FileText, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatSessions } from "../hooks/useChatSessions";
import { useTheme } from "next-themes";
import Sidebar from "@/components/Sidebar";
import { fileToBase64 } from "@/lib/utils";
import * as XLSX from "xlsx";
import ChatContent from "@/components/ChatContent";
import Header from "@/components/Header";
import MessageBox from "@/components/MessageBox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const [input, setInput] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { theme, setTheme } = useTheme();
  const {
    sessions,
    activeSession,
    setActiveId,
    addMessage,
    createSession,
    loading,
    setSessions,
  } = useChatSessions();

  const confirmDelete = () => {
    if (deleteTargetId) {
      setSessions((prev: any[]) =>
        prev.filter((sess) => sess.id !== deleteTargetId),
      );
      setDeleteTargetId(null);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "40px";
    const nextHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(Math.max(nextHeight, 40), 160)}px`;
    textarea.style.overflowY = nextHeight > 160 ? "auto" : "hidden";
  }, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSend = async (text?: string) => {
    let msg = (text ?? input).trim();
    if ((!msg && !file) || loading) return;

    let base64File = null;
    if (file) {
      const isExcel = file.name.match(/\.(xlsx|xls|csv)$/);
      if (isExcel) {
        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const csvData = XLSX.utils.sheet_to_csv(
            workbook.Sheets[workbook.SheetNames[0]],
          );
          msg = msg
            ? `${msg}\n\nData:\n${csvData}`
            : `Analyze this:\n${csvData}`;
        } catch (e) {
          console.error(e);
        }
      } else {
        base64File = await fileToBase64(file);
      }
    }

    addMessage(msg, base64File);
    setInput("");
    setFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "40px";
  };

  const starterPrompts = [
    {
      title: "Explain Concept",
      desc: "Quantum physics",
      icon: <BrainCircuit className="w-4 h-4 text-blue-500" />,
      prompt: "Explain quantum entanglement like I'm 5.",
      color: "from-blue-500/10 to-blue-500/5",
      border: "hover:border-blue-500/40",
    },
    {
      title: "Write a Post",
      desc: "AI in 2026",
      icon: <FileText className="w-4 h-4 text-orange-500" />,
      prompt: "Write a blog post about AI in 2026.",
      color: "from-orange-500/10 to-orange-500/5",
      border: "hover:border-orange-500/40",
    },
    {
      title: "Analyze Data",
      desc: "Summarize trends",
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      prompt: "Summarize the key trends in this file.",
      color: "from-yellow-500/10 to-yellow-500/5",
      border: "hover:border-yellow-500/40",
    },
    {
      title: "Help me Code",
      desc: "Search bar",
      icon: <Code className="w-4 h-4 text-emerald-500" />,
      prompt: "How do I make a debounced search bar in React?",
      color: "from-emerald-500/10 to-emerald-500/5",
      border: "hover:border-emerald-500/40",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans">
      <aside
        className={`
          hidden md:flex flex-col border-r shrink-0 h-full
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-0 border-r-0 overflow-hidden" : "w-72"}
        `}
      >
        <Sidebar
          sessions={sessions}
          activeSession={activeSession}
          setActiveId={setActiveId}
          createSession={createSession}
          setDeleteTargetId={setDeleteTargetId}
        />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-72 h-full bg-background border-r shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Conversations</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="h-8 w-8 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar
                sessions={sessions}
                activeSession={activeSession}
                setActiveId={setActiveId}
                createSession={createSession}
                setDeleteTargetId={setDeleteTargetId}
                onClose={() => setIsMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col relative h-full min-w-0">
        <Header
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          setTheme={setTheme}
          theme={theme}
        />

        <ChatContent
          activeSession={activeSession}
          bottomRef={bottomRef}
          onSend={onSend}
          starterPrompts={starterPrompts}
          loading={loading}
        />

        <div className="w-full px-4 pb-5 pt-3 bg-linear-to-t from-background via-background/95 to-transparent">
          <div className="max-w-3xl mx-auto space-y-2">
            <MessageBox
              file={file}
              fileInputRef={fileInputRef}
              input={input}
              loading={loading}
              onSend={onSend}
              setFile={setFile}
              setInput={setInput}
              textareaRef={textareaRef}
            />
            <div className="flex items-center justify-center gap-1.5">
              <p className="text-[10px] text-muted-foreground/60">
                Lovelace can make mistakes. Check important info.
              </p>
              <span className="text-[10px] text-muted-foreground/40">·</span>
              <p className="text-[10px] text-muted-foreground/40">
                Shift+Enter for newline
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={() => setDeleteTargetId(null)}
      >
        <AlertDialogContent className="z-200 max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Delete this conversation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove this chat. You can&apos;t undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="cursor-pointer rounded-xl h-9 text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer rounded-xl h-9 text-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
