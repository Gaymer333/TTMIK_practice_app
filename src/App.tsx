import { Button, Card, CardContent } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import './App.scss';
import { useState } from 'react';
import Exercise from './component/exercise';


export enum ProgramStatus {
  MainMenu,
  Running,
  Done,
}

function App() {

  const [status, setStatus] = useState<ProgramStatus>(ProgramStatus.MainMenu)

  const AppCardContent = () => {
    switch (status) {
      case ProgramStatus.MainMenu:
        return <>
          <Button variant="contained" onClick={() => { setStatus(ProgramStatus.Running) }}>Start</Button>
        </>
      case ProgramStatus.Running:
        return <Exercise setProgramStatus={(status) => setStatus(status)} />
      case ProgramStatus.Done:
        return <>
          <p>Done</p>
          <Button variant="contained" onClick={() => setStatus(ProgramStatus.MainMenu)}>Restart</Button>
        </>
    }
  }

  return <>
    <Card id="mainCard" variant="outlined">
      <CardContent>
        <AppCardContent />

      </CardContent>
    </Card>
    <p>Made by Peter Andresen</p>
    <a className="githubLink" rel="noreferrer" href="https://github.com/Gaymer333" target="_blank" ><GitHubIcon /></a>
  </>
}

export default App;
