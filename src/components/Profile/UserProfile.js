import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';
import { useContext } from "react";
import AuthContext from "../../store/auth-context";


const UserProfile = (props) => {

const authCtx = useContext(AuthContext);

const { username } = authCtx;

  return (
    <section className={classes.profile}>
      <h1>Hello {username} Welcome!</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
