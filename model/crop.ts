import mongoose, {Schema} from "mongoose";

export interface ICrop {
    code:string;
    name:string;
    scientificName:string;
    category:string;
    season:string;
    image: Buffer | string | null;
    assignFields: mongoose.Types.ObjectId[];
    assignLogs:mongoose.Types.ObjectId[];
}

const cropSchema = new Schema<ICrop>({
    code: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    scientificName: { type: String, required: true},
    category: { type: String, required: true},
    season: { type: String, required: true},
    image: { type: Buffer | String, required: true},
    assignFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field"}],
    assignLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log"}]
});

const Crop = mongoose.model<any>("Crop", cropSchema);
export default Crop;