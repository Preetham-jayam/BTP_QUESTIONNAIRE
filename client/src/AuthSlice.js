import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: localStorage.getItem('btp_user') ? JSON.parse(localStorage.getItem('btp_user')) :null,
        token: localStorage.getItem('btp_token') || null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('btp_user');
            localStorage.removeItem('btp_token');
        },
        updateUser : (state,action)=>{
            state.user=action.payload.user;
            localStorage.setItem('btp_user',JSON.stringify(state.user))
        }
    },
});

export const { login, logout,updateUser } = authSlice.actions;

export default authSlice.reducer;
