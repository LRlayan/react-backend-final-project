import Vehicle from "../model/vehicle";
import mongoose from "mongoose";
import Staff from "../model/staff";

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

export async function saveVehicle(v: Vehicle) {
    try {
        let assignStaffIds: mongoose.Types.ObjectId[] = [];

        if (v.assignStaff && v.assignStaff.length > 0) {
            const staffDocs = await Staff.find({ code: { $in: v.assignStaff } });
            assignStaffIds = staffDocs.map((staff) => staff._id as mongoose.Types.ObjectId);
        }

        const newVehicle = new Vehicle({
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
        console.log("Vehicle saved successfully:", newVehicle);
    } catch (e) {
        console.error("Failed to save vehicle:", e);
        throw e;
    }
}