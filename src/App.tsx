import { Button, Card, CardActions, CardContent } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import './App.scss';
import { useState } from 'react';

type DictionaryExercise = {
  english: string
  hangul: string
}

type DictionaryLesson = {
  lessonNumber: number
  exercises: Array<DictionaryExercise>
}

function App() {

  const [front, setFront] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<DictionaryExercise | undefined>(undefined)

  const _dictionary: Array<DictionaryLesson> = [
    {
      lessonNumber: 1,
      exercises: [
        {english: "Hello", hangul: "안녕하세요"},
        {english: "Thank you", hangul: "감사합니다"}
      ]
    }
  ]

  const dictionary: Array<DictionaryExercise> = _dictionary.flatMap(lesson => lesson.exercises)

  const setExercise = () => {
    setCurrentExercise(dictionary[Math.floor(Math.random() * dictionary.length)])
  }

  if (currentExercise === undefined) setExercise()

  return <>
    <Card id="mainCard" variant="outlined">
      <CardContent>
        {
          currentExercise
          ?
            <>
              <h1>Please translate this word:</h1>
              <h1>{currentExercise.english}</h1>
              <div className="answerWrapper">
                <div className={front ? "answer flipped" : "answer"} onClick={() => { setFront(!front) }}>
                  <p className="answerText">Click here to see the answer</p>
                </div>
                <div className={front ? "answer back" : "answer back flipped"}>
                  <p className="answerText">{currentExercise.hangul}</p>
                </div>
              </div>
            </>
          :
            <h1>Loading...</h1>
        }
        
      </CardContent>
    </Card>
  </>
}

export default App;
