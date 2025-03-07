import mongoose, {Schema} from "mongoose";

export type SeasonType = "Yala Season" | "Maha Season";

export interface ICrop {
    code:string;
    name:string;
    scientificName:string;
    category:string;
    season:SeasonType;
    image: string | null;
    assignFields: mongoose.Types.ObjectId[];
    assignLogs:mongoose.Types.ObjectId[];
}

const crop = new Schema<ICrop>({
    code: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    scientificName: { type: String, required: true},
    category: { type: String, required: true},
    season: { type: String, required: true, enum: ["Yala Season", "Maha Season"]},
    image: { type: String, required: true},
    assignFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field"}],
    assignLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log"}]
});

const Crop = mongoose.model<any>("Crop", crop);
export default Crop;