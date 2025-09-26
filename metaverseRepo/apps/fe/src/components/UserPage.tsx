import React from 'react'
import Spaces from './Spaces'
function UserPage() {

    if(localStorage.getItem('role') == 'Admin'){
        return(
            <>
                <h1>{localStorage.getItem('username')}</h1>
            </>
        )
    }

  return (
    <div>
      <h1>{localStorage.getItem('username')}</h1>
      <img height={100} src={localStorage.getItem('avatarUrl')} alt="" />



        <Spaces />


    </div>
  )
}

export default UserPage
