import axios from 'axios';
import  { useEffect, useState } from 'react'

function SetAvatars() {
  
    const [avatars, setAvatars] = useState([]);

useEffect(()=>{

    async function fetchavatrs (){
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:3000/api/v1/avatars',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.avatars)
            if(response.status === 200){
                setAvatars(response.data.avatars)
            }    
        } catch (error) {
            
        }
    }
    fetchavatrs()   
},[])

    return (
    <div>
        {avatars.map((a)=>{
            return(
                <div key={a.id}>
                    <img src={a.imageUrl} alt="" />
                    <h3>name</h3>
                </div>
            )
        })}
    </div>
  )
}

export default SetAvatars
