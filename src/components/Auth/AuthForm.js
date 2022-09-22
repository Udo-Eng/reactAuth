import { useState,useRef,useContext } from 'react';
import AuthContext from '../../store/auth-context';
import {useHistory} from 'react-router-dom'
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const userNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };



  const submitHandler = (event) => {

    event.preventDefault();


      const enteredUserName = userNameInputRef.current.value; 
      const enteredEmail = emailInputRef.current.value; 
      const enteredPassword = passwordInputRef.current.value; 
      
      setIsLoading(true);
      let url;
      if(isLogin){
          
           url =
              "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API KEY]";


      }else{
        
          url =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API KEY]";
        
        
          }
          
          fetch(
          url,
          {
            method: "POST",
            "Content-Type": "application/json",
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword,
              returnSecureToken: true,
            }),
          }
        ).then(res => {
          setIsLoading(false);
          if(res.ok){
              return res.json();
          }else{

            // if no error logout the data sent 
           return  res.json().then(data => {

                let errorMessage = 'Authentication failed!';

                if(data && data.error && data.error.message){
                  errorMessage = data.error.message;
                }

                //Alert for an invalid password
                throw new Error(errorMessage);

            })
          }
        }).then(data => {
          const expirationTime = new Date(
            new Date().getTime() + (+data.expiresIn * 1000)
          );
          // Login the user
          authCtx.login(data.idToken, expirationTime.toISOString());
          authCtx.setUserName(enteredUserName.toUpperCase());

          // Redirect the user to the welcome page
          history.replace('/');

        }).catch((err => {
          alert(err.message);
        }));
      
  }


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='username'>Username</label>
          <input ref={userNameInputRef} type='text' id='username' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailInputRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordInputRef} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          {!isLoading &&<button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
