import mongoose, { Schema, Document } from "mongoose";

export interface IField extends Document {
    code: string;
    name: string;
    location: string;
    extentSize: string;
    image: string | null;
    assignLogs: mongoose.Types.ObjectId[];
    assignStaffMembers: mongoose.Types.ObjectId[];
    assignCrops: mongoose.Types.ObjectId[];
    assignEquipments: mongoose.Types.ObjectId[];
}

const field = new Schema<IField>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    extentSize: { type: String, required: true },
    image: { type: String, required: true },
    assignLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
    assignStaffMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    assignCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop"}],
    assignEquipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}]
});

const Field = mongoose.model<any>("Field", field);
export default Field;
