import express from 'express';
import vehicleRoutes from "./routes/vehicle-routes";
import mongoose from "mongoose";
import staffRoutes from "./routes/staff-routes";

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    method: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

mongoose.connect("mongodb://localhost:27017/cropMonitoringDB")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });


// app.use('/crop');
// app.use('/field');
// app.use('/log');
app.use('/staff',staffRoutes);
// app.use('/equipment');
app.use('/vehicle',vehicleRoutes);

app.listen(3000, () => console.log("Server start 3000 port"));