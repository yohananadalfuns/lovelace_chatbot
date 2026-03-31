"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, PanelLeft, Sparkles, Sun } from "lucide-react";

interface IHeader {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({
  theme,
  setTheme,
  isMobileOpen,
  setIsMobileOpen,
}: IHeader) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="h-14 border-b border-border/60 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md z-10 shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Lovelace
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">
            gemini-2.5-flash-lite
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="h-8 w-8 rounded-lg"
      >
        {mounted &&
          (theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          ))}
      </Button>
    </header>
  );
}
