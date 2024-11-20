import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IApplication } from "./index.types";// Make sure to define this type

interface ApplicationState {
    applicantions: IApplication[] | null;
}

const initialState: ApplicationState = {
    applicantions: null
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setApplications: (state, action: PayloadAction<IApplication[] | null>) => {
            state.applicantions = action.payload;
        }
    }
});

export const { setApplications } = applicationSlice.actions;
export default applicationSlice.reducer;