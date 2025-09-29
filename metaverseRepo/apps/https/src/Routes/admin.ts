import { Router } from "express";
import { authMW } from "../MiddleWares/authMW.js";
import { createAvatarSchema, createElementSchema, createMapSchema } from "../types/index.js";
import { client } from "@repo/db/client";
import { number } from "zod";

export const adminRouter = Router();

adminRouter.post('/element', authMW, async(req, res)=>{
    //description of the entire element
    //@ts-ignore
    const role = req.role

    if(role !== "Admin"){
        console.log(role)
        return res.status(403).json({message: "forbidden endpoint"})
    }

    //@ts-ignore
    const userId = req.user;

    const {width, height, imageUrl, staticElement} = req.body;

    const validateFormat = createElementSchema.safeParse({width, height, imageUrl, staticElement});

    if(!validateFormat.success){
        return res.status(400).json({message: "invalid element credential format"})
    }

    try {
        const response = await client.element.create({
            data:{
                width,
                height,
                imageUrl,
                static: staticElement,
                creatorId: userId
            }
        })

        return res.status(200).json({message: "element created successfully", elementId: response.id})

    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "internal server error"})  
    }

})

adminRouter.put('/element/:elementId', authMW, async(req, res)=>{
    const{imageUrl} = req.body;
    const {elementId} = req.params;
    if(!elementId){
        return res.status(400).json({message: "element id not provided"})
    }
     //@ts-ignore
    const role = req.role

    if(role !== "Admin"){
        return res.status(403).json({message: "forbidden endpoint"})
    }

    //@ts-ignore
    const userId = req.user;

    const creatorValidation = await client.element.findFirst({
        where:{
            id: elementId,
            creatorId: userId
        }
    })

    if(!creatorValidation){
        return res.status(400).json({message: "you are not authorized to update this element"})
    }

    try {
        const response = await client.element.update({
            where:{
                id: elementId
            },
            data:{
                imageUrl
            }
        })

        return res.status(200).json({message: "element updated successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal error occured"})
    }
})

adminRouter.post('/avatar', authMW, async(req, res)=>{
    const{imageUrl, name} = req.body;

    //@ts-ignore
    const role = req.role

    if(role !== "Admin"){
        console.log(role)
        return res.status(403).json({message: "forbidden endpoint"})
    }
    //@ts-ignore
    const userId = req.user;

    const parsedData = createAvatarSchema.safeParse({imageUrl, name});

    if(!parsedData.success){
        return res.status(400).json({message:"invalid avatar creation format"});
    }

    const preExistingCheck = await client.avatar.findFirst({
        where:{
            name
        }
    })

    if(preExistingCheck){
        return res.status(400).json({message:"the avatar already exists with same name"})
    }

    try{
        const response = await client.avatar.create({
            data:{
                name,
                imageUrl
            }
        })

        return res.status(200).json({message: "avatar created successfully", avatarId: response.id})
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "internal server error"})
    }
})

adminRouter.post('/map', authMW, async(req, res)=>{
    //@ts-ignore
     const role = req.role

    if(role !== "Admin"){
        return res.status(403).json({message: "forbidden endpoint"})
    }
    //@ts-ignore
    const userId = req.user;

    const {thumbnail, dimensions, name, defaultElements} = req.body;
    const parsedData = createMapSchema.safeParse({thumbnail, dimensions, name, defaultElements});

    if(!parsedData.success){
        return res.status(400).json({message: "invalid map creation credential format"});
    }

    const dim = parsedData.data.dimensions;
    const width = Number( dim.split('x')[0]);
    const height = Number( dim.split('x')[1]);

    try {
        const map = await client.map.create({
            data:{
                width,
                height,
                name: parsedData.data.name,
                elements: {
                    create: parsedData.data.defaultElements.map(e=> ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            },
            include: {elements: true}
        })
        return res.status(200).json({message: 'map created successfully', mapId: map.id})
    } catch (error) {
      console.log(error);
      return res.status(500).json({message:"some internal error occured"})  
    }
})