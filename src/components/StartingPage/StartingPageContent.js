import classes from './StartingPageContent.module.css';
import {useContext} from 'react';
import AuthContext from '../../store/auth-context';
const StartingPageContent = () => {

const authCtx = useContext(AuthContext);

const {username} = authCtx;
  return (
    <section className={classes.starting}>
      <h1>Welcome on Board! {username}</h1>
    </section>
  );
};

export default StartingPageContent;
