import {Staff} from "./staff";

export class Vehicle {
    code:string;
    licensePlateNumber:string
    vehicleName:string;
    category:string;
    fuelType:string;
    status:string;
    remark:string;
    assignStaffMember: Staff;

    constructor(code: string, licensePlateNumber: string, vehicleName: string, category: string, fuelType: string, status: string, remark: string, assignStaffMember: Staff) {
        this.code = code;
        this.licensePlateNumber = licensePlateNumber;
        this.vehicleName = vehicleName;
        this.category = category;
        this.fuelType = fuelType;
        this.status = status;
        this.remark = remark;
        this.assignStaffMember = assignStaffMember;
    }
}