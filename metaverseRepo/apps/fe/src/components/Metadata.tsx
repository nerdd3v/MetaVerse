import axios from 'axios';
import React, { use, useState } from 'react'
import { useNavigate } from 'react-router-dom';


function Metadata() {
    const [avatar, setAvatar]= useState('')
    const navigate = useNavigate();

    async function checkAvatarId(){
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/metadata',{
                avatarId: avatar
            },{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.status === 200){
                navigate('/main')
            }
        } catch (error) {
            
        }
    }

  return (
    <div>
      <input type="text" onChange={(e)=>setAvatar(e.target.value)} />
      <button onClick={checkAvatarId}>submit</button>
    </div>
  )
}

export default Metadata
