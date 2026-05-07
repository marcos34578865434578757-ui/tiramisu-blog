"use client";

import { motion } from "framer-motion";
import { Music2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FloatingMusicPlayerProps = {
  title: string;
  artist: string;
  src: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

export function FloatingMusicPlayer({
  title,
  artist,
  src,
}: FloatingMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "none";
    audioRef.current = audio;

    const updateProgress = () => {
      if (!audio.duration) {
        return;
      }
      setProgress((audio.currentTime / audio.duration) * 100);
      setDuration(audio.duration);
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
  }, [src]);

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
        audio.load();
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setError(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      className="fixed bottom-4 right-4 z-30 w-[min(92vw,380px)] rounded-[26px] border border-white/70 bg-[linear-gradient(135deg,rgba(221,245,232,0.94),rgba(245,247,251,0.86))] p-3 shadow-[0_18px_50px_rgba(113,170,148,0.24)] backdrop-blur-xl sm:bottom-6 sm:right-6"
    >
      <div className="flex items-center gap-3 rounded-[22px]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#3fc2b8] shadow-[0_12px_20px_rgba(51,65,85,0.08)]">
          <Music2 size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-slate-700">{title}</p>
          <p className="truncate text-sm text-slate-500">
            {error ? "音频待上传" : artist}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#8fdcc2,#cfe8ff)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>{error ? "coming soon" : formatTime((progress / 100) * duration)}</span>
            <span>{error ? "tap later" : formatTime(duration)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          disabled={error}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#3fc2b8] shadow-[0_12px_20px_rgba(51,65,85,0.08)] hover:-translate-y-0.5 hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
      </div>
    </motion.div>
  );
}
