import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
    code: string;
    name: string;
    logDate: string;
    logDetails: string;
    image: string | null;
    assignFields?: mongoose.Types.ObjectId[];
    assignStaff?: mongoose.Types.ObjectId[];
    assignCrops?: mongoose.Types.ObjectId[];
}

const log = new Schema<ILog>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logDate: { type: String, required: true },
    logDetails: { type: String, required: true },
    image: { type: String, required: true },
    assignStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    assignFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
    assignCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop"}]
});

const Log = mongoose.model<any>("Log", log);
export default Log;
