import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import pg from "pg";
import cookieParser from "cookie-parser";
import router from "./routes/user.routes.js";
import captainrouter from "./routes/captain.routes.js";
import mapsRouter from "./routes/maps.routes.js";
import ridesRouter from "./routes/rides.routes.js"

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

app.use(cookieParser());
app.use(express.json());

const db = new pg.Client({
    database : "Uber",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();

app.use("/users",router);
app.use("/captain",captainrouter);
app.use("/maps",mapsRouter);
app.use("/ride",ridesRouter);

// app.post("/maps/getCoordinates",(req,res)=>{
//     res.send("Hi");
// })


app.get("/",(req,res)=>{
    res.send("Hello World!");
});

export default app;