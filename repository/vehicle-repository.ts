import Vehicle, {IVehicle} from "../schema/vehicle";

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

export async function updateVehicle(vehicleCode: string, updateData: Partial<IVehicle>) {
    try {
        const result = await Vehicle.findOneAndUpdate(
            { vehicleCode },
            { $set: updateData },
            { new: true }
        );
        return result
            ? { message: "Vehicle update successfully" }
            : { message: "Vehicle update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update vehicle:", e);
        throw e;
    }
}