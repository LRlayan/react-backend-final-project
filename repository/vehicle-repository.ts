import VehicleSchema from "../schema/vehicle-schema";
import mongoose from "mongoose";
import StaffSchema from "../schema/staff-schema";

interface VehicleSchema {
    code: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: string;
    remark?: string;
    assignStaff?: string[];
}

export async function saveVehicle(v: VehicleSchema) {
    try {
        let assignStaffIds: mongoose.Types.ObjectId[] = [];

        if (v.assignStaff && v.assignStaff.length > 0) {
            const staffDocs = await StaffSchema.find({ code: { $in: v.assignStaff } });
            assignStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);
        }

        const newVehicle = new VehicleSchema({
            vehicleCode: v.code,
            licensePlateNumber: v.licensePlateNumber,
            vehicleName: v.vehicleName,
            category: v.category,
            fuelType: v.fuelType,
            status: v.status,
            remark: v.remark,
            assignStaff : assignStaffIds
        });
        await newVehicle.save();
        console.log("VehicleModel saved successfully:", newVehicle);
    } catch (e) {
        console.error("Failed to save vehicle:", e);
        throw e;
    }
}