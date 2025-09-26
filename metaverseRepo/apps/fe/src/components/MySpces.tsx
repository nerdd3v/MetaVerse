import axios from 'axios';
import  {  useEffect, useState } from 'react'

//fetch the current spaces that the user owns 

function MySpces() {
 
    const [spaces, setSpaces] = useState([]);

    useEffect(()=>{
        async function fetchMySpaces(){
            const token = localStorage.getItem('token');
            if(!token){
                console.log("You do not have the token")
                return;
            }
            const response = await axios.get('http://localhost:3000/api/v1/space/all',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.status === 200){
                setSpaces(response.data.spaces);
            }

        }
        fetchMySpaces()
    },[])

  return (
    <div>
        <h1>saket</h1>
        <div style={{height:'200px', width:'300px'}}>
            {spaces.map((space)=>{
                return(
                    <>
                    <h1>hi</h1>
                        <div key={space.id}>
                            <img src={space.thumbnail} alt="" />
                            <h3>{space.name}</h3>
                        </div>
                    </>
                )
            })}
        </div>
    </div>
  )
}

  

export default MySpces
