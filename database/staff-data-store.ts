import mongoose from "mongoose";
import Vehicle from "../model/vehicle";
import Staff from "../model/staff";

interface Staff {
    code: string;
    firstName: string;
    lastName: string;
    joinedDate: string;
    designation: string;
    gender: string;
    dob: string;
    addressLine01: string;
    addressLine02: string;
    addressLine03: string;
    addressLine04: string;
    addressLine05: string;
    mobile: string;
    email: string;
    role: string;
    assignVehicles?: string[];
}

export async function saveStaff(s: Staff) {
    try {
        let assignVehicleIds: mongoose.Types.ObjectId[] = [];
        if (s.assignVehicles && s.assignVehicles.length > 0) {
            const vehicleDocs = await Vehicle.find({ vehicleCode: { $in: s.assignVehicles } });
            console.log("vehicle Docs : ", vehicleDocs);
            assignVehicleIds = vehicleDocs.map((vehicle) => vehicle._id as mongoose.Types.ObjectId);
        }

        const newStaff = new Staff({
            code: s.code,
            firstName: s.firstName,
            lastName: s.lastName,
            joinedDate: s.joinedDate,
            designation: s.designation,
            gender: s.gender,
            dob: s.dob,
            addressLine01: s.addressLine01,
            addressLine02: s.addressLine02,
            addressLine03: s.addressLine03,
            addressLine04: s.addressLine04,
            addressLine05: s.addressLine05,
            mobile: s.mobile,
            email: s.email,
            role: s.role,
            assignVehicles: assignVehicleIds
        });
        await newStaff.save();
        console.log("Staff Member saved successfully:", newStaff);
    } catch (e) {
        console.error("Failed to save staff:", e);
        throw e;
    }
}