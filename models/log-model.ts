import mongoose from "mongoose";

export class LogModel {
    code: string;
    name: string;
    logDate: string;
    logDetails: string;
    image: string | null;
    assignFields?: string[];
    assignStaff?: string[];
    assignCrops?: string[];

    constructor(code: string, name: string, logDate: string, logDetails: string, image: string | null, assignFields: string[], assignStaff: string[], assignCrops: string[]) {
        this.code = code;
        this.name = name;
        this.logDate = logDate;
        this.logDetails = logDetails;
        this.image = image;
        this.assignFields = assignFields;
        this.assignStaff = assignStaff;
        this.assignCrops = assignCrops;
    }
}