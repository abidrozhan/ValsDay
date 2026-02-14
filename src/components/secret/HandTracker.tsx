"use client";

import { useEffect, useRef, useState } from "react";
import { GestureType, HandData } from "./types";

export type { GestureType, HandData };

interface HandTrackerProps {
    onHandUpdate: (data: HandData) => void;
    active: boolean;
}

// Load script from CDN
function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

// Count extended fingers (excluding thumb for gesture classification)
function countExtendedFingers(landmarks: any[]): number {
    let count = 0;
    // Index, Middle, Ring, Pinky — tip above PIP = extended
    const fingerPairs: [number, number][] = [[8, 6], [12, 10], [16, 14], [20, 18]];
    for (const [tipIdx, pipIdx] of fingerPairs) {
        if (landmarks[tipIdx].y < landmarks[pipIdx].y) count++;
    }
    return count;
}

// Get hand depth from wrist z-coordinate (MediaPipe provides z)
function getHandDepth(landmarks: any[]): number {
    // Landmark 0 = wrist. z is roughly proportional to distance
    // Closer to camera = more negative z, farther = less negative
    const wristZ = landmarks[0].z || 0;
    // Map roughly: -0.3 (close) to 0.1 (far) => 0 to 1
    const normalized = Math.max(0, Math.min(1, (wristZ + 0.3) / 0.4));
    return normalized;
}

declare global {
    interface Window {
        Hands: any;
    }
}

