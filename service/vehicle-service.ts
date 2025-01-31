import {VehicleModel} from "../models/vehicle-model";
import {saveVehicle} from "../repository/vehicle-repository";

export async function saveVehicleService(vehicleData: VehicleModel) {
    try {
        const result = await saveVehicle(vehicleData);
        return { message: result}
    } catch (e) {
        console.error("Service layer error: Failed to save vehicle!");
        throw new Error("Failed to save vehicle, Please try again.");
    }
}