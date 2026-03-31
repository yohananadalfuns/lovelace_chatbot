import {
  FileText,
  ImageIcon,
  Loader2,
  Paperclip,
  SendHorizontal,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RefObject, SetStateAction } from "react";

interface IMessageBox {
  file: File | null;
  setFile: (value: SetStateAction<File | null>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  setInput: (value: SetStateAction<string>) => void;
  onSend: (text?: string | undefined) => Promise<void>;
  input: string;
  loading: boolean;
}

function fileIcon(file: File) {
  if (file.type.startsWith("image/"))
    return <ImageIcon className="w-3 h-3 text-blue-400 shrink-0" />;
  if (file.type === "application/pdf")
    return <FileText className="w-3 h-3 text-red-400 shrink-0" />;
  return <Paperclip className="w-3 h-3 text-primary shrink-0" />;
}

export default function MessageBox({
  file,
  setFile,
  fileInputRef,
  textareaRef,
  setInput,
  onSend,
  input,
  loading,
}: IMessageBox) {
  const canSend = (!!input.trim() || !!file) && !loading;

  return (
    <div className="flex flex-col gap-2">
      {file && (
        <div className="flex items-center gap-1.5 self-start bg-muted rounded-lg px-2.5 py-1.5 border text-xs max-w-60">
          {fileIcon(file)}
          <span className="truncate font-medium">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
            aria-label="Remove attachment"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 bg-muted/80 backdrop-blur-sm rounded-2xl p-2 border shadow-sm focus-within:border-primary/30 transition-all duration-150">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp,.pdf,.xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 h-9 w-9 rounded-xl mb-0.5 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Lovelace..."
          className="min-h-10 flex-1 border-none shadow-none focus-visible:ring-0 resize-none py-2.5 text-sm bg-transparent"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              onSend();
            }
          }}
        />

        <Button
          type="button"
          size="icon"
          onClick={() => onSend()}
          disabled={!canSend}
          className="shrink-0 h-9 w-9 rounded-xl mb-0.5 bg-primary hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizontal className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
