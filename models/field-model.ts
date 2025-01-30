import mongoose from "mongoose";

export class FieldModel {
    code: string;
    name: string;
    location: string;
    extentSize: string;
    image: Buffer;
    assignLogs?: string[];
    assignStaffMembers?: string[];
    assignCrops?: string[];
    assignEquipments?: string[];

    constructor(code: string, name: string, location: string, extentSize: string, image: Buffer, assignLogs: string[], assignStaffMembers: string[], assignCrops: string[], assignEquipments: string[]) {
        this.code = code;
        this.name = name;
        this.location = location;
        this.extentSize = extentSize;
        this.image = image;
        this.assignLogs = assignLogs;
        this.assignStaffMembers = assignStaffMembers;
        this.assignCrops = assignCrops;
        this.assignEquipments = assignEquipments;
    }
}