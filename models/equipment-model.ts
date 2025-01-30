export class EquipmentModel {
    code:string;
    name:string;
    equType:string;
    status:string;
    count:number;
    assignStaffMembers?: string[];
    assignFields?: string[];

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