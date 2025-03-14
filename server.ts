import express from 'express';
import vehicleRoutes from "./routes/vehicle-routes";
import mongoose from "mongoose";
import staffRoutes from "./routes/staff-routes";
import equipmentRoutes from "./routes/equipment-routes";
import cropRoutes from "./routes/crop-routes";
import fieldRoutes from "./routes/field-routes";
import logRoutes from "./routes/log-routes";
import authRoutes from "./routes/auth-routes";
import {authenticateToken} from "./middleware/authenticate";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
}));

app.use('/api/v1/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

mongoose.connect("mongodb://localhost:27017/cropMonitoringDB")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

app.use('/api/v1/crop',authenticateToken,cropRoutes);
app.use('/api/v1/field',authenticateToken,fieldRoutes);
app.use('/api/v1/log',authenticateToken,logRoutes);
app.use('/api/v1/staff',authenticateToken,staffRoutes);
app.use('/api/v1/equipment',authenticateToken,equipmentRoutes);
app.use('/api/v1/vehicle',authenticateToken,vehicleRoutes);
app.listen(3001, () => console.log("Server start 3001 port"));