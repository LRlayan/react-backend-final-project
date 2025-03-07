import Field, {IField} from "../schema/field";
import mongoose from "mongoose";
import Equipment from "../schema/equipment";
import {EquipmentModel} from "../models/equipment-model";
import Staff from "../schema/staff";
import {StaffModel} from "../models/staff-model";
import {CropModel} from "../models/crop-model";
import Crop from "../schema/crop";
import {LogModel} from "../models/log-model";
import Log from "../schema/log";
import {FieldModel} from "../models/field-model";

interface Field {
    code: string;
    name: string;
    location: string;
    extentSize: string;
    image: string | null;
    assignLogs?: string[];
    assignStaffMembers?: string[];
    assignCrops?: string[];
    assignEquipments?: string[];
}

export async function saveField(fieldData: Field) {
    try {
        const newField = new Field(fieldData);
        const result = await newField.save();
        return result
            ? result
            : { message: "Field saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save field:", e);
        throw e;
    }
}

export async function updateField(code: string ,fieldData: Partial<IField>) {
    try {
        const result = await Field.findOneAndUpdate(
            { code },
            { $set: fieldData },
            { new: true }
        );
        return result
            ? result
            : {message:"Field update Unsuccessfully"}
    } catch (e) {
        console.error("Failed to update field:", e);
        throw e;
    }
}

export async function deleteField(code: string) {
    try {
        const result = await Field.deleteOne(
            { code }
        );
        return result
            ? { message: "Field delete successfully" }
            : { message: "Field delete unsuccessfully!" };
    } catch (e) {
        console.error("Failed to delete field:", e);
        throw e;
    }
}

export async function getAllFields() {
    try {
        return await Field.find().populate("assignLogs").populate("assignStaffMembers").populate("assignCrops").populate("assignEquipments");
    } catch (e) {
        console.error("Failed to get field:", e);
        throw e;
    }
}

export async function updateFieldAssignEquipment(code: string, equData: EquipmentModel) {
    try {
        const equDocs = await Equipment.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!equDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const equId = equDocs._id;

        const existingFieldDocs = await Field.find({ assignEquipments: equId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingFieldIds = existingFieldDocs.map(field => field._id);

        const updatedFieldDocs = await Field.find({ code: { $in: equData.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedFieldIds = updatedFieldDocs.map(field => field._id);

        const fieldsToRemove = existingFieldIds.filter(id => !updatedFieldIds.includes(id));
        const fieldsToAdd = updatedFieldIds.filter(id => !existingFieldIds.includes(id));

        if (fieldsToRemove.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToRemove } },
                { $pull: { assignEquipments: equId } }
            );
        }

        if (fieldsToAdd.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToAdd } },
                { $addToSet: { assignEquipments: equId } }
            );
        }
        return updatedFieldIds;
    } catch (e) {
        console.error("Error updating field assignEquipments:", e);
        throw e;
    }
}

