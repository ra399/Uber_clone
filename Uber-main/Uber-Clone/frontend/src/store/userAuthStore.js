import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const userAuthStore = create((set,get)=>({
    authUser : null,
    isSiginingUp : false,
    isLoggingIn : false,
    isCheckingAuth : true,
    

    checkAuth : async() => {
      try {
        const res = await axiosInstance.get("/users/check");
        // console.log("result after chcking user",res);
        // console.log("from check Auth:",res);
        set({authUser : res.data});
      } catch (error) {
        console.log({authUser : error.data});
        set({authUser : null});
      } finally {
        set({isCheckingAuth : false});
      }
    },


    signup : async(data) => {
      set({isSiginingUp : true});
      try{          
        const res = await axiosInstance.post("/users/signup",data);
        set({authUser : res.data});
        toast.success("Account created successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({isSiginingUp : false});
      }
    },

   

    logout : async() => {
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser : null});
        toast.success("Logged out Succesfully");
        get().disconnectSocket();
      } catch(err) {
        toast.error(err.response.data.message);
      }
    },

    login: async (userData) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post(`/users/login`, userData)
            console.log(response);
            set({ authUser: response.data.user }); 
            // console.log(authUser);           
            toast.success("Succesfully logged in");
        } catch (error) {
            console.log("Error in submit handler in users login",error);
            toast.error(error.response?.data?.message || "Invalid Credentials");
        } finally {
          set({ isLoggingIn: false });
        }
    },


    updateProfile: async (data) => {
        // console.log("I am inside update profile in authstore");
        console.log(data);
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io("http://localhost:5001", {
          query: {
            userId: authUser.id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
        
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
       
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },      
}));