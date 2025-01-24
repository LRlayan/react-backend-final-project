import {Crop} from "./crop";
import {Field} from "./field";
import {Staff} from "./staff";

export class Log {
    code:string;
    name: string;
    logDate:string;
    logDetails:string;
    image:File | null;
    assignCrops: Crop[];
    assignFields: Field[];
    assignStaff: Staff[];

    constructor(code: string, name: string, logDate: string, logDetails: string, image: File | null, assignCrops: Crop[], assignFields: Field[], assignStaff: Staff[]) {
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