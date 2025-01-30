import mongoose from "mongoose";

export class StaffModel {
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
    assignLogs?: string[];
    assignFields?: string[];
    assignEquipments?: string[];

    constructor(code: string, firstName: string, lastName: string, joinedDate: string, designation: string, gender: string, dob: string, addressLine01: string, addressLine02: string, addressLine03: string, addressLine04: string, addressLine05: string, mobile: string, email: string, role: string, assignVehicles: string[], assignLogs: string[], assignFields: string[], assignEquipments: string[]) {
        this.code = code;
        this.firstName = firstName;
        this.lastName = lastName;
        this.joinedDate = joinedDate;
        this.designation = designation;
        this.gender = gender;
        this.dob = dob;
        this.addressLine01 = addressLine01;
        this.addressLine02 = addressLine02;
        this.addressLine03 = addressLine03;
        this.addressLine04 = addressLine04;
        this.addressLine05 = addressLine05;
        this.mobile = mobile;
        this.email = email;
        this.role = role;
        this.assignVehicles = assignVehicles;
        this.assignLogs = assignLogs;
        this.assignFields = assignFields;
        this.assignEquipments = assignEquipments;
    }
}