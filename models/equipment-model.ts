import mongoose from "mongoose";
import {EquipmentType, StatusType} from "../schema/equipment-schema";

export class EquipmentModel {
    code:string;
    name:string;
    equType:string;
    status:string;
    count:number;
    assignStaffMembers: string[];
    assignFields: string[];

    constructor(code: string, name: string, equType: string, status: string, count: number, assignStaffMembers: string[], assignFields: string[]) {
        this.code = code;
        this.name = name;
        this.equType = equType;
        this.status = status;
        this.count = count;
        this.assignStaffMembers = assignStaffMembers;
        this.assignFields = assignFields;
    }
}