import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJob } from './index.types';

interface JobState {
    allJobs: IJob[];
    allAppliedJobs: IJob[];
    singleJob: IJob | null;
    searchJobByText: string;
    searchedQuery: string;
}

const initialState: JobState = {
    allJobs: [],
    allAppliedJobs: [],
    singleJob: null,
    searchJobByText: "",
    searchedQuery: ""
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setAllJobs: (state, action: PayloadAction<IJob[]>) => {
            state.allJobs = action.payload;
        },
        setAllAppliedJobs: (state, action: PayloadAction<IJob[]>) => {
            state.allAppliedJobs = action.payload;
        },
        setSingleJob: (state, action: PayloadAction<IJob | null>) => {
            state.singleJob = action.payload;
        },
        setSearchJobByText: (state, action: PayloadAction<string>) => {
            state.searchJobByText = action.payload;
        },
        setSearchedQuery: (state, action: PayloadAction<string>) => {
            state.searchedQuery = action.payload;
        }
    }
});

export const { setAllJobs, setAllAppliedJobs, setSearchedQuery, setSearchJobByText, setSingleJob } = jobSlice.actions;
export default jobSlice.reducer;