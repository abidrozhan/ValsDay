"use client";

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

/**
 * Global Music System Logic:
 * 
 * 1. There is a "theme music" that loops globally. Default: "kota ini tak sama tanpamu"
 * 2. Theme music can be changed from the Music page. When changing songs there, 
 *    the new song becomes the theme.
 * 3. On the Music page: loop is OFF, user can freely switch songs.
 *    When leaving the Music page: loop turns back ON with whatever song was active.
 * 4. Flowers page has its own dedicated track. When entering Flowers, 
 *    the theme is PAUSED and flowers music plays (looped).
 * 5. When leaving Flowers, the theme resumes from where it was paused.
 * 6. Back buttons on quiz/music/secret do NOT affect theme music.
 * 7. Back button on Flowers resumes theme and stops flowers music.
 */

// All available songs for the music player
export const ALL_SONGS = [
    {
        title: "kota ini tak sama tanpamu",
        artist: "Nadhif Basalamah",
        src: "/Nadhif Basalamah - kota ini tak sama tanpamu (Official Lyric Video).mp3",
    },
    {
        title: "Reality",
        artist: "Alexandra - Reality Club",
        src: "/Alexandra - Reality Club (Official Lyric Video).mp3",
    },
    {
        title: "Bercinta Lewat Kata",
        artist: "Donne Maula",
        src: "/Donne Maula - Bercinta Lewat Kata (Official Lyric Video).mp3",
    },
    {
        title: "Cincin",
        artist: "Hindia",
        src: "/Hindia - Cincin (Official Lyric Video).mp3",
    },
    {
        title: "everything u are",
        artist: "Hindia",
        src: "/Hindia - everything u are.mp3",
    },
    {
        title: "Oh, Bella",
        artist: "Reality Club",
        src: "/Reality Club - Oh, Bella (Official Lyric Video).mp3",
    },
    {
        title: "Besok Kita Pergi Makan",
        artist: "Sal Priadi",
        src: "/Sal Priadi - Besok Kita Pergi Makan (Official Audio).mp3",
    },
    {
        title: "Kita usahakan rumah itu",
        artist: "Sal Priadi",
        src: "/Sal Priadi - Kita usahakan rumah itu (Official Lyric Video).mp3",
    },
];

const FLOWERS_TRACK = "/flowers-music.mp3";

interface AudioContextType {
    // Theme state
    isPlaying: boolean;
    currentSongIndex: number;
    // For Music page
    enterMusicPage: () => void;
    leaveMusicPage: () => void;
    musicPageActive: boolean;
    // For Flowers page
    enterFlowersPage: () => void;
    leaveFlowersPage: () => void;
    // Controls (used by Music page player)
    playSong: (index: number) => void;
    togglePlay: () => void;
    // Theme audio ref for progress tracking
    themeAudioRef: React.RefObject<HTMLAudioElement | null>;
    // Initial play (for user interaction requirement)
    startTheme: () => void;
    themeStarted: boolean;
}

const AudioCtx = createContext<AudioContextType>({
    isPlaying: false,
    currentSongIndex: 0,
    enterMusicPage: () => { },
    leaveMusicPage: () => { },
    musicPageActive: false,
    enterFlowersPage: () => { },
    leaveFlowersPage: () => { },
    playSong: () => { },
    togglePlay: () => { },
    themeAudioRef: { current: null },
    startTheme: () => { },
    themeStarted: false,
});

