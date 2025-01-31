import {LogModel} from "../models/log-model";
import {saveLog} from "../repository/log-repository";

export async function saveLogService(logData: LogModel) {
    try {
        const result = await saveLog(logData);
        return { message: result};
    } catch (e) {
        console.error("Service layer error: Failed to save logs!");
        throw new Error("Failed to save logs. Please try again.");
    }
}