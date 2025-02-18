import dotenv from "dotenv";
import express from "express";

dotenv.config();
const router = express.Router();

router.post("/login", async (req,res) => {
    console.log("Login");
    const username = req.body.username;
    const password = req.body.password;

    const user: User = {username, password};

    try {
        const isVerified = verifyUserCredential(user);

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