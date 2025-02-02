import {VehicleModel} from "../models/vehicle-model";
import {findVehicleByCode, saveVehicle, updateVehicle} from "../repository/vehicle-repository";
import {StatusType} from "../schema/vehicle";
import mongoose from "mongoose";
import Staff from "../schema/staff";

export async function saveVehicleService(vehicleData: VehicleModel) {
    try {
        const result = await saveVehicle(vehicleData);
        return { message: result}
    } catch (e) {
        console.error("Service layer error: Failed to save vehicle!");
        throw new Error("Failed to save vehicle, Please try again.");
    }
}

export async function updateVehicleService(vehicleData: VehicleModel) {
    try {
        const existingVehicle = await findVehicleByCode(vehicleData.vehicleCode);
        if (!existingVehicle) {
            throw new Error("Vehicle not found!");
        }

        // Convert staff codes to ObjectIds
        let updatedStaffIds: mongoose.Types.ObjectId[] = [];
        if (vehicleData.assignStaff && Array.isArray(vehicleData.assignStaff)) {
            const staffDocs = await Staff.find({ code: { $in: vehicleData.assignStaff } });
            updatedStaffIds = staffDocs.map(staff => staff._id as mongoose.Types.ObjectId);
        }

        existingVehicle.licensePlateNumber = vehicleData.licensePlateNumber;
        existingVehicle.vehicleName = vehicleData.vehicleName;
        existingVehicle.category = vehicleData.category;
        existingVehicle.fuelType = vehicleData.fuelType;
        existingVehicle.status = vehicleData.status as StatusType;
        existingVehicle.remark = vehicleData.remark;
        existingVehicle.assignStaff = updatedStaffIds;

        const updatedVehicle = await updateVehicle(existingVehicle);
        return updatedVehicle;
    } catch (e) {
        console.error("Service layer error: Failed to update vehicle!", e);
        throw new Error("Failed to update vehicle, Please try again.");
    }
}