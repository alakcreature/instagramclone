import React, { useContext, useEffect, useState } from 'react';
import http from '../../services/http';
import apis from '../../services/apis';
import { UserContext } from '../../App';
import { useParams } from 'react-router';

function UserProfile() {
    let [userprofile,setprofile] = useState();
    // eslint-disable-next-line
    let {state,dispatch} = useContext(UserContext);
    let {userid} = useParams();
    console.log(state);
    let [showfollow,setshowfollow] = useState(state?!state.following.includes(userid):true);
    // console.log(state)

    useEffect(()=>{
        http.get(`${apis.OTHERUSERPROFILE}/${userid}`,{
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`
            }
        }).then((result)=>{
            console.log(result);
            setprofile(result.data);
        }).catch((err)=>{
            console.log(err);
        })
        // eslint-disable-next-line
    },[]);

    const followuser = ()=>{
        http.put(apis.FOLLOWUSER,{
            followid:userid
        },{
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`
            }
        }).then((result)=>{
            console.log(result);
            dispatch({type:"UPDATE",payload:{following:result.data.following,followers:result.data.followers}});
            localStorage.setItem("user",JSON.stringify(result.data));
            setprofile((prevstate)=>{
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:[...prevstate.user.followers,result.data._id]
                    }
                }
            });
            setshowfollow(false);
        }).catch((err)=>{
            console.log(err);
        })
    }

    const unfollowuser = ()=>{
        http.put(apis.UNFOLLOWUSER,{
            unfollowid:userid
        },{
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`
            }
        }).then((result)=>{
            console.log(result);
            dispatch({type:"UPDATE",payload:{following:result.data.following,followers:result.data.followers}});
            localStorage.setItem("user",JSON.stringify(result.data));
            setprofile((prevstate)=>{
                const newFollower = prevstate.user.followers.filter((item)=>item!==result.data._id)
                return {
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:newFollower
                    }
                }
            })
            setshowfollow(true);
        }).catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{console.log(userprofile)},[userprofile]);
    return (
        <>
        {userprofile? 
        <div style={{maxWidth:"750px", margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                    }}>
                <div>
                    <img style={{width: "160px", height:"160px",borderRadius:"80px"}}
                    src={userprofile.user.pic}
                    alt=""/>
                </div>
                <div>
                    <h4>{userprofile.user.name}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userprofile.posts.length} posts</h6>
                        <h6>{userprofile.user.followers.length} followers</h6>
                        <h6>{userprofile.user.following.length} following</h6>
                    </div>
                    {showfollow
                    ?
                    <button className="btn waves-effect waves darken-1"
                        style={{
                            margin:"10px"
                        }}
                        onClick={followuser}>
                        Follow
                    </button>
                    :
                    <button className="btn waves-effect waves darken-1" 
                        style={{
                            marginTop:"10px"
                        }}
                        onClick={unfollowuser}>
                        Unfollow
                    </button>
                    }
                </div>
            </div>
            
            <div className="gallery">
                {userprofile.posts.map((pic,i)=>{
                    return (
                        <img key={i} className="item"
                            src={pic.photo} 
                            alt={pic.title}
                        />
                    )
                })}
            </div>
        </div>
        : <h2>loading...</h2>}
        </>
    )
}

export default UserProfile
