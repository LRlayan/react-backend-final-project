import mongoose, {Document, Schema} from 'mongoose';

export type StatusType = 'Available' | 'Unavailable'

export interface IVehicle extends Document {
    vehicleCode: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: StatusType;
    remark: string;
    assignStaff?: mongoose.Types.ObjectId;
}

const vehicleSchema = new Schema<IVehicle>({
    vehicleCode: { type: String, required: true, unique: true},
    licensePlateNumber: { type: String, required: true, unique: true},
    vehicleName: { type: String, required: true},
    category: { type: String, required: true},
    fuelType: { type: String, required: true},
    status: { type: String, required: true, enum:['Available','Unavailable']},
    remark: { type: String },
    assignStaff: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Staff'}
    ]
});

const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
export default Vehicle;
