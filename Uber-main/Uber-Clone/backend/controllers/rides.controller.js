import pg from 'pg';

const db = new pg.Client({
    database : "Uber",
    password : "Collage@2022",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

db.connect();



export const createRide = async (req,res)=>{
    // console.log("hi");
    const {pickup,destination,type,fare} = req.body;
    // console.log(typeof(pickup),typeof(destination),typeof(type),typeof(fare));
    // return res.send("Hi");
    if(!pickup || !destination || !type){
        return res.json({"Error":"All Feilds are required"});
    }
    try {
        // console.log(req.user);
        const userid = req.user.id;
        const otp = Math.floor(Math.random()*900000 + 100000);
        let result = await db.query("INSERT INTO rides (userid,pickup,destination,fare,otp) values ($1,$2,$3,$4,$5) RETURNING *",[userid,pickup,destination,fare,otp]);
        // console.log(result);
        return res.send(result.rows[0]);
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({"Error":error.message});
    }
}