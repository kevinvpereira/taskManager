import { useHistory } from 'react-router-dom';
import Button from '../UI/Button'
import classes from './Home.module.css'

const Home = () => {
  const history = useHistory();

  const startHandler = () => {
    history.push("/login");
  };

  return <div className={classes.home}>
    <h1>Tired of Disorder?</h1>
    <h2>Let Us Help You Organize Your Tasks</h2>
    <Button onClick={startHandler}>Start Now</Button>
  </div>;
};

export default Home;
