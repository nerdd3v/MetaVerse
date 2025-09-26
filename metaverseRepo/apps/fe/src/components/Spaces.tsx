import React from 'react'
import MySpces from './MySpces'
import axios from 'axios';
function Spaces() {
  const enterWithCodeHandler= async()=>{
    //maybe give the user a window to add (input) the space id
  }

  const createSpace = ()=>{
    const token = localStorage.getItem('token');
    try {
      const response = axios.post('poop')
      
    } catch (error) {
      
    }
  }
    return (
    <div>
        <nav style={{height:'300px', width: "500px", display: 'flex ', gap:"20px"}}>
            <h1>Spaces</h1>
            <button onClick={enterWithCodeHandler}>Enter with code</button>
            <button onClick={createSpace}>create spaces</button>



        </nav>
        <MySpces/>
    </div>
  )
}

export default Spaces
