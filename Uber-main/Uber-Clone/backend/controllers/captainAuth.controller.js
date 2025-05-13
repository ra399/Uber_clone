import pg from "pg";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";

const db = new pg.Client({
    database : "Uber",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();

export const signup = async (req,res) => {
    let {firstname,lastname,email,password,status,vehicalColour,vehicalPlate,vehicalCapacity,vehicalType,longitude,lattitude} = req.body;
    console.log(firstname,lastname,email,password,status,vehicalColour,vehicalPlate,vehicalCapacity,vehicalType,longitude,lattitude);
    try{
        if(!firstname || !email || !password || !vehicalColour || !vehicalPlate || !vehicalCapacity || !vehicalType ){
            return res.status(400).json({message : "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "password must be atleast 6 characters"});
        }

        const result = await db.query("SELECT * FROM captains WHERE email = $1",[email]);

        if(result.rows.length > 0){
            return res.status(400).json({message : "Email already exists"});
        }

        bcrypt.hash(password , 10 , async (err,hash)=>{
            if(err){
                return res.status(400).json({message : "Some Internal Error"});
            }

            let result1 = await db.query("INSERT INTO captains (email,firstname,password,lastname,status,vehicalColor,vehicalPlate,vehicalCapacity,vehicalType,longitude,lattitude) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",[email,firstname,hash,lastname,status,vehicalColour,vehicalPlate,vehicalCapacity,vehicalType,longitude,lattitude]);
            
            generateToken(result1.rows[0].id , res);

            return res.status(201).json(result1.rows[0]);
        })
    } catch(err){
        console.log("Error in captain signup controller",err.message);
        res.status(500).json({message : "internal server Error"});
    }
}

export async function login(req,res){
    const { email, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM captains WHERE email = $1",[email]);
        if(result.rows.length === 0){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        bcrypt.compare(password , result.rows[0].password , (err,same)=>{
            if(err){
                console.log(err.message);
                return res.status(500).json({ message: "Internal Server Error in comparing passwords" });
            }
            if(!same){
                return res.status(400).json({ message: "Invalid credentials" });
            }
            
            generateToken(result.rows[0].id , res);
            return res.status(201).json(result.rows[0]);
        })
    } catch (error) {
        console.log("Error in captain login controller",err.message);
        res.status(500).json({message : "internal server Error"});
    }
}

export function logout(req,res){
    try {
        res.cookie("jwt","",{maxAge : 0});
        res.status(200).json({message : "Logged out Succesfully"});
    } catch (error) {
        console.log("Error in Captain logout controller",error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function updateProfile(req,res){
    try {
        const {profilePic} = req.body;
        const userid = req.user.id;
        if(!profilePic){
            return res.status(400).json({message : "No profile pic uploaded"});
        }
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await db.query("UPDATE users SET profilepic = $1 WHERE id = $2 RETURNING *",[uploadedResponse.secure_url,userid]);
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.log("error in updating profile",error);
        res.status(500).json({message : "Internal server Error"});
    }
}

export async function checkAuth(req,res) {
    try{
        res.status(200).json(req.user);
    } catch (err){
        res.status(500).json({message : "Internal Server Error in checkAuth"});
    }
}


