import { FileText, Sparkles, User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { JSX, RefObject } from "react";
import MessageContent from "./MessageContent";

interface IStarterPrompt {
  title: string;
  desc: string;
  icon: JSX.Element;
  prompt: string;
  color?: string;
  border?: string;
}

interface IChatContent {
  activeSession: any;
  starterPrompts: IStarterPrompt[];
  onSend: (text?: string | undefined) => Promise<void>;
  bottomRef: RefObject<HTMLDivElement | null>;
  loading?: boolean;
}

export default function ChatContent({
  activeSession,
  starterPrompts,
  onSend,
  bottomRef,
  loading,
}: IChatContent) {
  const messages = activeSession?.messages ?? [];
  const isEmpty = messages.length === 0;

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-3xl mx-auto w-full space-y-6 pb-10 mt-5">
        {isEmpty ? (
          <div className="h-[75vh] flex flex-col items-center justify-center space-y-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  How can I help you today?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Ask anything, or pick a prompt below to get started.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-2">
              {starterPrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSend(item.prompt)}
                  className={`flex flex-col items-start p-4 rounded-xl border bg-card text-left group active:scale-[0.98] transition-all duration-150 hover:shadow-sm ${item.border ?? "hover:border-primary/30"}`}
                >
                  <div
                    className={`mb-2.5 p-2 rounded-lg bg-linear-to-br ${item.color ?? "from-muted to-muted/50"} border border-border/50 group-hover:border-primary/20 transition-colors`}
                  >
                    {item.icon}
                  </div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg: any) => (
              <div
                key={msg.id ?? msg.content}
                className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-1.5 max-w-[88%] min-w-0 md:max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed min-w-0 w-full ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted/60 border border-border/60 rounded-bl-sm"
                    }`}
                  >
                    {msg.attachment && (
                      <div className="mb-2.5 overflow-hidden rounded-lg border border-border/50">
                        {msg.attachment.startsWith("data:application/pdf") ? (
                          <div className="flex items-center gap-2 p-3 bg-muted/40">
                            <FileText className="w-5 h-5 text-red-400 shrink-0" />
                            <span className="text-[11px] font-medium truncate text-muted-foreground">
                              PDF attached
                            </span>
                          </div>
                        ) : (
                          <img
                            src={msg.attachment}
                            alt="Attached image"
                            className="max-h-48 md:max-h-60 w-auto object-contain rounded-lg"
                          />
                        )}
                      </div>
                    )}
                    <MessageContent text={msg.content} />
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-secondary border border-border/60 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 md:gap-4 justify-start">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-muted/60 border border-border/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
