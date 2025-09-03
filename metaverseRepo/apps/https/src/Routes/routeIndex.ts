import express  from "express";


export const userRouter = express.Router();

userRouter.post('/signup', async(req, res)=>{
    const {username, password} = req.body;

})

userRouter.post('/signin', async(req, res)=>{
    const {username, password} = req.body
})


