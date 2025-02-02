import {VehicleModel} from "../models/vehicle-model";
import {findVehicleByCode, saveVehicle, updateVehicle} from "../repository/vehicle-repository";
import Vehicle, {StatusType} from "../schema/vehicle";
import mongoose from "mongoose";
import Staff from "../schema/staff";
import {updateStaffAssignVehicle} from "../repository/staff-repository";

export async function saveVehicleService(vehicleData: VehicleModel) {
    try {
        let assignStaffIds: mongoose.Types.ObjectId[] = [];

        const staffDocs = await Staff.find({ code: { $in: vehicleData.assignStaff } });
        assignStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);

        const newVehicle = new Vehicle({
            vehicleCode: vehicleData.vehicleCode,
            licensePlateNumber: vehicleData.licensePlateNumber,
            vehicleName: vehicleData.vehicleName,
            category: vehicleData.category,
            fuelType: vehicleData.fuelType,
            status: vehicleData.status,
            remark: vehicleData.remark,
            assignStaff : assignStaffIds
        });

        const result = await saveVehicle(newVehicle);
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

        const updatedVehiclesOfStaff = await updateStaffAssignVehicle(vehicleData.vehicleCode,vehicleData);

        const updatedVehicle = await updateVehicle(existingVehicle);
        return updatedVehicle;
    } catch (e) {
        console.error("Service layer error: Failed to update vehicle!", e);
        throw new Error("Failed to update vehicle, Please try again.");
    }
}