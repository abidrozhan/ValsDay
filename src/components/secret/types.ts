export type GestureType =
    | "idle"
    | "move"
    | "fist"
    | "one_finger"
    | "two_fingers"
    | "open_hand"
    | "both_hands";

export interface HandData {
    x: number; // normalized 0..1
    y: number;
    z: number; // depth: 0=close to camera, 1=far
    gesture: GestureType;
    fingerCount: number;
    handCount: number;
    velocity: number; // speed of movement
}
