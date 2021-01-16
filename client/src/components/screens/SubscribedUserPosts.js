import React, { useContext, useEffect, useState } from 'react';
import apis from '../../services/apis';
import http from '../../services/http';
import {UserContext} from '../../App';
import { Link } from 'react-router-dom';

function Home() {
    // eslint-disable-next-line
    let {state,dispatch} = useContext(UserContext);
    let [data,setdata] = useState([]);
    
    useEffect(()=>{
        http.get(apis.SUBPOST,{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then((result)=>{
            // console.log(result);
            setdata(result.data.posts);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);

    const likePost = (id)=>{
        http.put(apis.LIKEPOST,{
            postid:id
        },{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((result)=>{
            console.log(result);
            const newData = data.map((item)=>{
                if(String(item._id)===String(result.data._id)){
                    return result.data;
                }else{
                    return item;
                }
            });
            setdata(newData);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const unlikePost = (id)=>{
        http.put(apis.UNLIKEPOST,{
            postid:id
        },{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((result)=>{
            console.log(result);
            const newData = data.map((item)=>{
                if(String(item._id)===String(result.data._id)){
                    return result.data;
                }else{
                    return item;
                }
            });
            // console.log(newData)
            setdata(newData);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const addcomment = (text, postid)=>{
        http.put(apis.ADDCOMMENT,{
            text,
            postid
        },
        {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then((result)=>{
            // console.log(result.data);
            const newData = data.map((item)=>{
                if(String(item._id)===String(result.data._id)){
                    return result.data;
                }
                else{
                    return item;
                }
            });
            setdata(newData);
        }).catch((err)=>{
            console.log(err);
        })
    }

    const deletepost = (postid)=>{
        http.delete(`${apis.DELETEPOST}/${postid}`,{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((result)=>{
            console.log(result.data.data);
            const newData = data.filter(item=>{
                return String(item._id)!==String(result.data.data._id);
            });
            setdata(newData);
        })
        .catch((err)=>{console.log(err);})
    }

    const deletecomment = (postid,postedByid,comment_id)=>{
        http.post(apis.DELETECOMMENT,
        {
            postid,
            postedByid,
            comment_id
        },{
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then((result)=>{
            console.log(result);
            const newData = data.map(item=>{
                // console.log(result.data.data);
                if(String(item._id)===String(result.data.data._id)){
                    // console.log(item);
                    item.comments= item.comments.filter(comment=>{
                        return comment_id.toString()!==comment._id.toString();
                    })
                }
                return item;
            });
            setdata(newData);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{console.log(data)},[data]);

    return (
        <div className="home">
            {data && data.map((item,i)=>{
                return (
                    <div key={i} className="card home-card">
                        <h5 style={{padding:"5px"}}> <Link to={item.postedBy._id!==state._id?`/profile/${item.postedBy._id}`:"/profile"}>{item.postedBy.name}</Link>{item.postedBy._id===state._id && 
                        (<i className="material-icons" style={{
                            float:"right"
                        }}
                        onClick={()=>deletepost(item._id)}
                        >delete</i>)
                        } </h5>
                        <div className="card-image">
                            <img src={item.photo} alt=""/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes((state._id))
                            ?
                            <i className="material-icons"
                                onClick={()=>{unlikePost(item._id)}}
                            >thumb_down</i>
                            :
                            <i className="material-icons"
                                onClick={()=>{likePost(item._id)}}
                            >thumb_up</i>
                            }
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {item.comments.map((record,i)=>(
                                <h6 key={i}><strong>{record.postedBy.name}</strong> 
                                    {record.text}
                                    {record.postedBy._id===state._id && (
                                        <i className="material-icons" style={{float:"right"}}
                                        onClick={()=>deletecomment(item._id,state._id,record._id)}
                                        >delete</i>
                                    )}
                                </h6>
                                
                            ))}
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                addcomment(e.target[0].value,item._id);
                            }}>
                                <input type="text" placeholder="add a comment"/>
                            </form>
                        </div>
                    </div>
                )
            })}

         </div>
    )
}

export default Home
