import { createSlice } from "@reduxjs/toolkit";


interface POST{
    _id: string,
    authorID: string,
    author: string,
    content: string,
    likes: [string]
   
}

interface PostState{
    postState: [POST] | null
}

const initialState: PostState = {
   postState : null
}

export const postSlice = createSlice({
    name:'post',
    initialState,
    reducers:{
        postProb:(state, action) =>{
          state.postState = action.payload
            
        }
    }
})

export const {postProb} = postSlice.actions
export default postSlice.reducer