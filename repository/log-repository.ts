import Log from "../schema/log";
import mongoose from "mongoose";
import Field from "../schema/field";
import Staff from "../schema/staff";
import Crop from "../schema/crop";

interface Log {
    code: string;
    name: string;
    logDate: string;
    logDetails: string;
    image: string | null;
    assignFields?: string[];
    assignStaff?: string[];
    assignCrops?: string[];
}

export async function saveLog(logData: Log) {
    try {
        const newLog = new Log(logData);
        const result = await newLog.save();
        return result
            ? { message: "Log saved successfully" }
            : { message: "Log saved unsuccessfully!" };
    } catch (e) {
        console.error("Failed to save log:", e);
        throw e;
    }
}

export async function updateLog(logData: Log) {

}