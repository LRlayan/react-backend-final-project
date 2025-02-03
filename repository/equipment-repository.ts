import Equipment, {IEquipment} from "../schema/equipment";

interface Equipment {
    code: string;
    name: string;
    equType: string;
    status: string;
    count: number;
    assignStaffMembers?: string[];
    assignFields?: string[];
}

export async function saveEquipment(equData: Equipment) {
    try {
        const newEquipment = new Equipment(equData);
        const result = await newEquipment.save();
        return result
            ? { message: "Equipment saved successfully" }
            : { message: "Equipment saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save equipment:", e);
        throw e;
    }
}

export async function updateEquipment(equData: any) {
    try {
        const result = await equData.save();
        return result
            ? { message: "Equipment update successfully" }
            : { message: "Equipment update unsuccessfully!" };
    } catch (e) {
        console.error("Failed to update equipment:", e);
        throw e;
    }
}

export async function findEquipmentByCode(equCode: string): Promise<IEquipment | null> {
    return await Equipment.findOne({ equCode }).populate("assignField").exec();
}