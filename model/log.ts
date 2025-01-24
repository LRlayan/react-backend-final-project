import {Crop} from "./crop";
import {Field} from "./field";
import {Staff} from "./staff";

export class Log {
    id:number;
    code:string;
    name: string;
    logDate:string;
    logDetails:string;
    image:File | null;
    assignCrops: Crop[];
    assignFields: Field[];
    assignStaff: Staff[];

    constructor(id:number, code: string, name: string, logDate: string, logDetails: string, image: File | null, assignCrops: Crop[], assignFields: Field[], assignStaff: Staff[]) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.logDate = logDate;
        this.logDetails = logDetails;
        this.image = image;
        this.assignCrops = assignCrops;
        this.assignFields = assignFields;
        this.assignStaff = assignStaff;
    }
}