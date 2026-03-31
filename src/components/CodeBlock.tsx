"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col bg-[#282c34]">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {language || "code"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px]">Copy</span>
            </div>
          )}
        </Button>
      </div>

      <div className="code-block-wrapper">
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="pre"
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              background: "transparent",
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
