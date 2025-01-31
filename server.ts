import express from 'express';
import vehicleRoutes from "./routes/vehicle-routes";
import mongoose from "mongoose";
import staffRoutes from "./routes/staff-routes";
import equipmentRoutes from "./routes/equipment-routes";
import cropRoutes from "./routes/crop-routes";
import fieldRoutes from "./routes/field-routes";

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    method: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use('/uploads', express.static('uploads'));

mongoose.connect("mongodb://localhost:27017/cropMonitoringDB")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });


app.use('/crop',cropRoutes);
app.use('/field',fieldRoutes);
// app.use('/log');
app.use('/staff',staffRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/vehicle',vehicleRoutes);

app.listen(3000, () => console.log("Server start 3000 port"));