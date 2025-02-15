import {getAllCrops} from "../repository/crop-repository";
import {getAllStaff} from "../repository/staff-repository";
import {getAllLogs} from "../repository/log-repository";
import {getAllFields} from "../repository/field-repository";
import {getAllVehicles} from "../repository/vehicle-repository";
import {getAllEquipment} from "../repository/equipment-repository";

class IdGenerator {

    async generateId(type: string){
        switch (type) {
            case "CROP-":
                const getAllCrop = await getAllCrops();
                const cropCodes = getAllCrop.map((crop) => crop.code);

                if (cropCodes.length > 0) {
                    return await this.codesIncrement(cropCodes,"CROP");
                }
                return "CROP-1";
            case "STAFF-":
                const getAllStaffs = await getAllStaff();
                const staffCodes = getAllStaffs.map((staff) => staff.code);

                if (staffCodes.length > 0) {
                    return await this.codesIncrement(staffCodes,"STAFF");
                }
                return "STAFF-1";
            case "LOG-":
                const getAllLog = await getAllLogs();
                const logCodes = getAllLog.map((log) => log.code);

                if (logCodes.length > 0) {
                    return await this.codesIncrement(logCodes,"LOG");
                }
                return "LOG-1";
            case "FIELD-":
                const getAllField = await getAllFields();
                const fieldCodes = getAllField.map((field) => field.code);

                if (fieldCodes.length > 0) {
                    return await this.codesIncrement(fieldCodes,"FIELD");
                }
                return "FIELD-1";
            case "VEHICLE-":
                const getAllVehicle = await getAllVehicles();
                const vehicleCodes = getAllVehicle.map((vehicle) => vehicle.code);

                if (vehicleCodes.length > 0) {
                    return await this.codesIncrement(vehicleCodes,"VEHICLE");
                }
                return "VEHICLE-1";
            case "EQUIPMENT-":
                const getAllEquipments = await getAllEquipment();
                const equipmentCodes = getAllEquipments.map((equ) => equ.code);

                if (equipmentCodes.length > 0) {
                    return await this.codesIncrement(equipmentCodes,"EQUIPMENT");
                }
                return "EQUIPMENT-1";
            default:
                return null;
        }
    }

    async codesIncrement(codes: string[], type: string): Promise<string> {
        const lastElement = codes[codes.length - 1];
        const parts = lastElement.split("-");
        let increment = parseInt(parts[1], 10) + 1;
        return `${type}-${increment}`;
    }
}

export default IdGenerator;