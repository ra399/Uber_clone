import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const mapsStore = create((set,get)=>({
    getSuggestions : async (city)=>{
        try {
            let data = await axiosInstance.post('http://localhost:3000/maps/getCoordinates',{city:city});
            return data.data;
        } catch (error) {
            return toast.error("No Nearby Locations");
        }
    },

    getFare : async (Lat1,Lat2,Lng1,Lng2) => {
        try {
            // console.log(Lat1,Lat2,Lng1,Lng2);
            const result = await axiosInstance.post(`http://localhost:3000/maps/getFare`,{Lat1 : Lat1 , Lng1 : Lng1 , Lat2 : Lat2 ,Lng2 : Lng2});    
            console.log(result.data);
            return result.data;
        } catch (error) {
            console.log(error);
            return toast.error("No Rides Available");
        }
    }

}));