import Vehicle from "../schema/vehicle";
import mongoose from "mongoose";
import Staff from "../schema/staff";

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

export async function saveVehicle(vehicleData: Vehicle) {
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
        const result = await newVehicle.save();
        if (result) {
            return { message: "Vehicle saved successfully" };
        } else {
            return { message: "Vehicle saved unsuccessfully!"}
            throw new Error("Failed to save equipment. Please try again.");
        }
    } catch (e) {
        console.error("Failed to save vehicle:", e);
        throw e;
    }
}