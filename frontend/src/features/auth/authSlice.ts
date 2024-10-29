import { createSlice } from "@reduxjs/toolkit";

interface User{
    _id: string
    username: string,
    email: string,
    createdAt: string
    bio:string,
    profilePic:string
  }

  interface AuthState{
    status: boolean,
    userInfo: User | null
  }

const initialState:AuthState = {
  status: false,
  userInfo: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        login: (state, action) =>{
            state.status = true,
            state.userInfo = action.payload
            // console.log("authSlice::" ,state.userInfo);
            
        },
        logout: (state) => {
            state.status = false,
            state.userInfo = null
        }
    }
});

export const {login, logout} = authSlice.actions

export default authSlice.reducer
