import User from "../schema/user";
import bcrypt from 'bcrypt';

interface User {
    username: string;
    email: string;
    password: string;
}

export async function saveUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    try {
        user.password = hashedPassword;
        const newUser = new User(user);
        const result = await newUser.save();
        if (result) {
            return result;
        } else {
            return { message: "Failed to save user. Please try again."}
            throw new Error("Failed to save user. Please try again.");
        }
    } catch (e) {
        console.error("Failed to save user:", e);
        throw e;
    }
}

export async function verifyUserCredentials(user: User) {
    const findUser: User | null = await User.findOne({username: user.username});
    if (!user) {
        return false;
    }
    return await bcrypt.compare(user.password, findUser.password);
}