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
                const codes = getAllCrop.map((crop) => crop.code);

                if (codes.length > 0) {
                    return await this.codesIncrement(codes);
                }
                return "CROP-1";
            case "STAFF-":
                const getAllStaffs = await getAllStaff();
                const codes = getAllStaffs.map((staff) => staff.code);

                if (codes.length > 0) {
                    return await this.codesIncrement(codes);
                }
                return "STAFF-1";
            case "LOG-":
                const getAllLog = await getAllLogs();
                const codes = getAllLog.map((log) => log.code);

                if (codes.length > 0) {
                    return await this.codesIncrement(codes);
                }
                return "LOG-1";
            case "FIELD-":
                const getAllField = await getAllFields();
                const codes = getAllField.map((field) => field.code);

                if (codes.length > 0) {
                    return await this.codesIncrement(codes);
                }
                return "FIELD-1";
            case "VEHICLE-":
                const getAllVehicle = await getAllVehicles();
                const codes = getAllVehicle.map((vehicle) => vehicle.vehicleCode);

                if (codes.length > 0) {
                    return await this.codesIncrement(codes);
                }
                return "VEHICLE-1";
            case "EQUIPMENT-":
                const getAllEquipments = await getAllEquipment();
                const codes = getAllEquipments.map((equ) => equ.code);

                if (codes.length > 0) {
                    return await this.codesIncrement(codes);
                }
                return "EQUIPMENT-1";
            default:
                return null;
        }
    }

    async codesIncrement(codes: string[]): Promise<string> {
        const lastElement = codes[codes.length - 1];
        const parts = lastElement.split("-");
        let increment = parseInt(parts[1], 10) + 1;
        return `CROP-${increment}`;
    }
}

export default IdGenerator;