import mongoose from "mongoose";
import {StaffModel} from "./staff-model";

export class VehicleModel {
    vehicleCode: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: string;
    remark: string;
    assignStaff?: StaffModel;

    constructor(vehicleCode: string, licensePlateNumber: string, vehicleName: string, category: string, fuelType: string, status: string, remark: string, assignStaff: StaffModel) {
        this.vehicleCode = vehicleCode;
        this.licensePlateNumber = licensePlateNumber;
        this.vehicleName = vehicleName;
        this.category = category;
        this.fuelType = fuelType;
        this.status = status;
        this.remark = remark;
        this.assignStaff = assignStaff;
    }
}