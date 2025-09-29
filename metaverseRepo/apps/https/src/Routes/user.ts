import { Router } from "express";
import { updateMetadataSchema } from "../types/index.js";
import { client } from "@repo/db/client";
import { authMW } from "../MiddleWares/authMW.js";


export const userRouter = Router();

userRouter.post('/metadata', authMW,async(req, res)=>{
    const {avatarId} = req.body;
    const parsedData = updateMetadataSchema.safeParse({avatarId});

    if(!parsedData.success){
        return res.status(400).json({message:"Invalid avatar id "});
    }

    const isPresent = await client.avatar.findFirst({
        where:{
            id: parsedData.data.avatarId
        }
    })
    if(!isPresent){
        return res.status(400).json({message:'invalid avatar id'});
    }


    try {
        const response = await client.user.update({
            where:{
                //@ts-ignore
                id: req.user
            },data:{
                avatarId: parsedData.data.avatarId
            }
        })
        return res.status(200).json({message:"avatar updated successfully"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"something went wrong"})   
    }
})

// api/v1/user/metadata/bulk?id
userRouter.get('/metadata/bulk', async(req, res)=>{
    const userId = req.query.id;
    if(!userId){
        return res.status(400).json({message:"unspecified user id"});
    }
    const isValid = await client.user.findFirst({
        where:{
            //@ts-ignore
            id: userId
        },
        select:{
            username: true,
            avatarId: true,
            role: true
        }
    })
    if(!isValid){
        return res.status(400).json({message: "invalid user Id"});
    }
    try {
        return res.status(200).json({isValid});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "some internal error"})
    }
})