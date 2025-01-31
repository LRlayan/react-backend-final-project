export class CropModel {
    code:string;
    name:string;
    scientificName:string;
    category:string;
    season: string;
    image: string | null;
    assignFields: string[];
    assignLogs:string[];

    constructor(code: string, name: string, scientificName: string, category: string, season: string, image: string | null, assignFields: string[], assignLogs: string[]) {
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