import React,{createContext, useContext, useEffect, useReducer} from "react";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.js";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import {reducer,initialState} from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";


export const UserContext = createContext();

const Routing = ()=>{
  const history = useHistory();
  // eslint-disable-next-line
  const {state, dispatch} = useContext(UserContext);
  useEffect(()=>{
    let user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    if(user){
      dispatch({type:"USER",payload:user});
    }else{
      history.push("/signin")
    }
    // eslint-disable-next-line
  },[]);

  return (
    <Switch>
      <Route path="/" exact>
          <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
