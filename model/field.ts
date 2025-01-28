import mongoose, { Schema, Document } from "mongoose";

export interface IField extends Document {
    code: string;
    name: string;
    location: string;
    extentSize: string;
    image: Buffer;
    assignLogs?: mongoose.Types.ObjectId[];
    assignStaffMembers?: mongoose.Types.ObjectId[];
    assignCrops?: mongoose.Types.ObjectId[];
}

const fieldSchema = new Schema<IField>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    extentSize: { type: String, required: true },
    image: { type: Buffer, required: true },
    assignLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
    assignStaffMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    assignCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop"}]
});

const Field = mongoose.model<any>("Field", fieldSchema);
export default Field;
