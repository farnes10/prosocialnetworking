import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, ICompany, IEmployee } from "./index.types";
interface AuthState {
    loading: boolean;
    currentUser: IUser | null;
    employee: IEmployee | null;
    company: ICompany | null;
}

const initialState: AuthState = {
    loading: false,
    currentUser: null,
    employee: null,
    company: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers:{
        setLoading: (state, action:PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
            state.currentUser = action.payload;

            if (action.payload?.role === 'Employee') {
                state.employee = action.payload as IEmployee;
            } else {
                state.employee = null;
            }

            if (action.payload?.role === 'Company') {
                state.company = action.payload as ICompany;
            } else {
                state.company = null;
            }
        }
    }
})

export const { setLoading, setCurrentUser } = authSlice.actions
export default authSlice.reducer