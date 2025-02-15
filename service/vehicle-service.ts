import {VehicleModel} from "../models/vehicle-model";
import {deleteVehicle, findVehicleByCode, getAllVehicles, saveVehicle, updateVehicle} from "../repository/vehicle-repository";
import Vehicle, {IVehicle, StatusType} from "../schema/vehicle";
import mongoose from "mongoose";
import Staff from "../schema/staff";
import {deleteVehicleInStaff, getSelectedStaff, updateStaffAssignVehicle} from "../repository/staff-repository";

export async function saveVehicleService(vehicleData: VehicleModel) {
    try {
        let assignStaffIds: mongoose.Types.ObjectId[] = [];
        let assignStaffCodes: string[] = [];

        const staffDocs = await Staff.find({ code: { $in: vehicleData.assignStaff } });
        assignStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);

        const newVehicle = new Vehicle({
            code: vehicleData.code,
            licensePlateNumber: vehicleData.licensePlateNumber,
            vehicleName: vehicleData.vehicleName,
            category: vehicleData.category,
            fuelType: vehicleData.fuelType,
            status: vehicleData.status,
            remark: vehicleData.remark,
            assignStaff : assignStaffIds
        });
        const result = await saveVehicle(newVehicle);
        await updateStaffAssignVehicle(vehicleData.code,vehicleData);

        const getStaff = await getSelectedStaff(result.assignStaffMembers);
        assignStaffCodes = getStaff.map((staff) => staff.code);

        const modifiedResult = {
            ...result.toObject(),
            assignStaffMembers: assignStaffCodes
        };
        return modifiedResult;
    } catch (e) {
        console.error("Service layer error: Failed to save vehicle!");
        throw new Error("Failed to save vehicle, Please try again.");
    }
}

export async function updateVehicleService(vehicleData: VehicleModel) {
    try {
        const existingVehicle = await findVehicleByCode(vehicleData.code);
        if (!existingVehicle) {
            throw new Error("Vehicle not found!");
        }

        let updatedStaffIds: mongoose.Types.ObjectId[] = [];
        let assignStaffCodes: string[] = [];

        if (vehicleData.assignStaff && Array.isArray(vehicleData.assignStaff)) {
            const staffDocs = await Staff.find({ code: { $in: vehicleData.assignStaff } });
            updatedStaffIds = staffDocs.map(staff => staff._id as mongoose.Types.ObjectId);
        }

        const updateData : Partial<IVehicle> = {
            licensePlateNumber: vehicleData.licensePlateNumber,
            vehicleName: vehicleData.vehicleName,
            category: vehicleData.category,
            fuelType: vehicleData.fuelType,
            status: vehicleData.status as StatusType,
            remark: vehicleData.remark,
            assignStaff: updatedStaffIds
        };

        const result = await updateVehicle(vehicleData.code, updateData);
        await updateStaffAssignVehicle(vehicleData.code,vehicleData);

        const getStaff = await getSelectedStaff(result.assignStaffMembers);
        assignStaffCodes = getStaff.map((staff) => staff.code);

        const modifiedResult = {
            ...result.toObject(),
            assignStaffMembers: assignStaffCodes
        };
        return modifiedResult;
    } catch (e) {
        console.error("Service layer error: Failed to update vehicle!", e);
        throw new Error("Failed to update vehicle, Please try again.");
    }
}

export async function deleteVehicleService(code: string) {
    try {
        const excitingVehicle = await findVehicleByCode(code);
        if (!excitingVehicle) {
            throw new Error("Vehicle is not found");
        }
        await deleteVehicleInStaff(code);
        return await deleteVehicle(code);
    } catch (e) {
        console.log("Vehicle service: Failed to delete vehicle",e);
        throw e;
    }
}

export async function getAllVehicleService() {
    try {
        return await getAllVehicles();
    } catch (e) {
        console.log("Vehicle service: Failed to get vehicle data",e);
        throw e;
    }
}