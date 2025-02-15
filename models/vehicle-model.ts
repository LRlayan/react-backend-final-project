export class VehicleModel {
    code: string;
    licensePlateNumber: string;
    vehicleName: string;
    category: string;
    fuelType: string;
    status: string;
    remark: string;
    assignStaff?: string[];

    constructor(vehicleCode: string, licensePlateNumber: string, vehicleName: string, category: string, fuelType: string, status: string, remark: string, assignStaff: string[]) {
        this.code = vehicleCode;
        this.licensePlateNumber = licensePlateNumber;
        this.vehicleName = vehicleName;
        this.category = category;
        this.fuelType = fuelType;
        this.status = status;
        this.remark = remark;
        this.assignStaff = assignStaff;
    }
}