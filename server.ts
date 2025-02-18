import express from 'express';
import vehicleRoutes from "./routes/vehicle-routes";
import mongoose from "mongoose";
import staffRoutes from "./routes/staff-routes";
import equipmentRoutes from "./routes/equipment-routes";
import cropRoutes from "./routes/crop-routes";
import fieldRoutes from "./routes/field-routes";
import logRoutes from "./routes/log-routes";
import dotenv from "dotenv";

const cors = require('cors');
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
}));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.DATABASE_URL as string)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });


app.use('/api/v1/crop',cropRoutes);
app.use('/api/v1/field',fieldRoutes);
app.use('/api/v1/log',logRoutes);
app.use('/api/v1/staff',staffRoutes);
app.use('/api/v1/equipment',equipmentRoutes);
app.use('/api/v1/vehicle',vehicleRoutes);

app.listen(3000, () => console.log("Server start 3000 port"));