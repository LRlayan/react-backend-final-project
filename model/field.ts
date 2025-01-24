import {Crop} from "./crop";
import {Log} from "./log";
import {Staff} from "./staff";
import {Equipment} from "./equipment";

export class Field {
    code:string;
    name:string;
    location:string;
    extentSize:string;
    image:File | null;
    assignCrops: Crop[];
    assignLogs: Log[];
    assignStaffMembers: Staff[];
    assignEquipments: Equipment[];

    constructor(code: string, name: string, location: string, extentSize: string, image: File | null, assignCrops: Crop[], assignLogs: Log[], assignStaffMembers: Staff[], assignEquipments: Equipment[]) {
        this.code = code;
        this.name = name;
        this.location = location;
        this.extentSize = extentSize;
        this.image = image;
        this.assignCrops = assignCrops;
        this.assignLogs = assignLogs;
        this.assignStaffMembers = assignStaffMembers;
        this.assignEquipments = assignEquipments;
    }
}