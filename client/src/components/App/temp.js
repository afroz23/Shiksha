import React,{useState} from "react";
import { useHistory } from "react-router";

const Createpost = () => {
    const history=useHistory();
    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");

    const postDetails=(e)=>{
        e.preventDefault();
        const data=new FormData;
        data.append("file",image);
        data.append("upload_preset","Instagram-Clone");
        data.append("cloud_name","karthiksharma7");

        fetch("https://api.cloudinary.com/v1_1/karthiksharma7/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
               setUrl(data.url);
               console.log(url);
        })
        .catch(err=>console.log(err));
        console.log(url);
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                photo:url
            })
        
         })
         .then(res=>res.json())
         .then((data)=>{
            //  if(data.Error)
            //  {
            //     M.toast({html:data.Error,classes:"#f44336 red"});
            //  }
            //  else
            //  {
            //     M.toast({html:data.Message,classes:"#00e676 green accent-3"});
            //     history.push("/");
            //  }
         })
         .catch(err=>{console.log(err)});
        
    }
    return (
        <>
            <div className="card input-field" style={{
                marginLeft:"auto",
                marginRight:"auto",
                marginTop:"30px",
                maxWidth:"500px",
                padding:"20px",
                textAlign:"center"
            }}>
                <h5 style={{textAlign:"center"}}>Add post</h5>
                <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)}/>
                <div className="file-field input-field">
                <div className="btn waves-effect waves-light #64b5f6 blue lighten-2">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper" >
                    <input className="file-path validate" type="text" />
                </div>
               </div> 
               <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={postDetails} >Post</button>
            </div>
        </>
    )
}

export default Createpost;