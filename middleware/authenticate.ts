import jwt, {Secret} from 'jsonwebtoken';
import express from "express";

export function authenticateToken(req : express.Request, res : express.Response, next : express.NextFunction){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if(!token)res.status(401).send('No token provided');

    try{
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as {username: string, iat: number};
        req.body.username = payload.username;
        next();
    }catch(err){
        res.status(401).send(err);
    }
}
