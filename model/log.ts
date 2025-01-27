import mongoose, {Schema} from "mongoose";

export interface ILog extends Document{
    code:string;
    name: string;
    logDate:string;
    logDetails:string;
    image:File | null;
    // assignCrops: Crop[];
    assignFields?: mongoose.Types.ObjectId[];
    assignStaff?: mongoose.Types.ObjectId[];
}

const logSchema = new Schema<ILog>({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    logDate: {type: String, required: true},
    logDetails: {type: String, required: true},
    image: {type: File, required: true},
    assignStaff: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'},
    ],
    assignFields: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Field'}
    ]
});

const Log = mongoose.model<ILog>('Log', logSchema);
export default Log;