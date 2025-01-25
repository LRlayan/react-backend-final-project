import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    vehicleCode: { type: String, required: true },
    licensePlateNumber: { type: String, required: true },
    vehicleName: { type: String, required: true },
    category: { type: String, required: true },
    fuelType: { type: String, required: true },
    status: { type: String, required: true },
    remark: { type: String }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
