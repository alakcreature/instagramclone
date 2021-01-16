import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import http from '../../services/http';
import apis from '../../services/apis';
import { UserContext } from '../../App';

function Profile() {
    let [mypics,setpics] = useState([]);
    let {state,dispatch} = useContext(UserContext);
    let [image,setimage] = useState("");

    useEffect(()=>{
        if(image){
            let data = new FormData();
            data.append("file", image);
            data.append("upload_preset","insta-clone");
            data.append("cloud_name","alakcreature");
            axios.post("https://api.cloudinary.com/v1_1/alakcreature/image/upload",data)
            .then((result)=>{
                // console.log(result);
                // localStorage.setItem("user",JSON.stringify({...state,pic:result.data.url}));
                // dispatch({type:"UPDATEPIC",payload:result.data.url});
                http.put(apis.UPDATEPIC,{
                    pic:result.data.url
                },{
                    headers:{
                        "Authorization":`Bearer ${localStorage.getItem("jwt")}`
                    }
                }).then((result2)=>{
                    console.log(result2);
                    localStorage.setItem("user",JSON.stringify({...state,pic:result2.data.pic}));
                    dispatch({type:"UPDATEPIC",payload:result2.data.pic});
                }).catch((err)=>{
                    console.log(err);
                })
                // window.location.reload();
            })
            .catch((err)=>{
                console.log(err);
            });
        }
        // eslint-disable-next-line
    },[image]);

    const updatephoto = (file)=>{
        setimage(file);
    }

    useEffect(()=>{
        http.get(apis.MYPOST,{
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`
            }
        }).then((result)=>{
            console.log(result);
            setpics(result.data.post);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);
    return (
        <div style={{maxWidth:"750px", margin:"0px auto"}}>
            
            <div style={{
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                    }}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around"
                    }}>
                    <div>
                        <img style={{width: "160px", height:"160px",borderRadius:"80px"}}
                        src={state && state.pic}
                        alt=""/>
                    </div>
                    
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state?state.followers.length:"0"} followers</h6>
                            <h6>{state?state.following.length:"0"} following</h6>
                        </div>
                    </div>
                </div>
                
                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn waves-effect waves-light blue darken-1 #64b5f6">
                        <span>Update Pic</span>
                        <input type="file" 
                            onChange={(e)=>updatephoto(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {mypics && mypics.map((pic,i)=>{
                    return (
                        <img key={i} className="item"
                            src={pic.photo} 
                            alt={pic.title}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Profile
