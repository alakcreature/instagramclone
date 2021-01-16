import React, { useContext } from 'react';
import {Link, useHistory} from 'react-router-dom';
import { UserContext } from '../App';

function Navbar() {
    let history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const renderList = ()=>{
        if(state){
            return [
                <li key="i1"><Link to="/profile">Profile</Link></li>,
                <li key="i2"><Link to="/create">Create</Link></li>,
                <li key="i3"><Link to="/myfollowingpost">My following post</Link></li>,
                <li key="i4">
                    <button className="btn #c62828 red darken-3" onClick={()=>{
                        localStorage.clear();
                        dispatch({type:"CLEAR"});
                        history.push("/signin");
                    }}>
                        Sign out
                    </button>
                </li>
            ]
        }else{
            return [
                <li key="i1"><Link to="/signin">Signin</Link></li>,
                <li key="i2"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>
        </nav>
    )
}

export default Navbar