export async function updatedFieldAssignStaff(code: string, staffData: StaffModel) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`);
        }
        const staffId = staffDocs._id;

        const existingFieldDocs = await Field.find({ assignStaffMembers: staffId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingFieldIds = existingFieldDocs.map(field => field._id);

        const updatedFieldDocs = await Field.find({ code: { $in: staffData.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedFieldIds = updatedFieldDocs.map(field => field._id);

        const fieldsToRemove = existingFieldIds.filter(id => !updatedFieldIds.includes(id));
        const fieldsToAdd = updatedFieldIds.filter(id => !existingFieldIds.includes(id));

        if (fieldsToRemove.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToRemove } },
                { $pull: { assignStaffMembers: staffId } }
            );
        }

        if (fieldsToAdd.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToAdd } },
                { $addToSet: { assignStaffMembers: staffId } }
            );
        }
        return updatedFieldIds;
    } catch (e) {
        console.error("Error updating field assignStaff:", e);
        throw e;
    }
}

export async function updateFieldAssignCrop(code: string, cropData: CropModel) {
    try {
        const cropDocs = await Crop.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!cropDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }

        const cropId = cropDocs._id;

        const existingFieldDocs = await Field.find({ assignCrops: cropId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingFieldIds = existingFieldDocs.map(field => field._id);

        const updatedFieldDocs = await Field.find({ code: { $in: cropData.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedFieldIds = updatedFieldDocs.map(field => field._id);

        const fieldsToRemoveCrop = existingFieldIds.filter(id => !updatedFieldIds.includes(id));

        const fieldsToAddCrop = updatedFieldIds.filter(id => !existingFieldIds.includes(id));

        if (fieldsToRemoveCrop.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToRemoveCrop } },
                { $pull: { assignCrops: cropId } }
            );
        }

        if (fieldsToAddCrop.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToAddCrop } },
                { $addToSet: { assignCrops: cropId } }
            );
        }
        return updatedFieldIds;
    } catch (e) {
        console.error("Error updating field assignCrops:", e);
        throw e;
    }
}

export async function updateFieldAssignLog(code: string, logData: LogModel) {
    try {
        const logDocs = await Log.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!logDocs) {
            throw new Error(`Log with code ${code} not found`);
        }
        const logId = logDocs._id;

        const existingFieldDocs = await Field.find({ assignLogs: logId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const existingFieldIds = existingFieldDocs.map(field => field._id);

        const updatedFieldDocs = await Field.find({ code: { $in: logData.assignFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
        const updatedFieldIds = updatedFieldDocs.map(field => field._id);

        const fieldsToRemoveLog = existingFieldIds.filter(id => !updatedFieldIds.includes(id));

        const fieldsToAddLog = updatedFieldIds.filter(id => !existingFieldIds.includes(id));

        if (fieldsToRemoveLog.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToRemoveLog } },
                { $pull: { assignLogs: logId } }
            );
        }

        if (fieldsToAddLog.length > 0) {
            await Field.updateMany(
                { _id: { $in: fieldsToAddLog } },
                { $addToSet: { assignLogs: logId } }
            );
        }
        return updatedFieldIds;
    } catch (e) {
        console.error("Error updating fields assignLogs:", e);
        throw e;
    }
}

export async function deleteStaffInField(code: string) {
    try {
        const staffDocs = await Staff.findOne({ code }).lean<{ _id:  mongoose.Types.ObjectId } | null>();
        if (!staffDocs) {
            throw new Error(`Staff with code ${code} not found`)
        }
        const staffId = staffDocs._id;
        return await Field.updateMany(
            { assignStaffMembers: staffId },
            { $pull: { assignStaffMembers: staffId } }
        );
    } catch (e) {
        console.error("Error removing staff from field:", e);
        throw e;
    }
}

export async function deleteCropInField(code: string) {
    try {
        const cropDocs = await Crop.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!cropDocs) {
            throw new Error(`Crop with code ${code} not found`)
        }
        const cropId = cropDocs._id;
        return Field.updateMany(
            { assignCrops: cropId },
            { $pull: { assignCrops: cropId } }
        );
    } catch (e) {
        console.error("Error removing crop from field:", e);
        throw e;
    }
}

export async function deleteLogInField(code: string) {
    try {
        const logDocs = await Log.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!logDocs) {
            throw new Error(`Crop with code ${code} not found`);
        }
        const logId = logDocs._id;
        return Field.updateMany(
            { assignLogs: logId },
            { $pull: { assignLogs: logId } }
        );
    } catch (e) {
        console.error("Error removing log from field:", e);
        throw e;
    }
}

export async function deleteEquInField(code: string) {
    try {
        const equDocs = await Equipment.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
        if (!equDocs) {
            throw new Error(`Equipment with code ${code} not found`);
        }
        const equId = equDocs._id;
        return Field.updateMany(
            { assignEquipments: equId },
            { $pull: { assignEquipments: equId } }
        );
    } catch (e) {
        console.error("Error removing equipment from field:", e);
        throw e;
    }
}

export async function findFieldById(code: string): Promise<IField | null> {
    return await Field.findOne( {code}).populate("assignLogs").populate("assignStaffMembers").populate("assignCrops").populate("assignEquipments").exec();
}

export async function getSelectedFields(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Field.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected fields:", e);
        throw new Error("Failed to fetch selected fields. Please try again.");
    }
}