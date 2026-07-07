"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { MemoryCarousel } from "@/components/MemoryCarousel";
import type { Language } from "@/components/Navbar";
import type { MemoryItem } from "@/lib/site-content";

type MemoryExperienceProps = {
  items: MemoryItem[];
  lang: Language;
};

const audioSrc = "/audio/memory-song.m4a";

export function MemoryExperience({ items, lang }: MemoryExperienceProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpinning, setIsSpinning] = useState(true);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const pauseLabel = lang === "zh" ? "暂停音乐" : "Pause Music";
  const resumeLabel = lang === "zh" ? "继续播放" : "Resume Music";
  const manualPlayLabel = lang === "zh" ? "点击播放音乐" : "Play Music";
  const AudioControlIcon = isSpinning ? Pause : Play;
  const audioControlLabel = needsManualPlay && !isPlaying ? manualPlayLabel : isSpinning ? pauseLabel : resumeLabel;
  const errorText =
    lang === "zh"
      ? "音乐暂时没有播放成功，可以再点一次试试。"
      : "The music did not start. Please try again.";

  useEffect(() => {
    const audio = audioRef.current;
    let isMounted = true;

    if (!audio) {
      return;
    }

    const audioElement = audio;

    async function tryAutoplay() {
      try {
        await audioElement.play();

        if (isMounted) {
          setIsPlaying(true);
          setIsSpinning(true);
          setNeedsManualPlay(false);
        }
      } catch {
        if (isMounted) {
          setIsPlaying(false);
          setIsSpinning(true);
          setNeedsManualPlay(true);
        }
      }
    }

    void tryAutoplay();

    return () => {
      isMounted = false;
      audioElement.pause();
    };
  }, []);

  async function playAudio() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setHasPlaybackError(false);
    setIsSpinning(true);

    try {
      await audio.play();
      setIsPlaying(true);
      setNeedsManualPlay(false);
    } catch {
      setIsPlaying(false);
      setIsSpinning(false);
      setNeedsManualPlay(true);
      setHasPlaybackError(true);
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (needsManualPlay && !isPlaying) {
      await playAudio();
      return;
    }

    if (isSpinning || isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsSpinning(false);
      setNeedsManualPlay(false);
      return;
    }

    await playAudio();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-100 bg-white/80 p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            aria-label={audioControlLabel}
            className={`memory-vinyl-button ${isSpinning ? "is-playing" : ""} ${
              needsManualPlay && !isPlaying ? "needs-manual-play" : ""
            }`}
            onClick={togglePlayback}
            title={audioControlLabel}
            type="button"
          >
            <span className="memory-vinyl-disc" aria-hidden="true">
              <span className="memory-vinyl-center">
                <AudioControlIcon className="h-4 w-4" />
              </span>
            </span>
            <span className="memory-vinyl-label">{audioControlLabel}</span>
          </button>
          {hasPlaybackError ? (
            <p className="text-sm font-medium text-[#9a4a1f]">{errorText}</p>
          ) : null}
        </div>
      </div>
      <audio
        loop
        onPause={() => {
          setIsPlaying(false);
          setIsSpinning(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setIsSpinning(true);
          setNeedsManualPlay(false);
        }}
        preload="auto"
        ref={audioRef}
        src={audioSrc}
      />
      <div className="memory-gallery-enter space-y-6">
        {items.map((item) => (
          <MemoryCarousel item={item} key={item.year} lang={lang} />
        ))}
      </div>
    </div>
  );
}
