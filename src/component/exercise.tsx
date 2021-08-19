import { Button, Dialog, Checkbox } from "@material-ui/core";
import { useState } from "react";
import { ProgramStatus } from "../App";
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { DictionaryExercise, DictionaryLesson, _lessons } from "../data/lessons";

export enum ExerciseProgramStatus {
    Setup,
    MakeExercises,
    FetchFirstExercises,
    Running,
    Done,
}

type ExerciseArg = {
    setProgramStatus: (status: ProgramStatus) => void
}

const Exercise = ({ setProgramStatus }: ExerciseArg) => {
    
    const setLessons = (lessons: DictionaryLesson[]) => {
        _setLessons(lessons)
        console.log("lessons:",lessons)
        localStorage.setItem("lessons", JSON.stringify(lessons))
    }

    const initial = (): DictionaryLesson[] => {
        const lessonsJsonString = localStorage.getItem("lessons")
        return lessonsJsonString ? JSON.parse(lessonsJsonString) : _lessons
    }

    const [status, setStatus] = useState<ExerciseProgramStatus>(ExerciseProgramStatus.Setup)
    const [lessons, _setLessons] = useState(initial())
    const [front, setFront] = useState(false)
    const [showLessonsOverview, setShowLessonsOverview] = useState(false)
    const [toDoExercises, setToDoExercises] = useState<Array<DictionaryExercise>>([])
    const [totalNumbersOfExercises, setTotalNumbersOfExercises] = useState(0);
    const [currentExercise, setCurrentExercise] = useState<DictionaryExercise | undefined>(undefined)

    const Lesson = ({lesson}: {lesson: DictionaryLesson}) => {
        const firstExercises = lesson.exercises.slice(0, 2).map(exercise => exercise.english).join(" | ")
        
        const indeterminateCheck = (): boolean => {
            const seletedExercisesLength = lesson.exercises.filter(exercise => exercise.seleted).length
            return 0 < seletedExercisesLength && seletedExercisesLength < lesson.exercises.length
        }

        return <span key={lesson.lessonNumber} className="lessonItem">
            <span className="lessonItemMain">
                <Checkbox
                    indeterminate={indeterminateCheck()}
                    checked={lesson.exercises.some(exercise => exercise.seleted)}
                    data-lesson-number={lesson.lessonNumber}
                    onChange={changeLessonCheckbox}
                />
                <p>Lesson {lesson.lessonNumber}: {firstExercises}</p>
            </span>
            <span className="subItems">
                {
                    lesson.exercises.map((exercise, index) => {
                        return <span key={index} className="subItem">
                            <SubdirectoryArrowRightIcon className="subIcon" />
                            <Checkbox
                                checked={exercise.seleted}
                                data-lesson-number={lesson.lessonNumber}
                                data-exercise-english-word={exercise.english}
                                onChange={changeExercisesCheckbox}
                            />
                            <p>{exercise.english}</p>
                        </span>
                    })
                }
            </span>
        </span>
    }

    const openLessonsOverview = () => {
        setShowLessonsOverview(true);
    };
    const closeLessonsOverview = () => {
        setShowLessonsOverview(false);
    };

    const makeExercisesReady = () => {
        const exercises = lessons.flatMap(lesson => lesson.exercises).filter(exercise => exercise.seleted)
        setToDoExercises(exercises)
        setTotalNumbersOfExercises(exercises.length)
        setStatus(ExerciseProgramStatus.FetchFirstExercises)
    }

    const fetchNextExercise = async () => {
        if (front) {
            setFront(false)
            await new Promise(resolve => setTimeout(resolve, 300));
        }
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

    const changeLessonCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const localLessons = [...lessons]
        const lessonNumber = event?.target.parentElement?.parentElement?.getAttribute("data-lesson-number")
        const checkedValue = event?.target.checked
        if (!lessonNumber || typeof checkedValue !== "boolean") throw new Error("'lessonNumber' or 'checked' was not currect value");
        const lessonToChange = localLessons.find(lesson => lesson.lessonNumber === parseInt(lessonNumber) )
        if (!lessonToChange) throw new Error("Could not find lesson by lessonNumber");
        lessonToChange.exercises.map(exercise => exercise.seleted = checkedValue)
        setLessons(localLessons)
    }

    const changeExercisesCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const localLessons = [...lessons]
        const lessonNumber = event?.target.parentElement?.parentElement?.getAttribute("data-lesson-number")
        const englishWord = event?.target.parentElement?.parentElement?.getAttribute("data-exercise-english-word")
        const checkedValue = event?.target.checked
        if (!lessonNumber || !englishWord || typeof checkedValue !== "boolean") throw new Error("'lessonNumber', 'englishWord' or 'checked' was not currect value");
        const lessonToChange = localLessons.find(lesson => lesson.lessonNumber === parseInt(lessonNumber) )
        if (!lessonToChange) throw new Error("Could not find lesson by lessonNumber");
        const exerciseToChange = lessonToChange.exercises.find(exercise => exercise.english === englishWord)
        if (!exerciseToChange) throw new Error("Could not find exercise by englishWord");
        exerciseToChange.seleted = checkedValue 
        setLessons(localLessons)
    }

    if (status === ExerciseProgramStatus.Setup) {
        return <>
            <h1>Setup</h1>
            <Button className="pickLessonBtn" variant="contained" onClick={openLessonsOverview} >Pick lessons</Button>
            <Dialog className="lessonDialogBox" open={showLessonsOverview}>
                <h1>Pick lessons</h1>
                <span className="lessons" >
                    {
                        lessons.map(lesson => <Lesson lesson={lesson} />)
                    }
                </span>
                <Button variant="contained" onClick={closeLessonsOverview} >Back</Button>
            </Dialog>
            <h2>Current seleted:</h2>
            <p>{lessons.filter(lesson => lesson.exercises[0].seleted).length} lessons.</p>
            <p>{lessons.filter(lesson => lesson.exercises[0].seleted).flatMap(lesson => lesson.exercises).length} words.</p>
            <Button className="goBtn" variant="contained" onClick={() => setStatus(ExerciseProgramStatus.MakeExercises)} disabled={!lessons.some(lesson => lesson.exercises[0].seleted)} >Go!</Button>
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
                <Button variant="contained" onClick={() => { fetchNextExercise() }}>{toDoExercises.length ? "New word" : "Finnish"}</Button>
            </>
        } else {
            return <p>Loading...</p>
        }
    }
}

export default Exercise