import Vehicle, {IVehicle} from "../schema/vehicle";
import {StaffModel} from "../models/staff-model";
import Staff from "../schema/staff";
import mongoose from "mongoose";

interface Vehicle {
    code: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: string;
    remark?: string;
    assignStaff?: string[];
}

export async function saveVehicle(vehicleData: Vehicle) {
    try {
        const newVehicle = new Vehicle(vehicleData);
        const result = await newVehicle.save();
        return result
            ? result
            : { message: "Vehicle saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save vehicle:", e);
        throw e;
    }
}

export async function updateVehicle(code: string, updateData: Partial<IVehicle>) {
    try {
        const result = await Vehicle.findOneAndUpdate(
            { code },
            { $set: updateData },
            { new: true }
        );
        return result
            ? result
            : { message: "Vehicle update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update vehicle:", e);
        throw e;
    }
}

export async function deleteVehicle(code: string) {
    try {
        const result = await Vehicle.deleteOne(
            {code}
        );
        return result
            ? { message: "Vehicle delete successfully" }
            : { message: "Vehicle delete unsuccessfully!" };
    } catch (e) {
        console.error("Failed to delete vehicle:", e);
        throw e;
    }
}

export async function getAllVehicles() {
    try {
        return await Vehicle.find().populate("assignStaff");
    } catch (e) {
        console.error("Failed to get vehicle data:", e);
        throw e;
    }
}

export async function findVehicleByCode(code: string): Promise<IVehicle | null> {
    return await Vehicle.findOne({ code }).populate("assignStaff").exec();
}

export async function updatedVehicleAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        const existingVehicleDocs = await Vehicle.find({ assignStaff: staffId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingVehicleIds = existingVehicleDocs.map(vehicle => vehicle._id);

        const updatedVehicleDocs = await Vehicle.find({ code: { $in: staffData.assignVehicles } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedVehicleIds = updatedVehicleDocs.map(vehicle => vehicle._id);

        const vehiclesToRemove = existingVehicleIds.filter(id => !updatedVehicleIds.includes(id));
        const vehiclesToAdd = updatedVehicleIds.filter(id => !existingVehicleIds.includes(id));

        if (vehiclesToRemove.length > 0) {
            await Vehicle.updateMany(
                { _id: { $in: vehiclesToRemove } },
                { $pull: { assignStaff: staffId } }
            );
        }

        if (vehiclesToAdd.length > 0) {
            await Vehicle.updateMany(
                { _id: { $in: vehiclesToAdd } },
                { $addToSet: { assignStaff: staffId } }
            );
        }
        return updatedVehicleIds;
    } catch (e) {
        console.error("Error updating vehicle assignStaff:", e);
        throw e;
    }
}

export async function deleteStaffInVehicle(code: string) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;
        return  Vehicle.updateMany(
            { assignStaff: staffId },
            { $pull: { assignStaff: staffId } }
        );
    } catch (e) {
        console.error("Error removing staff from vehicle:", e);
        throw e;
    }
}

export async function getSelectedVehicles(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Vehicle.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected vehicles:", e);
        throw new Error("Failed to fetch selected vehicles. Please try again.");
    }
}