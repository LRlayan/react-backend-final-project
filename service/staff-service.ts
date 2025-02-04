import {findStaffById, saveStaff, updateStaff} from "../repository/staff-repository";
import { StaffModel } from "../models/staff-model";
import mongoose from "mongoose";
import Vehicle from "../schema/vehicle";
import Log from "../schema/log";
import Field from "../schema/field";
import Equipment from "../schema/equipment";
import Staff, {DesignationType, GenderType, IStaff, RoleType} from "../schema/staff";
import {updatedVehicleAssignStaff} from "../repository/vehicle-repository";
import {updatedFieldAssignStaff} from "../repository/field-repository";
import {updatedEquipmentAssignStaff} from "../repository/equipment-repository";
import {updatedLogAssignStaff} from "../repository/log-repository";

export async function saveStaffService(staffData: StaffModel) {
    try {
        let assignVehicleIds: mongoose.Types.ObjectId[] = [];
        let assignFieldIds: mongoose.Types.ObjectId[] = [];
        let assignLogIds: mongoose.Types.ObjectId[] = [];
        let assignEquipmentIds: mongoose.Types.ObjectId[] = [];

        const vehicleDocs = await Vehicle.find({ vehicleCode: { $in: staffData.assignVehicles } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignVehicleIds = vehicleDocs.map((vehicle) => vehicle._id);

        const logDocs = await Log.find({ code: { $in: staffData.assignLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignLogIds = logDocs.map((log) => log._id);

        const fieldDocs = await Field.find({ code: { $in: staffData.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignFieldIds = fieldDocs.map((field) => field._id);

        const equipmentDocs = await Equipment.find({ code: { $in: staffData.assignEquipments } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        assignEquipmentIds = equipmentDocs.map((equipment) => equipment._id);

        const newStaff = new Staff({
            code: staffData.code,
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            joinedDate: staffData.joinedDate,
            designation: staffData.designation,
            gender: staffData.gender,
            dob: staffData.dob,
            addressLine01: staffData.addressLine01,
            addressLine02: staffData.addressLine02,
            addressLine03: staffData.addressLine03,
            addressLine04: staffData.addressLine04,
            addressLine05: staffData.addressLine05,
            mobile: staffData.mobile,
            email: staffData.email,
            role: staffData.role,
            assignVehicles: assignVehicleIds,
            assignLogs: assignLogIds,
            assignFields: assignFieldIds,
            assignEquipments: assignEquipmentIds
        });
        const result = await saveStaff(newStaff);
        return { message: result };
    } catch (error) {
        console.error("Service layer error: Failed to save staff!", error);
        throw new Error("Failed to save staff. Please try again.");
    }
}

export async function updateStaffService(staffData: StaffModel) {
    try {
        const excitingStaff = await findStaffById(staffData.code);
        if (!excitingStaff) {
            throw new Error("Staff member not found");
        }

        let updatedVehicleIds : mongoose.Types.ObjectId[] = [];
        let updatedFieldIds : mongoose.Types.ObjectId[] = [];
        let updatedLogIds : mongoose.Types.ObjectId[] = [];
        let updateEquipmentIds : mongoose.Types.ObjectId[] = [];
        if (staffData.assignVehicles && Array.isArray(staffData.assignVehicles) || staffData.assignFields && Array.isArray(staffData.assignFields) || staffData.assignLogs && Array.isArray(staffData.assignLogs) || staffData.assignEquipments && Array.isArray(staffData.assignEquipments)) {
            const vehicleDocs = await Vehicle.find({ vehicleCode: { $in: staffData.assignVehicles }});
            updatedVehicleIds = vehicleDocs.map((vehicle) => vehicle._id);

            const fieldDocs = await Field.find({ code: { $in: staffData.assignFields}});
            updatedFieldIds = fieldDocs.map((field) => field._id);

            const logDocs = await Log.find({ code: {  $in: staffData.assignLogs}});
            updatedLogIds = logDocs.map((log) => log._id);

            const equDocs = await Equipment.find({ code: { $in: staffData.assignEquipments}});
            updateEquipmentIds = equDocs.map((equ) => equ._id);
        }

        const updateData : Partial<IStaff> = {
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            joinedDate: staffData.joinedDate,
            designation: staffData.designation as DesignationType,
            gender: staffData.gender as GenderType,
            dob: staffData.dob,
            addressLine01: staffData.addressLine01,
            addressLine02: staffData.addressLine02,
            addressLine03: staffData.addressLine03,
            addressLine04: staffData.addressLine04,
            addressLine05: staffData.addressLine05,
            mobile: staffData.mobile,
            email: staffData.email,
            role: staffData.role as RoleType,
            assignVehicles: updatedVehicleIds,
            assignLogs: updatedLogIds,
            assignFields: updatedFieldIds,
            assignEquipments: updateEquipmentIds
        }

        const updatedStaffAssignVehicle = await updatedVehicleAssignStaff(staffData.code,staffData);
        const updatedStaffAssignLog = await updatedLogAssignStaff(staffData.code,staffData);
        const updatedStaffAssignField = await updatedFieldAssignStaff(staffData.code,staffData);
        const updatedStaffAssignEquipment = await updatedEquipmentAssignStaff(staffData.code,staffData);
        const result = await updateStaff(staffData.code,updateData);
        return result;
    } catch (e) {
        console.error("Service layer error: Failed to update staff member!", e);
        throw new Error("Failed to update staff member, Please try again.");
    }
}