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
    let {firstname,lastname,email,password} = req.body;
    try{
        if(password.length < 6){
            return res.status(400).json({message : "password must be atleast 6 characters"});
        }

        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if(result.rows.length > 0){
            return res.status(400).json({message : "Email already exists"});
        }

        bcrypt.hash(password , 10 , async (err,hash)=>{
            if(err){
                return res.status(400).json({message : "Some Internal Error"});
            }

            let result1 = await db.query("INSERT INTO users (email,firstname,password,lastname) VALUES ($1,$2,$3,$4) RETURNING *",[email,firstname,hash,lastname]);
            
            generateToken(result1.rows[0].id , res);

            return res.status(201).json({
                id : result1.rows[0].id,
                fullName : result1.rows[0].firstname,
                lasrName : result1.rows[0].lastname,
                email : result1.rows[0].email,
            });
        })
    } catch(err){
        console.log("Error in signup controller",err.message);
        res.status(500).json({message : "internal server Error"});
    }
}

export async function login(req,res){
    const { email, password } = req.body;
    console.log(email,password);
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);
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
            return res.status(201).json({
                user : result.rows[0]
            });
            
        })
    } catch (error) {
        console.log("Error in login controller",err.message);
        res.status(500).json({message : "internal server Error"});
    }
}

export function logout(req,res){
    try {
        res.cookie("jwt","",{maxAge : 0});
        res.status(200).json({message : "Logged out Succesfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
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


