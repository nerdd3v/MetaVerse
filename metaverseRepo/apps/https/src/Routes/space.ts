import { Router } from "express";
import { addElementSchema, createSpaceSchema } from "../types/index.js";
import { parse, string } from "zod";
import { authMW } from "../MiddleWares/authMW.js";
import { client } from "@repo/db";
import { use } from "react";

export const spaceRouter = Router();

spaceRouter.post('/',authMW,async(req, res)=>{ //for creation of a space by the user
    //@ts-ignore
    const userId = req.user as string;
    const parsedData = createSpaceSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({message: "incorrect credential format"});
    }

    if(!parsedData.data.mapId){
        const response = await client.space.create({
            data:{
                name: parsedData.data.name,
                width: Number(parsedData.data.dimensions.split('x')[0]), 
                height: Number(parsedData.data.dimensions.split('x')[1]),
                // @ts-ignore
                creatorId: userId,
                thumbnail: "https://imgs.search.brave.com/5amoSfG5qa_3oZILEiiK2loF-R0vaBUiMhkDXJ_wkjQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzk2LzExLzQx/LzM2MF9GXzE5NjEx/NDE5Ml9NZGZqZ3hj/ZXpTbFVxM3NvemYz/aVlWV2ZjdHJOVVFv/Zy5qcGc"
            }
        })
        return res.status(200).json({message: "space created successfully", spaceId: response.id, thumbnail: response.thumbnail })
    }

    else{
        const checkMapValidity = await client.map.findFirst({
            where:{
                id: parsedData.data.mapId
            },
            select:{
                width: true,
                height: true,
                name: true,
                elements: true
            }
        })

        if(!checkMapValidity){
            return res.status(400).json({message: 'Map Id is not not valid'})
        }
        else{
            const response = await client.space.create({
                //@ts-ignore
                data:{
                    name: checkMapValidity.name,
                    width: checkMapValidity.width,
                    height: checkMapValidity.height,
                    creatorId: userId,
                    element:{
                        //@ts-ignore
                        create: checkMapValidity.elements.map(m=>({
                            elementId: m.elementId,
                            x: m.x,
                            y: m.y
                        }))
                    }
                }

            })
            return res.status(200).json({message: "space created successfully from map", spaceId: response.id});
        }
    }
    
});

spaceRouter.delete('/:spaceId',authMW,async(req, res)=>{
    //@ts-ignore
    const userId = req.user;
    const {spaceId} =req.params;

    const allSpaces = await client.user.findFirst({
        where: {
            id: userId
        },
        select:{
            spaces: true
        }
    })

    if(!allSpaces){
        return res.status(400).json({message: 'user does not own any space'});
    }


    const spaces = allSpaces.spaces;
    //@ts-ignore
    const filteredSpace = spaces.find(x=> x.id === spaceId);

    if(!filteredSpace){
        return res.status(400).json({message: 'user does not own this space'});
    }

    try {
        const response = await client.space.delete({
            where:{
                //@ts-ignore
                id: filteredSpace.id
            }
        })
        return res.status(200).json({message:"space deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "internal error occured"});
    }
})

spaceRouter.get('/all', authMW,async(req, res)=>{
    //@ts-ignore
    const userId = req.user;

    try{
        const spaces = await client.space.findMany({
            where:{
                creatorId: userId
            },
            select: {
                id: true,
                name: true,
                width: true,
                height: true,
                thumbnail: true, // include this!
            }
        })
        
        return res.status(200).json({spaces})
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "something went wrong"});
    }
    //returns all my spaces that I have with me as their owner in the database
})

spaceRouter.get('/:spaceId', authMW,async(req, res)=>{
    // I will be sending my credentials 
    //@ts-ignore
    const userId = req.user
    const {spaceId} = req.params;

    if(!spaceId){
        return res.status(400).json({message: "spaceId not provided"})
    }

    const isValid = await client.space.findFirst({
        where:{
            id: spaceId,
            creatorId: userId
        }
    })

    if(!isValid){
        return res.status(400).json({message:"space id is not valid or you are not authorized to enter this space"})
    }

    return res.status(200).json({isValid})

    // my credentials will be authenticated
    // I will check the spaces db and find the one with the space Id

})

spaceRouter.post('/element',authMW, async(req, res)=>{
    //I will ask to add an element with a paritcular id
    const {elementId, spaceId, x, y} = req.body;
    //@ts-ignore
    const userId = req.user;
    const parsedData = addElementSchema.safeParse({elementId, spaceId, x, y});

    if(!parsedData.success){
        return res.status(400).json({message: "invalid credential format"});
    }

    const userOwnSpaces = await client.user.findFirst({
        where:{
            id: userId
        },
        select:{
            spaces:true
        }
    })

    if(!userOwnSpaces){
        return res.status(400).json({message: "user does not own any space currently"})
    }    
    //@ts-ignore
    const spaceOwned = userOwnSpaces.spaces.find(x => x.id === spaceId);

    if(!spaceOwned){
        return res.status(400).json({message: "user does not own this space"});
    }

    try {

        const checkPositionAvailable = await client.spaceElements.findFirst({
            where:{
                spaceId,
                x,
                y
            }
        })

        if(checkPositionAvailable){
            return res.status(400).json({message: "position already equipped"})
        }

        const response = await client.spaceElements.create({
            data:{
                elementId,
                spaceId,
                x,
                y
            }
        })

        return res.status(200).json({message: "element added successfully"});
    } catch (error) {
        return res.status(500).json({message: "internal server error"})
    }
})

//update element position endpoint

spaceRouter.delete('/element',authMW,async(req, res)=>{
    //I will ask to delete an element with a paritcular id
    const {id, spaceid} = req.body;
    //@ts-ignore
    const userId = req.user;

    const userAvailableData = await client.user.findFirst({
        where:{
            id: userId
        },
        select:{
            spaces:true
        }
    })

    if(!userAvailableData){
        return res.status(400).json({message: "user does not own any spaces"});
    }

    const allUserSpaces = userAvailableData.spaces;
    //@ts-ignore
    const userAuthorityOnSpace = allUserSpaces.find(x=> x.id === spaceid);

    if(!userAuthorityOnSpace){
        return res.status(400).json({message: "user has no authority on this space"})
    }

    try {
        const response = await client.spaceElements.delete({
            where:{
                id
            }
        })
        return res.status(200).json({message: "deleted successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "internal server error"})
    }

})