export function useAudio() {
    return useContext(AudioCtx);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const themeAudioRef = useRef<HTMLAudioElement | null>(null);
    const flowersAudioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [musicPageActive, setMusicPageActive] = useState(false);
    const [flowersActive, setFlowersActive] = useState(false);
    const [themeStarted, setThemeStarted] = useState(false);

    // Store the theme position when entering flowers
    const themePausedTimeRef = useRef(0);
    const themePausedIndexRef = useRef(0);

    // Initialize theme audio source
    useEffect(() => {
        if (themeAudioRef.current && !themeAudioRef.current.src) {
            themeAudioRef.current.src = ALL_SONGS[0].src;
        }
    }, []);

    // Start theme (called after first user interaction)
    const startTheme = useCallback(() => {
        const audio = themeAudioRef.current;
        if (!audio) return;
        audio.src = ALL_SONGS[currentSongIndex].src;
        audio.loop = true;
        audio.volume = 1;
        audio.play().then(() => {
            setIsPlaying(true);
            setThemeStarted(true);
        }).catch(() => { });
    }, [currentSongIndex]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        const audio = themeAudioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => setIsPlaying(true)).catch(() => { });
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    }, []);

    // Play a specific song by index
    const playSong = useCallback((index: number) => {
        const audio = themeAudioRef.current;
        if (!audio) return;
        setCurrentSongIndex(index);
        audio.src = ALL_SONGS[index].src;
        audio.load();
        const onReady = () => {
            audio.removeEventListener("canplaythrough", onReady);
            audio.play().then(() => setIsPlaying(true)).catch(() => { });
        };
        audio.addEventListener("canplaythrough", onReady);
    }, []);

    // ============ MUSIC PAGE ============
    const enterMusicPage = useCallback(() => {
        setMusicPageActive(true);
        const audio = themeAudioRef.current;
        if (audio) {
            audio.loop = false; // Disable loop on music page
        }
    }, []);

    const leaveMusicPage = useCallback(() => {
        setMusicPageActive(false);
        const audio = themeAudioRef.current;
        if (audio) {
            audio.loop = true; // Re-enable loop when leaving
        }
    }, []);

    // ============ FLOWERS PAGE ============
    const enterFlowersPage = useCallback(() => {
        setFlowersActive(true);
        const theme = themeAudioRef.current;
        const flowers = flowersAudioRef.current;

        // Save theme position
        if (theme) {
            themePausedTimeRef.current = theme.currentTime;
            themePausedIndexRef.current = currentSongIndex;
            theme.pause();
        }

        // Play flowers music
        if (flowers) {
            flowers.src = FLOWERS_TRACK;
            flowers.loop = true;
            flowers.volume = 1;
            flowers.load();
            const onReady = () => {
                flowers.removeEventListener("canplaythrough", onReady);
                flowers.play().catch(() => { });
            };
            flowers.addEventListener("canplaythrough", onReady);
        }
    }, [currentSongIndex]);

    const leaveFlowersPage = useCallback(() => {
        setFlowersActive(false);
        const theme = themeAudioRef.current;
        const flowers = flowersAudioRef.current;

        // Stop flowers
        if (flowers) {
            flowers.pause();
            flowers.currentTime = 0;
        }

        // Resume theme from where it was paused
        if (theme && themeStarted) {
            const savedIndex = themePausedIndexRef.current;
            if (theme.src !== ALL_SONGS[savedIndex]?.src) {
                theme.src = ALL_SONGS[savedIndex].src;
                theme.load();
            }
            theme.currentTime = themePausedTimeRef.current;
            theme.loop = true;
            theme.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [themeStarted]);

    // Handle song end on music page (go to next song)
    useEffect(() => {
        const audio = themeAudioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            if (musicPageActive) {
                // On music page, go to next song
                const nextIndex = (currentSongIndex + 1) % ALL_SONGS.length;
                playSong(nextIndex);
            }
            // If not on music page, loop handles it
        };

        audio.addEventListener("ended", handleEnded);
        return () => audio.removeEventListener("ended", handleEnded);
    }, [musicPageActive, currentSongIndex, playSong]);

    return (
        <AudioCtx.Provider value={{
            isPlaying,
            currentSongIndex,
            enterMusicPage,
            leaveMusicPage,
            musicPageActive,
            enterFlowersPage,
            leaveFlowersPage,
            playSong,
            togglePlay,
            themeAudioRef,
            startTheme,
            themeStarted,
        }}>
            <audio ref={themeAudioRef} loop preload="auto" />
            <audio ref={flowersAudioRef} preload="none" />
            {children}
        </AudioCtx.Provider>
    );
}
