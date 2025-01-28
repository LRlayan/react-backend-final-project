import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
    code: string;
    name: string;
    logDate: string;
    logDetails: string;
    image: Buffer | string | null;
    assignFields?: mongoose.Types.ObjectId[];
    assignStaff?: mongoose.Types.ObjectId[];
}

const logSchema = new Schema<ILog>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logDate: { type: String, required: true },
    logDetails: { type: String, required: true },
    image: { type: Buffer, required: true }, // Adjusted type
    assignStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    assignFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
});

const Log = mongoose.model<any>("Log", logSchema);
export default Log;
