import classes from './ProfileForm.module.css';
import {useRef,useContext} from 'react';
import AuthContext from '../../store/auth-context';
import {useHistory} from 'react-router-dom';
const ProfileForm = () => {

  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = (event) =>{

      event.preventDefault();

       const  enteredPassword = newPasswordInputRef.current.value

      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API KEY]",
        {
          method: "POST",
          "Content-Type": "appplication/json",
          body: JSON.stringify({
            idToken: authCtx.token,
            password: enteredPassword,
            returnSecureToken: true,
          }),
        }
      )
        .then(async (res) => {
          // let data = await res.json();

          // Log the data returned
          // console.log(data);
          history.replace("/");
        })
        .catch((err) => {
          let errorMessage = "The password was not changed sucessfully";
          return alert(errorMessage);
        });
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordInputRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button type="submit">Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
