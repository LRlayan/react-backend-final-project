import {EquipmentModel} from "../models/equipment-model";
import {saveEquipment} from "../repository/equipment-repository";

export async function saveEquipmentService(equData: EquipmentModel) {
    try {
        const result = await saveEquipment(equData);
        return { message: result};
    } catch (e) {
        console.error("Service layer error: Failed to save equipment!");
        throw new Error("Failed to save equipment. Please try again.");
    }
}