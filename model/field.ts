import {Crop} from "./crop";
import Log from "../model/log";
import Staff from "../model/staff";
import {Equipment} from "./equipment";
import mongoose, {Schema} from "mongoose";

export interface IField {
    code:string;
    name:string;
    location:string;
    extentSize:string;
    image:File | null;
    // assignCrops: Crop[];
    assignLogs?: mongoose.Types.ObjectId[];
    assignStaffMembers?: mongoose.Types.ObjectId[];
    // assignEquipments: Equipment[];
}

const fieldSchema = new Schema<IField>({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    location: {type: String, required: true},
    extentSize: {type: String, required: true},
    image: {type: File, required: true},
    assignLogs: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Log'}
    ],
    assignStaffMembers: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'}
    ]
});