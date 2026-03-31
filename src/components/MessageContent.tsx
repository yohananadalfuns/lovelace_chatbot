"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

export default function MessageContent({ text }: { text: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const content = String(children).replace(/\n$/, "");

            return !inline && match ? (
              <div className="not-prose w-full min-w-0 my-4 rounded-lg overflow-hidden border">
                <CodeBlock language={match[1]} value={content} />
              </div>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs font-semibold text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border rounded-lg">
              <table className="w-full text-left border-collapse">
                {children}
              </table>
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
