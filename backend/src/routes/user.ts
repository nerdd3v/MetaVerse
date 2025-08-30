import express from 'express';


const userRouter =  express.Router();

userRouter.post('/signup', (req, res)=>{
    const {email, password} = req.body;
    

})

module.exports = {
    userRouter
}