import mongoose, { Schema, Document } from 'mongoose';

export type RoleType = 'ADMINISTRATIVE' | 'MANAGER' | 'SCIENTIFIC' | 'OTHER';
export type DesignationType = "ASSISTANT MANAGER" | "ADMIN AND HR STAFF" | "OFFICE ASSISTANT" | "SENIOR AGRONOMIST" | "AGRONOMIST" | "SENIOR TECHNICIAN" | "TECHNICIAN" | "SUPERVISOR" | "LABOUR"
export type GenderType = "Male" | "Female";

export interface IStaff extends Document {
    code: string;
    firstName: string;
    lastName: string;
    joinedDate: string;
    designation: DesignationType;
    gender: GenderType;
    dob: string;
    addressLine01: string;
    addressLine02: string;
    addressLine03: string;
    addressLine04: string;
    addressLine05: string;
    mobile: string;
    email: string;
    role: RoleType;
    assignVehicles?: mongoose.Types.ObjectId[];
    assignLogs?:mongoose.Types.ObjectId[];
}

const staffSchema = new Schema<IStaff>({
    code: { type: String, required: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    joinedDate: { type: String, required: true },
    designation: { type: String, required: true, enum: ["ASSISTANT MANAGER","ADMIN AND HR STAFF","OFFICE ASSISTANT","SENIOR AGRONOMIST","AGRONOMIST","AGRONOMIST","SENIOR TECHNICIAN","TECHNICIAN","SUPERVISOR","LABOUR"]},
    gender: { type: String, required: true, enum: ["Male","Female"]},
    dob: { type: String, required: true },
    addressLine01: { type: String, required: true },
    addressLine02: { type: String, required: false },
    addressLine03: { type: String, required: false },
    addressLine04: { type: String, required: false },
    addressLine05: { type: String, required: false },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    role: { type: String, required: true, enum: ['ADMINISTRATIVE', 'MANAGER', 'SCIENTIFIC','OTHER']},
    assignVehicles: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }
    ],
    assignLogs: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Log'}
    ]
});

const Staff = mongoose.model<IStaff>('Staff', staffSchema);
export default Staff;
