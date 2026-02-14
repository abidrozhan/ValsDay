export interface FlowerData {
    name: string;
    image: string; // Path to image in public
    color: string;
}

export const FLOWER_POOL: FlowerData[] = [
    { name: "Blue Tulip", image: "/flowers/blue-tulip.png", color: "#64b5f6" },     // K
    { name: "Pink Branch", image: "/flowers/pink-branch.png", color: "#f06292" },   // A
    { name: "Pink Bloom", image: "/flowers/pink-bloom.png", color: "#f8bbd0" },     // L
    { name: "Purple Tulip", image: "/flowers/purple-tulip.png", color: "#ba68c8" }, // Y
    { name: "Red Rose", image: "/flowers/red-rose.png", color: "#ef5350" },         // A (2)
];

export const STORY_STEPS = [
    {
        id: 1,
        lines: [
            "I made this cute little Valentine quiz.",
            "Just harmless questions.",
            "Nothing serious.",
            "Absolutely normal behavior.",
        ],
    },
    {
        id: 2,
        lines: [
            'Then I added:',
            '"What\'s your love language?"',
            '"Is Abid your favorite person?"',
            '"On a scale of 1–10, how annoying is Abid?"',
            "Totally subtle. Very neutral. Very unbiased.",
        ],
    },
    {
        id: 3,
        lines: [
            "She starts answering seriously.",
            "Thinking deeply.",
            "Reflecting on life.",
            "Meanwhile, I'm just waiting for one answer:",
            '"Of course Abid." 😎✨',
        ],
    },
    {
        id: 4,
        lines: [
            "What if she chooses 5 on the annoying scale?",
            "What if I'm not her favorite person?",
            "What if… I accidentally exposed my feelings?",
            "Why is this quiz stressing me out? 😔",
        ],
    },
    {
        id: 5,
        lines: [
            "But honestly…",
            "It was never about the quiz.",
            "I just wanted to know",
            "if I matter to her",
            "the way she matters to me. 🤍",
        ],
    },
];

export function getRandomFlower(collected: FlowerData[]): FlowerData {
    // Return flowers in specific order K -> A -> L -> Y -> A(2) based on step count
    const index = collected.length;
    if (index < FLOWER_POOL.length) {
        return FLOWER_POOL[index];
    }
    return FLOWER_POOL[Math.floor(Math.random() * FLOWER_POOL.length)];
}
