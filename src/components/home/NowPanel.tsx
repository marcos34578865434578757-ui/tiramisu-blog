"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Flag,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { NowData } from "@/data/now";
import { profile } from "@/data/profile";

type CalendarData = {
  label: string;
  today: number;
  weeks: Array<Array<number | null>>;
};

const weekLabels = [
  "\u65e5",
  "\u4e00",
  "\u4e8c",
  "\u4e09",
  "\u56db",
  "\u4e94",
  "\u516d",
];

function buildCalendar(date: Date): CalendarData {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const days = Array.from({ length: 35 }, (_, index) => {
    const value = index - startOffset + 1;
    return value > 0 && value <= lastDate ? value : null;
  });

  const formatter = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
  });

  return {
    label: formatter.format(date),
    today: date.getDate(),
    weeks: Array.from({ length: 5 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
  };
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

type NowPanelProps = {
  data: NowData;
};

function subscribeToNothing() {
  return () => {};
}

export function NowPanel({ data }: NowPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const isClient = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const calendar = useMemo(
    () => (isClient ? buildCalendar(new Date()) : null),
    [isClient],
  );

  useEffect(() => {
    const audio = new Audio(profile.music.src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const updateProgress = () => {
      if (!audio.duration) {
        return;
      }
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    const handleError = () => {
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || error) {
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setError(true);
      setIsPlaying(false);
    }
  }

  const elapsed = useMemo(
    () => formatTime((progress / 100) * duration),
    [duration, progress],
  );

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="space-y-5"
    >
      <section className="glass-panel surface-highlight overflow-hidden rounded-[34px] p-6 sm:p-7">
        <div className="relative space-y-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              {calendar ? calendar.label : "\u6b63\u5728\u52a0\u8f7d\u4eca\u5929\u7684\u65e5\u5386"}
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/45 text-[var(--color-muted)]">
              <ArrowUpRight size={18} />
            </span>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center text-base text-[var(--color-muted)]">
            {weekLabels.map((label) => (
              <span key={label} className="text-sm font-medium">
                {label}
              </span>
            ))}

            {(calendar?.weeks.flat() ?? Array.from({ length: 35 }, () => null)).map(
              (day, index) => (
                <span
                  key={`${day}-${index}`}
                  className={[
                    "mx-auto flex h-11 w-11 items-center justify-center rounded-[18px] text-xl transition-colors",
                    day === null ? "opacity-0" : "",
                    calendar && day === calendar.today
                      ? "bg-[linear-gradient(135deg,#3fc2b8,#74e0cf)] font-semibold text-white shadow-[0_14px_30px_rgba(63,194,184,0.32)]"
                      : "text-[var(--color-copy)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {day}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="theme-card-soft overflow-hidden rounded-[32px] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--color-accent)] shadow-[0_12px_24px_rgba(51,65,85,0.08)]">
            <Music2 size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-2xl font-semibold text-[var(--color-ink)]">
              {profile.music.title}
            </p>
            <p className="truncate text-base text-[var(--color-muted)]">
              {error ? "\u97f3\u9891\u8d44\u6e90\u6682\u4e0d\u53ef\u7528" : profile.music.artist}
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#b7f5c8,#8fdcc2)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-muted)]">
              <span>{error ? "\u7a0d\u540e\u518d\u8bd5" : elapsed}</span>
              <span>{error ? "0:00" : formatTime(duration)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={togglePlayback}
            disabled={error}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-accent)] shadow-[0_16px_28px_rgba(51,65,85,0.08)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={isPlaying ? "\u6682\u505c\u97f3\u4e50" : "\u64ad\u653e\u97f3\u4e50"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>
      </section>

      <section className="glass-panel surface-highlight overflow-hidden rounded-[34px] p-6 sm:p-7">
        <div className="relative">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-[2rem] font-semibold text-[var(--color-ink)]">
                Now
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              </h2>
              <p className="mt-2 text-lg text-[var(--color-copy)]">
                {"\u6700\u8fd1\u5728\u505a\u4ec0\u4e48"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <InfoSection
              icon={<Sparkles size={18} />}
              title="\u6b63\u5728\u505a"
              items={[data.status]}
            />
            <InfoSection
              icon={<Clock3 size={18} />}
              title="\u6700\u8fd1\u5728\u505a"
              items={data.recentlyDoing}
            />
            <InfoSection
              icon={<BookOpen size={18} />}
              title="\u6b63\u5728\u5b66\u4e60"
              items={data.learning}
            />
            <InfoSection
              icon={<Flag size={18} />}
              title="\u4e0b\u4e00\u6b65\u8ba1\u5212"
              items={data.nextStep}
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t soft-divider pt-5 text-sm text-[var(--color-muted)]">
            <p>Updated: {data.updatedAt}</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/40">
              <RotateCcw size={16} />
            </span>
          </div>
        </div>
      </section>
    </motion.aside>
  );
}

function InfoSection({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <section className="border-t soft-divider pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3 text-lg font-semibold text-[var(--color-ink)]">
        <span className="text-[var(--color-accent)]">{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-lg leading-8 text-[var(--color-copy)]">
            <span
              className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
