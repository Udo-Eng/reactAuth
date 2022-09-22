import React,{useState,useEffect,useCallback} from 'react';


const AuthContext = React.createContext({
    token: '',
    username: '',
    isLoggedIn : false,
    login: (token) => {},
    logout : () => {}
});

let logoutTimer;


const calculateRemainingTime = (expirationTime) => {
    // create a new Date object and get the current time stamp 
    const currentTime = new Date().getTime();

    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
}


const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if(remainingTime <= 60000){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null
    }

    return {
        token : storedToken,
        duration: remainingTime
    }
}


export const AuthContextProvider = (props) => {
   
    const tokenData = retrieveStoredToken();

    let initalToken;

    if(tokenData){
        initalToken = tokenData.token;
    }

    const [token, setToken] = useState(initalToken);
    const [username,setUserName] = useState('');
    const userIsLoggedIn = !!token;



    const setUserNameHandler = (username) => {
        setUserName(username);
    }

// useCallback is used to prevent the  function from revaluating again is tokendata does not change
    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if(logoutTimer){
            clearTimeout(logoutTimer);
        }
    },[]);
        const loginHandler = (token, expirationTime) => {
          setToken(token);
          localStorage.setItem("token", token);
          localStorage.setItem("expirationTime", expirationTime);

          const remainingTime = calculateRemainingTime(expirationTime);

         logoutTimer = setTimeout(logoutHandler,remainingTime);


        };


        useEffect(() => {
            if(tokenData){
                logoutTimer = setTimeout(logoutHandler,tokenData.duration);
            }
        },[tokenData,logoutHandler]);

        
    const contextValue = {
        token: token,
        username: username,
        setUserName: setUserNameHandler,
        isLoggedIn : userIsLoggedIn,
        login:loginHandler,
        logout: logoutHandler
    }
    return (
            <AuthContext.Provider value={contextValue}>
                {props.children}
            </AuthContext.Provider>
    );
}


export default AuthContext;