import express from "express";
import {getCoordinates,getFare} from "../controllers/maps.controller.js";

const mapsRouter = express.Router();

mapsRouter.post("/getCoordinates",getCoordinates);
mapsRouter.post("/getFare",getFare);

export default mapsRouter;