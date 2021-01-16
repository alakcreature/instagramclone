import React, { useEffect, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css';

function Signup() {
    let history = useHistory();
    let [name,setname] = useState("");
    let [email,setemail] = useState("");
    let [password,setpassword] = useState("");
    let [image,setimage] = useState("");
    let [url,seturl] = useState(undefined);

    const uploadpic = ()=>{
        let data = new FormData();
        data.append("file", image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","alakcreature");
        axios.post("https://api.cloudinary.com/v1_1/alakcreature/image/upload",data)
        .then((result)=>{
            console.log(result);
            seturl(result.data.url);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const uploadfields = ()=>{
        // eslint-disable-next-line
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"invalid email", classes:"#c62828 red darken-3"});
            return;
        }
        axios.post("/signup",{
            name,
            email,
            password,
            pic:url
        })
        .then((result)=>{
            console.log(result);
            if(result.data.error){
                M.toast({html:result.data.error,classes:"#c62828 red darken-3"});
            }else{
                M.toast({html:result.data.message,classes:"#43a047 green darken-1"})
                history.push("/signin");
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    const handlesignup = ()=>{
        if(image){
            uploadpic();
        }else{
            uploadfields();
        }
    }

    useEffect(()=>{
        if(url){
            uploadfields();
        }
        // eslint-disable-next-line
    },[url]);

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value={email}
                    onChange={(e)=>setemail(e.target.value)}
                />
                <input type="text" placeholder="name" value={name}
                    onChange={(e)=>setname(e.target.value)}
                />
                <input type="password" placeholder="password" value={password}
                    onChange={(e)=>setpassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light blue darken-1 #64b5f6">
                        <span>Upload Pic</span>
                        <input type="file" 
                            onChange={(e)=>setimage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light darken-1" onClick={handlesignup}>
                    Signup
                </button>
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup
