import {UserModel} from "../models/user-model";
import {saveUser} from "../repository/user-repository";

export async function saveUserService(user: UserModel) {
    try {
        const users = new UserModel(user.username, user.email, user.password);
        return await saveUser(users);
    } catch (e) {
        throw e;
    }
}