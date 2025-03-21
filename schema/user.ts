import mongoose, {Schema} from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
}

const user = new Schema<IUser>({
    username: {type: String, required: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true, unique: true}
});

const User = mongoose.model<IUser>("User", user);
export default User;