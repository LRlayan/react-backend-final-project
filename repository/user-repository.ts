import User from "../schema/user";
import bcrypt from 'bcrypt';

export async function verifyUserCredentials(user: User) {
    const findUser: User | null = await User.findOne({username: user.username});
    if (!user) {
        return false;
    }
    return await bcrypt.compare(user.password, findUser.password);
}