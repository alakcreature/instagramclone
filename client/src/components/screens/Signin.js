import React,{useState,useContext} from 'react';
import {Link, useHistory,} from 'react-router-dom'
import M from 'materialize-css';
import axios from 'axios';
import {UserContext} from '../../App';

function Signin() {
    const {state,dispatch} = useContext(UserContext);
    let history = useHistory();
    let [email,setemail] = useState("");
    let [password,setpassword] = useState("");

    const handlesignin = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"invalid email", classes:"#c62828 red darken-3"});
            return;
        }
        axios.post("/signin",{
            email,
            password
        })
        .then((result)=>{
            console.log(result);
            if(result.data.error){
                M.toast({html:result.data.error,classes:"#c62828 red darken-3"});
            }else{
                localStorage.setItem("jwt",result.data.token);
                localStorage.setItem("user",JSON.stringify(result.data.user));
                dispatch({type:"USER",payload:result.data.user});
                M.toast({html:"successfully logged in",classes:"#43a047 green darken-1"})
                history.push("/");
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value={email} 
                    onChange={(e)=>setemail(e.target.value)}
                />
                <input type="password" placeholder="password"
                    onChange={(e)=>setpassword(e.target.value)}
                />
                <button className="btn waves-effect waves darken-1" onClick={handlesignin}>
                    Signin
                </button>
                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signin
