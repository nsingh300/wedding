'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { wedding } from '@/config/wedding';

export default function SiteMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const sync = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    setPlaying(!a.paused);
    setMuted(a.muted);
  }, []);

  useEffect(() => {
    if (!wedding.musicSrc) return;
    const a = audio.current;
    if (!a) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    a.volume = wedding.musicVolume ?? 0.45;
    a.loop = true;

    const startMuted = async () => {
      if (reduced) return;
      a.muted = true;
      try {
        await a.play();
        sync();
      } catch {
        setNeedsTap(true);
      }
    };

    startMuted();

    const onVis = () => {
      if (document.hidden || a.paused || reduced) return;
      a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [sync]);

  const enableSound = async () => {
    const a = audio.current;
    if (!a) return;
    a.muted = false;
    try {
      await a.play();
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
    sync();
  };

  const toggleMute = async () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.muted = false;
      try {
        await a.play();
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    } else {
      a.muted = !a.muted;
      if (!a.muted) setNeedsTap(false);
    }
    sync();
  };

  if (!wedding.musicSrc) return null;

  return (
    <>
      <audio ref={audio} src={wedding.musicSrc} preload="auto" playsInline className="sr-only" aria-hidden onPlay={sync} onPause={sync} />
      {needsTap && !playing && (
        <button type="button" onClick={enableSound}
          className="glass fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm text-ivory shadow-lg md:bottom-8">
          <Music size={16} className="text-champagne" />Tap for music
        </button>
      )}
      <button type="button" onClick={toggleMute} aria-label={muted || !playing ? 'Turn music on' : 'Mute music'}
        className="glass fixed bottom-6 right-4 z-50 rounded-full p-3 text-ivory shadow-lg md:bottom-8 md:right-6">
        {muted || !playing ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </>
  );
}
