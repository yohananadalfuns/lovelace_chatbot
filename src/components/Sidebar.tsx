"use client";

import { Plus, Trash2, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { groupByDate } from "@/lib/utils";

export default function Sidebar({
  sessions,
  activeSession,
  setActiveId,
  createSession,
  setDeleteTargetId,
  onClose,
}: any) {
  const grouped = groupByDate(sessions);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm tracking-tight truncate">
              Lovelace
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            createSession();
            onClose?.();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary/[0.07] hover:bg-primary/12 border border-primary/10 hover:border-primary/20 text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-150 group"
        >
          <div className="w-5 h-5 rounded-md bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors shrink-0">
            <Plus className="w-3 h-3 text-primary" />
          </div>
          New conversation
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border/50 shrink-0" />

      {/* Session list */}
      <ScrollArea className="flex-1 w-full">
        <div className="px-2 py-3 space-y-4">
          {sessions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/50">
                No conversations yet
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([label, group]) => (
              <div key={label}>
                <p className="px-3 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground/50 uppercase">
                  {label}
                </p>
                <div className="space-y-0.5">
                  {(group as any[]).map((s: any) => {
                    const isActive = s.id === activeSession?.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveId(s.id);
                          onClose?.();
                        }}
                        className={`
                          group relative flex items-center gap-2.5 px-3 py-2 rounded-xl
                          cursor-pointer transition-all duration-150 w-full
                          ${
                            isActive
                              ? "bg-secondary shadow-sm"
                              : "hover:bg-secondary/60"
                          }
                        `}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                        )}

                        <MessageSquare
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground/40 group-hover:text-muted-foreground/60"
                          }`}
                        />

                        <span
                          className={`text-sm truncate flex-1 min-w-0 transition-colors ${
                            isActive
                              ? "text-foreground font-medium"
                              : "text-foreground/70 group-hover:text-foreground/90"
                          }`}
                        >
                          {s.title || "New Chat"}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(s.id);
                          }}
                          className="w-6 h-6 shrink-0 rounded-lg text-muted-foreground/50 hover:text-destructive! hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-150 "
                          tabIndex={-1}
                          aria-label="Delete conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/40 shrink-0">
        <p className="text-[10px] text-muted-foreground/40 text-center">
          {sessions.length} conversation{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
