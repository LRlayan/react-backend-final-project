import Vehicle, {IVehicle} from "../schema/vehicle";
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

export async function updateVehicle(vehicleData: any) {
    try {
        const result = await vehicleData.save();
        if (result) {
            return { message: "Updated to vehicle Successfully"};
        } else {
            return { message: "Failed to update vehicle"};
        }
    } catch (e) {
        console.error("Failed to update vehicle:", e);
        throw e;
    }
}