import express from 'express';

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(cors({
    origin: "http://localhost:5173",
    method: ['GET','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use('/crop');
app.use('/field');
app.use('/log');
app.use('/staff');
app.use('/equipment');
app.use('/vehicle');

app.listen(3000, () => console.log("Server start 3000 port"));