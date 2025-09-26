import axios from 'axios';
import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('')

    const navigate = useNavigate();

    const submitHandler = async()=>{
        try {
            const response = await axios.post('http://localhost:3000/api/v1/signup',{
                username,
                password,
                role
            })

            // if(response.data.token){
            //     localStorage.setItem('token', response.data.token);
            // } 

// MAYBE I WILL BE SAVIUNG THE USER ID ION THE LOCALSTROAGE

            if(response.status === 200){
                localStorage.setItem('userId', response.data.userId);
                
            }


            setMessage('signup success')

            setTimeout(()=>{
                navigate("/signin")
            })

            console.log(message)
            
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
        <h1>username</h1>
      <input type="text" name="" onChange={(e)=>{setUsername(e.target.value)}} placeholder='username' id="" /><br />
      <h1>password</h1>
      <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="" id="" /><br />
        <input type="text" onChange={(e)=>{setRole(e.target.value)}} placeholder='User/Admin' />

        <br />
        <button onClick={submitHandler}>submit</button>

        <p>{message}</p>
    </div>
  )
}

export default Signup
