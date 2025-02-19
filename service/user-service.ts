import {UserModel} from "../models/user-model";
import {saveUser, verifyUserCredentials} from "../repository/user-repository";

export async function saveUserService(user: UserModel) {
    try {
        const users = new UserModel(user.username, user.email, user.password);
        return await saveUser(users);
    } catch (e) {
        throw e;
    }
}

export async function verifyUserCredentialsService(username: string, password: string) {
    try {
        if (!username && !password) {
            console.error(`Please required username: ${username} and password: ${password}`);
        }
        return verifyUserCredentials(username, password);
    } catch (e) {
        throw e;
    }
}