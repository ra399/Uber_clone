import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import {createRide} from "../controllers/rides.controller.js"


const ridesRouter = express.Router();

ridesRouter.post("/create",protectRoute,createRide);

export default ridesRouter;