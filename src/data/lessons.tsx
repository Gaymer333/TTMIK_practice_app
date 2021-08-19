export type DictionaryLesson = {
    lessonNumber: number
    exercises: Array<DictionaryExercise>
    sideExercises?: Array<DictionaryExercise>
}

export type DictionaryExercise = {
    seleted: boolean
    english: string
    hangul: string
}

export const _lessons: Array<DictionaryLesson> = [
    {
        lessonNumber: 1,
        exercises: [
            { english: "Hello", hangul: "안녕하세요", seleted: true },
            { english: "Thank you", hangul: "감사합니다", seleted: true }
        ],
        sideExercises: [
            { english: "Here you go", hangul: "여기요", seleted: false },
        ]
    },
    {
        lessonNumber: 2,
        exercises: [
            { english: "Yes", hangul: "네", seleted: true },
            { english: "No", hangul: "아니요", seleted: true }
        ],
        sideExercises: [
            { english: "Coffee", hangul: "커피", seleted: false },
            { english: "To like", hangul: "좋아해요", seleted: false },
            { english: "That's right", hangul: "맞아요", seleted: false },
        ]
    },
    {
        lessonNumber: 3,
        exercises: [
            { english: "Stay in peace", hangul: "안녕히 계세요", seleted: false },
            { english: "Go in peace", hangul: "안녕히 가세요", seleted: false }
        ]
    },
    {
        lessonNumber: 4,
        exercises: [
            { english: "I'm sorry", hangul: "죄송합니다", seleted: false },
            { english: "Excuse me", hangul: "저기요", seleted: false }
        ]
    },
    {
        lessonNumber: 5,
        exercises: [
            { english: "It's me", hangul: "저예요", seleted: false },
            { english: "What is it?", hangul: "뭐여요", seleted: false }
        ]
    }
]