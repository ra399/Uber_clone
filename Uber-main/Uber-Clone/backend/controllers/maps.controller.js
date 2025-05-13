import axios  from 'axios';



export const getCoordinates = async (req,res)=>{
    // console.log(req.body.city);
    const city = req.body.city;
    // console.log(city);
    // return {"message" : "Hi"};
    try {
        const result = await axios.get(`https://nominatim.openstreetmap.org/search?q=${city}&format=json`);
        // return res.send("hi");
        const data = result.data;
        const nearbyAreas = [];
        data.forEach(element => {
            nearbyAreas.push({
                "lattitude" : element.lat,
                "longitude" : element.lon,
                "name" : element.name,
                "display_name" : element.display_name
            })
        });
        // console.log(data);
        return res.send(nearbyAreas);
    } catch (error) {
        return res.json({"Error in Fetching Coordinates":error?.message});
    }
    res.send("Hello");
}

export const getFare = async (req,res) => {
    console.log("Hello From Backend");
    const {Lat1,Lng1,Lat2,Lng2} = req.body;
    console.log(Lat1,Lng1,Lat2,Lng2);
    try {
        let result = await axios.get(`http://router.project-osrm.org/route/v1/driving/${Lng1},${Lat1};${Lng2},${Lat2}`);
        // console.log(result);
        // console.log(result.data.routes[0].duration);
        const distance = (result.data.routes[0].distance);
        const time = (result.data.routes[0].duration);
        console.log(distance,time);
        const baseFare = {
            auto: 30,
            car: 50,
            moto: 20
        };
    
        const perKmRate = {
            auto: 10,
            car: 15,
            moto: 8
        };
    
        const perMinuteRate = {
            auto: 2,
            car: 3,
            moto: 1.5
        };
    
        const fare = {
            auto: Math.round(baseFare.auto + ((distance / 1000) * perKmRate.auto) + ((time / 60) * perMinuteRate.auto)),
            car: Math.round(baseFare.car + ((distance / 1000) * perKmRate.car) + ((time / 60) * perMinuteRate.car)),
            moto: Math.round(baseFare.moto + ((distance / 1000) * perKmRate.moto) + ((time / 60) * perMinuteRate.moto))
        };

        console.log(fare);

        return res.status(200).json(fare);

    }   catch (error)   {
        res.status(404).send("Error");
        console.log(error);
    }
}