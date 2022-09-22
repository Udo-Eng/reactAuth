import { Switch, Route,Redirect } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import {useContext} from 'react';
import AuthContext from './store/auth-context';


function App() {

    const authCtx = useContext(AuthContext);

    const isLoggedIn = authCtx.isLoggedIn;
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          {isLoggedIn && <HomePage />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        {!isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        <Route path="/profile">
          {isLoggedIn && <ProfilePage username={"Udochukwu"} />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="*">
           <NotFoundPage />
        </Route>

      </Switch>
    </Layout>
  );
}

export default App;
