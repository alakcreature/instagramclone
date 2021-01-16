import React, { useEffect, useState } from 'react';
import axios from "axios";
import M from 'materialize-css';
import { useHistory } from 'react-router';

function CreatePost() {
    let history = useHistory();
    let [title,settitle] = useState("");
    let [body,setbody] = useState("");
    let [image,setimage] = useState("");
    let [url,seturl] = useState("");

    const postDetails = ()=>{
        let data = new FormData();
        // console.log(data);
        // data.append("key1","value1");
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

    useEffect(()=>{
        console.log(url);
        if(url){
            const token = localStorage.getItem("jwt");
            axios.post("/createpost",{
                title,
                body,
                pic:url
            },
            {
                headers:{
                    "authorization":`Bearer ${token}`
                }
            }
            )
            .then((res)=>{
                console.log(res);
                if(res.data.error){
                    M.toast({html: res.data.error, classes:"#c62828 red darken-3"});
                    history.push("/signin");
                }else{
                    M.toast({html:"successfully posted  ",classes:"#43a047 green darken-1"});
                }
            })
            .catch((err)=>{
                M.toast({html:"invalid email", classes:"#c62828 red darken-3"});
                console.log(err);
            });
        }
    },[url]);

    return (
        <div className="card input-field"
            style={{
                margin: "30px auto",
                maxWidth:"500px",
                padding:"20px",
                textAlign:"center"
            }}
        >
            <input type="text" placeholder="title"
                onChange={(e)=>settitle(e.target.value)}
            />
            <input type="text" placeholder="body"
                onChange={(e)=>setbody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light blue darken-1 #64b5f6">
                    <span>Upload Image</span>
                    <input type="file" 
                        onChange={(e)=>setimage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light blue darken-1 #64b5f6" onClick={postDetails}>
                Submit
            </button>
        </div>
    )
}

export default CreatePost
