import { saveStaff } from "../repository/staff-repository";
import { StaffModel } from "../models/staff-model";

export async function saveStaffService(staffData: StaffModel) {
    try {
        const result = await saveStaff(staffData);
        return { message: result };
    } catch (error) {
        console.error("Service layer error: Failed to save staff!", error);
        throw new Error("Failed to save staff. Please try again.");
    }
}
