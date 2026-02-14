export type QuestionType = "essay" | "multiple-choice" | "slider";

export interface QuizOption {
    label: string;
    value: string;
    hasEssay?: boolean;
}

export interface QuizQuestionData {
    id: number;
    question: string;
    type: QuestionType;
    options?: QuizOption[];
    sliderMin?: number;
    sliderMax?: number;
    sliderLabels?: Record<number, string>;
    rejectPattern?: RegExp;
    rejectMessage?: string;
}

export interface QuizAnswer {
    questionId: number;
    question: string;
    answer: string;
    selectedOption?: string;
}

export const QUIZ_QUESTIONS: QuizQuestionData[] = [
    {
        id: 1,
        question: "What food instantly makes you feel better when you're having a bad day?",
        type: "essay",
    },
    {
        id: 2,
        question: "What's your favorite place to go in Bandung?",
        type: "essay",
    },
    {
        id: 3,
        question: "What's your favorite way to make Abid laugh?",
        type: "multiple-choice",
        options: [
            { label: "A", value: "Teasing him playfully" },
            { label: "B", value: "Sending random memes" },
            { label: "C", value: "Acting silly on purpose" },
            { label: "D", value: "Giving unexpected compliments" },
            { label: "E", value: "I don't try… he laughs because of me anyway" },
            { label: "F", value: "Other way", hasEssay: true },
        ],
    },
    {
        id: 4,
        question: "What makes you feel most loved? (Love language edition)",
        type: "multiple-choice",
        options: [
            { label: "A", value: "Words of affirmation" },
            { label: "B", value: "Quality time" },
            { label: "C", value: "Acts of service" },
            { label: "D", value: "Physical touch" },
            { label: "E", value: "Thoughtful gifts" },
        ],
    },
    {
        id: 5,
        question: "The ultimate question: Would you say Abid is your favorite person?",
        type: "multiple-choice",
        options: [
            { label: "A", value: "Yes, obviously" },
            { label: "B", value: "Yes, but don't let it get to his head" },
            { label: "C", value: "Maybe… okay fine, yes" },
            { label: "D", value: "He already knows the answer" },
            { label: "F", value: "Write it yourself", hasEssay: true },
        ],
        rejectPattern: /\bno\b/i,
        rejectMessage: "Seriously? 🥺 Think again.",
    },
    {
        id: 6,
        question: "How much does Abid annoy you? (Be honest)",
        type: "slider",
        sliderMin: 1,
        sliderMax: 10,
        sliderLabels: {
            1: "Not at all 😇",
            2: "Barely 🤷",
            3: "A tiny bit 😏",
            4: "Sometimes 😅",
            5: "Just enough 💕",
            6: "Lovingly annoying 😂",
            7: "Professionally annoying 🎓",
            8: "Expert level 🏆",
            9: "It's his talent 🌟",
            10: "Maximum annoyance, maximum love 💖",
        },
    },
    {
        id: 7,
        question: "Are you truly happy at this point in your life?",
        type: "essay",
    },
    {
        id: 8,
        question: "If you could write down one dream you truly want to achieve, what would it be?",
        type: "essay",
    },
];