export default function HandTracker({ onHandUpdate, active }: HandTrackerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const prevPos = useRef({ x: 0.5, y: 0.5 });
    const lastMoveTime = useRef<number>(Date.now());
    const callbackRef = useRef(onHandUpdate);
    callbackRef.current = onHandUpdate;
    const [status, setStatus] = useState("Waiting...");
    const [useMouse, setUseMouse] = useState(false);

    // Mouse fallback with idle timer
    useEffect(() => {
        if (!active || !useMouse) return;

        let mouseDown = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;
        let currentGesture: GestureType = "idle";

        const sendUpdate = (gesture: GestureType, x: number, y: number, fingerCount: number, velocity: number) => {
            currentGesture = gesture;
            callbackRef.current({
                x, y, z: 0.5,
                gesture, fingerCount, handCount: gesture === "idle" ? 0 : 1, velocity,
            });
        };

        const resetIdleTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                // After 3 seconds of no movement → idle
                sendUpdate("idle", prevPos.current.x, prevPos.current.y, 0, 0);
            }, 3000);
        };

        const onMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            const dx = x - prevPos.current.x;
            const dy = y - prevPos.current.y;
            const velocity = Math.sqrt(dx * dx + dy * dy);
            prevPos.current = { x, y };
            lastMoveTime.current = Date.now();

            let gesture: GestureType = "open_hand";
            if (mouseDown) gesture = "fist";
            else if (velocity > 0.02) gesture = "move";

            sendUpdate(gesture, x, y, mouseDown ? 0 : 5, velocity);
            resetIdleTimer();
        };

        const onDown = () => { mouseDown = true; };
        const onUp = () => { mouseDown = false; };

        // Key shortcuts: 1=one_finger(rose), 2=two_fingers(earth), H=both_hands(heart+msg), I=idle(text)
        const onKey = (e: KeyboardEvent) => {
            const x = prevPos.current.x;
            const y = prevPos.current.y;

            if (e.key === "1") {
                sendUpdate("one_finger", x, y, 1, 0);
            } else if (e.key === "2") {
                sendUpdate("two_fingers", x, y, 2, 0);
            } else if (e.key === "h" || e.key === "H") {
                sendUpdate("both_hands", x, y, 10, 0);
            } else if (e.key === "i" || e.key === "I") {
                sendUpdate("idle", x, y, 0, 0);
            }
        };

        // Scroll wheel = zoom (simulate depth)
        const onWheel = (e: WheelEvent) => {
            // Currently depth is only visual in ParticleScene
            // Could be used for future zoom features
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", onWheel);

        // Start with idle after 3 seconds
        resetIdleTimer();

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", onWheel);
            if (idleTimer) clearTimeout(idleTimer);
        };
    }, [active, useMouse]);

    // Camera + MediaPipe hand tracking
    useEffect(() => {
        if (!active || !videoRef.current) return;

        let cleanup: (() => void) | null = null;
        let cancelled = false;
        let stream: MediaStream | null = null;

        async function init() {
            try {
                // Step 1: Camera
                setStatus("📷 Requesting camera...");

                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480, facingMode: "user" },
                    });
                    if (cancelled || !videoRef.current) return;

                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setStatus("📷 Camera active ✓");
                    console.log("[HandTracker] Camera stream active ✓");
                } catch (camErr: any) {
                    const errMsg = camErr?.message || camErr?.name || String(camErr);
                    console.error("[HandTracker] Camera error:", errMsg, camErr);
                    setStatus(`🖱️ Mouse mode (cam: ${errMsg})`);
                    setUseMouse(true);
                    return;
                }

                // Step 2: Load MediaPipe
                setStatus("⏳ Loading hand tracking AI...");
                await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

                if (cancelled || !videoRef.current) return;

                const HandsClass = window.Hands;
                if (!HandsClass) {
                    setStatus("🖱️ Mouse mode (AI load failed)");
                    setUseMouse(true);
                    return;
                }

                setStatus("⏳ Initializing hand model...");

                const hands = new HandsClass({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
                });

                hands.setOptions({
                    maxNumHands: 2,
                    modelComplexity: 0, // Lite model for better performance
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.5,
                });

                hands.onResults((results: any) => {
                    const now = Date.now();
                    const handCount = results.multiHandLandmarks?.length || 0;

                    if (handCount === 0) {
                        const timeSinceMove = now - lastMoveTime.current;
                        callbackRef.current({
                            x: prevPos.current.x,
                            y: prevPos.current.y,
                            z: 0.5,
                            gesture: timeSinceMove > 3000 ? "idle" : "move",
                            fingerCount: 0, handCount: 0, velocity: 0,
                        });
                        return;
                    }

                    if (handCount >= 2) {
                        const w = results.multiHandLandmarks[0][0];
                        callbackRef.current({
                            x: w.x, y: w.y, z: getHandDepth(results.multiHandLandmarks[0]),
                            gesture: "both_hands",
                            fingerCount: 10, handCount: 2, velocity: 0,
                        });
                        lastMoveTime.current = now;
                        return;
                    }

                    const landmarks = results.multiHandLandmarks[0];
                    const palm = landmarks[9];
                    const dx = palm.x - prevPos.current.x;
                    const dy = palm.y - prevPos.current.y;
                    const velocity = Math.sqrt(dx * dx + dy * dy);
                    prevPos.current = { x: palm.x, y: palm.y };

                    // Only update last motion time if moving significantly
                    if (velocity > 0.005) {
                        lastMoveTime.current = now;
                    }

                    const depth = getHandDepth(landmarks);
                    const fingerCount = countExtendedFingers(landmarks);
                    const timeSinceMove = now - lastMoveTime.current;

                    let gesture: GestureType;
                    if (timeSinceMove > 2000) gesture = "idle"; // 2s idle -> text
                    else if (fingerCount === 0) gesture = "fist";
                    else if (fingerCount === 1) gesture = "one_finger";
                    else if (fingerCount === 2) gesture = "two_fingers";
                    else if (velocity > 0.05) gesture = "move";
                    else if (fingerCount >= 4) gesture = "open_hand";
                    else gesture = "move";

                    callbackRef.current({
                        x: palm.x, y: palm.y, z: depth,
                        gesture, fingerCount, handCount: 1, velocity,
                    });
                });

                // Step 3: Frame processing loop
                setStatus("🖐️ Hand tracking active!");
                let animId: number;

                // Throttle detection to ~10 FPS (100ms) to save CPU
                let lastVideoTime = 0;
                const THROTTLE_MS = 100;

                const processFrame = async () => {
                    if (cancelled || !videoRef.current) return;

                    const now = Date.now();
                    if (now - lastVideoTime >= THROTTLE_MS && videoRef.current.readyState >= 2) {
                        lastVideoTime = now;
                        try {
                            await hands.send({ image: videoRef.current });
                        } catch (e) {
                            // Skip frame on error
                        }
                    }
                    animId = requestAnimationFrame(processFrame);
                };

                animId = requestAnimationFrame(processFrame);

                cleanup = () => {
                    cancelAnimationFrame(animId);
                    hands.close();
                };
            } catch (err: any) {
                console.error("[HandTracker] Init error:", err);
                setStatus(`🖱️ Mouse mode (${err?.message || "error"})`);
                setUseMouse(true);
            }
        }

        init();

        return () => {
            cancelled = true;
            if (cleanup) cleanup();
            if (stream) stream.getTracks().forEach((t) => t.stop());
        };
    }, [active]);

    return (
        <>
            {!useMouse && (
                <video
                    ref={videoRef}
                    className="hand-tracker-video"
                    autoPlay
                    playsInline
                    muted
                />
            )}
            <div className="hand-tracker-status">
                {status}
                {useMouse && (
                    <span className="mouse-controls-hint">
                        &nbsp;| Move=follow | Click=explode | 1=🌹 | 2=🌍 | H=❤️ | I=text
                    </span>
                )}
            </div>
        </>
    );
}
