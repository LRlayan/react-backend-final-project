import dotenv from "dotenv";
import express from "express";
import {saveUser, verifyUserCredentials} from "../repository/user-repository"
import User from "../schema/user";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Register", req.body);
    const username = req.body.username;
    const password = req.body.password;

    const user: User = {username, password};

    try {
        const registration = await saveUser(user);
        res.status(201).send(registration);
    }
});

router.post("/login", async (req,res) => {
    console.log("Login");
    const username = req.body.username;
    const password = req.body.password;

    const user: User = {username, password};

    try {
        const isVerified = verifyUserCredentials(user);

        if (isVerified) {
            const token = jwt.sign({ username }, process.env.SECRET_KEY as Sceret, {expiresIn: "1m"});
            const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN as Secret, {expireIn: "7d"});
            res.json({accessToken: token, refreshToken: refreshToken});
        } else {
            res.sendStatus(403).send('Invalid credentials');
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.post("/refresh-token", async (req,res) => {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader?.split(' ')[1];

    if (!refresh_token)res.status(401).send('No token provided');

    try {
        const payload = jwt.verify(refresh_token as string, process.env.REFRESH_TOKEN as Secret) as { username: string, iat: number};
        const token = jwt.sign({ username: payload.username }, process.env.SECRET_KEY as Secret, {expireIn: "1m"});
        res.json({accessToken: token});
    } catch (e) {
        console.log(err);
        res.status(401).json(err);
    }
});

export function authenticationToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    console.log(token);
    if (!token)res.status(401).send('No Token provided');

    try {
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as {username: string, iat: number};
        console.log("payload username : " ,payload.username);
        req.body.username = payload.username;
        next();
    } catch (e) {
        res.status(401).send(e);
    }
}