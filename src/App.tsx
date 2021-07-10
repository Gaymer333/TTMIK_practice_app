import { Button, Card, CardActions, CardContent } from '@material-ui/core';
import './App.scss';

function App() {

  return <>
  
    <Card id="mainCard">
        <CardContent>
          <p color="textSecondary">
            Word of the Day
          </p>
          <h5>
            test
          </h5>
          <p color="textSecondary">
            adjective
          </p>
          <p>
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </p>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
  </>
}

export default App;
