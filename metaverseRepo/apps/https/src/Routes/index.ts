import { Router } from "express";
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import { adminRouter } from "./admin.js";
import { z} from 'zod'
import { signinSchema, signupSchema } from "../types/index.js";
import { client } from "@repo/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const generateToken = (userId: String, role: String) =>{
    const token = jwt.sign({userId, role}, "cottonCandy");
    return token;
}

export const v1 = Router();
v1.use('/user', userRouter);
v1.use('/space', spaceRouter);
v1.use('/admin', adminRouter);


v1.post('/signup', async(req, res)=>{
    const {username, password, role} = req.body;
    
    if(!username || !password){
        return res.status(400).json({message:"user credentials not provided"})
    }

    const validate = signupSchema.safeParse({username, password, role});

    if(!validate.success){
        return res.status(400).json({message:'Incorrect credential format'})
    }

    try {
        const response = await client.user.create({
            data:{
                username,
                password: await bcrypt.hash(validate.data.password, 10),
                role: validate.data.role === "Admin"? "Admin": "User" ,
            }
        })
        
        return res.status(200).json({userId: response.id ,message: "success"})

    } catch (error) {
        return res.status(400).json({message: "user already exists"})
    }

})

v1.post('/signin', async(req, res)=>{
    const role = req.body.role;
    const validate = signinSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({message:"Credential format invalid"});
    }

    try {

        const user = await client.user.findFirst({
            where:{
                username: validate.data.username
            }
        })

        if(!user){
            return res.status(403).json({message:"user does not exist"})
        }

        const isValid = await bcrypt.compare(validate.data.password, user.password)

        if(!isValid){
            return res.status(403).json({message: "Incorrect Password"})
        }



        const userId = user.id;

        const token = generateToken(userId, role);

        return res.status(200).json({token, message: "sign in successful"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
})

v1.get('/avatars',async(req, res)=>{
    try {
        const avatars = await client.avatar.findMany({
            select:{
                id:true,
                name: true,
                imageUrl:true
            }
        });

        res.set('Cache-Control', 'public, max-age=86400, immutable')

        return res.status(200).json({avatars})    
    } catch (error) {
       console.log(error);
       return res.status(500).json({message: "internal server error"}) 
    }
})

v1.get('/element',(req, res)=>{
    //I will check the db and check for all the availbale elements
}) 