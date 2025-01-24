import {Field} from "./field";
import {Log} from "./log";

export class Crop {
    id:number;
    code:string;
    name:string;
    scientificName:string;
    category:string;
    season:string;
    image: File | null;
    assignFields: Field[];
    assignLogs: Log[];

    constructor(id:number, code: string, name: string, scientificName: string, category: string, season: string, image: File | null, assignFields: Field[], assignLogs: Log[]) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.scientificName = scientificName;
        this.category = category;
        this.season = season;
        this.image = image;
        this.assignFields = assignFields;
        this.assignLogs = assignLogs;
    }
}