import Vehicle, {IVehicle} from "../schema/vehicle";
import {StaffModel} from "../models/staff-model";
import Staff from "../schema/staff";
import mongoose from "mongoose";

interface Vehicle {
    vehicleCode: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: string;
    remark?: string;
    assignStaff?: string[];
}

export async function findVehicleByCode(vehicleCode: string): Promise<IVehicle | null> {
    return await Vehicle.findOne({ vehicleCode }).populate("assignStaff").exec();
}

export async function saveVehicle(vehicleData: Vehicle) {
    try {
        const newVehicle = new Vehicle(vehicleData);
        const result = await newVehicle.save();
        return result
            ? { message: "Vehicle saved successfully" }
            : { message: "Vehicle saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save vehicle:", e);
        throw e;
    }
}

export async function updateVehicle(vehicleCode: string, updateData: Partial<IVehicle>) {
    try {
        const result = await Vehicle.findOneAndUpdate(
            { vehicleCode },
            { $set: updateData },
            { new: true }
        );
        return result
            ? { message: "Vehicle update successfully" }
            : { message: "Vehicle update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update vehicle:", e);
        throw e;
    }
}

export async function updatedVehicleAssignStaff(vehicleCode: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ vehicleCode }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${vehicleCode} not found`);
        }
        const staffId = staffDocs._id;

        let vehicleCodes : mongoose.Types.ObjectId[] = [];
        const vehicleDocs = await Vehicle.find({ code: { $in: staffData.assignVehicles }}).lean<{ _id: mongoose.Types.ObjectId }[]>();
        vehicleCodes = vehicleDocs.map((vehicle) => vehicle._id);

        await Vehicle.updateMany(
            { assignStaff: staffId },
            { $pull: staffId }
        );

        await Vehicle.updateMany(
            { _id: { $in: vehicleCodes }},
            { $addToSet: { assignStaff: staffId }}
        );
        return vehicleCodes;
    } catch (e) {
        console.error("Error updating vehicle assignStaff:", e);
        throw e;
    }
}