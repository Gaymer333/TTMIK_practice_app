import { Button, Dialog, Checkbox } from "@material-ui/core";
import { useState } from "react";
import { ProgramStatus } from "../App";

export enum ExerciseProgramStatus {
    Setup,
    MakeExercises,
    FetchFirstExercises,
    Running,
    Done,
}

type DictionaryExercise = {
    english: string
    hangul: string
}

type DictionaryLesson = {
    lessonNumber: number
    seleted: boolean
    exercises: Array<DictionaryExercise>
}

type ExerciseArg = {
    setProgramStatus: (status: ProgramStatus) => void
}

const Exercise = ({ setProgramStatus }: ExerciseArg) => {

    const _lessons: Array<DictionaryLesson> = [
        {
            lessonNumber: 1,
            seleted: true,
            exercises: [
                { english: "Hello", hangul: "안녕하세요" },
                { english: "Thank you", hangul: "감사합니다" }
            ]
        },
        {
            lessonNumber: 2,
            seleted: true,
            exercises: [
                { english: "Yes", hangul: "네" },
                { english: "No", hangul: "아니요" }
            ]
        },
        {
            lessonNumber: 3,
            seleted: false,
            exercises: [
                { english: "Stay in peace", hangul: "안녕히 계세요" },
                { english: "Go in peace", hangul: "안녕히 가세요" }
            ]
        },
        {
            lessonNumber: 4,
            seleted: false,
            exercises: [
                { english: "I'm sorry", hangul: "죄송합니다" },
                { english: "Excuse me", hangul: "저기요" }
            ]
        },
        {
            lessonNumber: 5,
            seleted: false,
            exercises: [
                { english: "It's me", hangul: "저예요" },
                { english: "What is it?", hangul: "뭐여요" }
            ]
        }
    ]

    const [status, setStatus] = useState<ExerciseProgramStatus>(ExerciseProgramStatus.Setup)
    const [lessons, setLessons] = useState(_lessons)
    const [front, setFront] = useState(false)
    const [showLessonsOverview, setShowLessonsOverview] = useState(false)
    const [toDoExercises, setToDoExercises] = useState<Array<DictionaryExercise>>([])
    const [totalNumbersOfExercises, setTotalNumbersOfExercises] = useState(0);
    const [currentExercise, setCurrentExercise] = useState<DictionaryExercise | undefined>(undefined)

    const openLessonsOverview = () => {
        setShowLessonsOverview(true);
    };
    const closeLessonsOverview = () => {
        setShowLessonsOverview(false);
    };

    const makeExercisesReady = () => {
        const exercises = lessons.flatMap(lesson => lesson.exercises)
        setToDoExercises(exercises)
        setTotalNumbersOfExercises(exercises.length)
        setStatus(ExerciseProgramStatus.FetchFirstExercises)
    }

    const fetchNextExercise = () => {
        if (toDoExercises.length === 0) {
            setProgramStatus(ProgramStatus.Done)
        }
        else {
            const index = Math.floor(Math.random() * toDoExercises.length)
            setCurrentExercise(toDoExercises[index])
            toDoExercises.splice(index, 1)
            setStatus(ExerciseProgramStatus.Running);
        }
    }

    const changeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const lessonNumber = event?.target.parentElement?.parentElement?.getAttribute("data-lesson-number")
        const checked = event?.target.checked
        if (lessonNumber && typeof checked === "boolean") {
            const lessonAsNumber = parseInt(lessonNumber)
            //// FROM HERE!!!!!!!!!
        }
        else {
            console.error("'lessonNumber' or 'checked' was not currect value")
        }
    }

    if (status === ExerciseProgramStatus.Setup) {
        return <>
            <h1>Setup</h1>
            <Button variant="contained" onClick={openLessonsOverview} >Pick lessons</Button>
            <Dialog className="lessonDialogBox" open={showLessonsOverview}>
                <h1>Pick lessons</h1>
                <span className="lessons" >
                    {
                        lessons.map(lesson => {
                            const firstExercises = lesson.exercises.slice(0, 2).map(exercise => exercise.english).join(" | ")
                            return <span key={lesson.lessonNumber} className="lessonItem">
                                <Checkbox checked={lesson.seleted} data-lesson-number={lesson.lessonNumber} onChange={changeCheckbox} /><p>Lesson {lesson.lessonNumber}: {firstExercises}</p>
                            </span>
                        })
                    }
                </span>
                <Button variant="contained" onClick={closeLessonsOverview} >Back</Button>
            </Dialog>
            <Button variant="contained" onClick={() => setStatus(ExerciseProgramStatus.MakeExercises)} >Go!</Button>
        </>
    }
    else if (status === ExerciseProgramStatus.MakeExercises) {
        makeExercisesReady()
        return <p>Loading...</p>
    }
    else if (status === ExerciseProgramStatus.FetchFirstExercises) {
        fetchNextExercise()
        return <p>Loading...</p>
    } else {
        if (currentExercise) {
            return <>
                <p>{totalNumbersOfExercises - toDoExercises.length} out of {totalNumbersOfExercises}</p>
                <h2>Please translate this word:</h2>
                <h1>{currentExercise.english}</h1>
                <div className="answerWrapper">
                    <div className={front ? "answer flipped" : "answer"} onClick={() => { setFront(true) }}>
                        <p className="answerText">Click here to see the answer</p>
                    </div>
                    <div className={front ? "answer back" : "answer back flipped"} onClick={() => { setFront(false) }}>
                        <p className="answerText">{currentExercise.hangul}</p>
                        <p className="answerSubText">Click to hide</p>
                    </div>
                </div>
                <Button variant="contained" onClick={() => { fetchNextExercise() }}>New word</Button>
            </>
        } else {
            return <p>Loading...</p>
        }
    }
}

export default Exercise