import Vehicle from "../model/vehicle";

interface Vehicle {
    code: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: string;
    remark?: string;
}

export async function saveVehicle(v: Vehicle) {
    try {
        const newVehicle = new Vehicle({
            vehicleCode: v.code,
            licensePlateNumber: v.licensePlateNumber,
            vehicleName: v.vehicleName,
            category: v.category,
            fuelType: v.fuelType,
            status: v.status,
            remark: v.remark
        });
        await newVehicle.save();
        console.log("Vehicle saved successfully:", newVehicle);
    } catch (e) {
        console.error("Failed to save vehicle:", e);
        throw e;
    }
}