import { z } from 'zod';

export const signupSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["User", "Admin"])
})

export const signinSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const updateMetadataSchema = z.object({
    avatarId: z.string()
})

export const createSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId : z.string().optional()
})

export const addElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const createElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    staticElement: z.boolean()
})

export const updateElementSchema = z.object({
    imageUrl : z.string()
})

export const createAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string()
})

export const createMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
        
    }))
})