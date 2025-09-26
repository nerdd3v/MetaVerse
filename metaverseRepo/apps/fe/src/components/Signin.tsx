import axios from 'axios';
import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[role, setRole] = useState('');
    const [message, setMessasge ] = useState('');

    const navigate = useNavigate();

    const submitHandler = async()=>{
        try {
            const response = await axios.post('http://localhost:3000/api/v1/signin', {
                username,
                password,
                role
            })

            if(response.status === 200){
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('role', role)
                setMessasge('Signin Success')
            }

            navigate('/metadata');

        } catch (error) {
            console.log('errror');
        }
    }

  return (
    <div>
      <input type="text" placeholder='username' onChange={(e)=>{setUsername(e.target.value)}} /><br />

      <input type="text" placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/><br />
    <br />
    <input onChange={(e)=>{setRole(e.target.value)}} type="text" placeholder='User/Admin' />
      <button onClick={submitHandler}>submit</button>

      <p>{message}</p>
    </div>
  )
}

export default Signin
