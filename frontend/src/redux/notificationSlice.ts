import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "./index.types";

interface NotificationState {
    notifications: INotification[];
}

const initialState: NotificationState = {
    notifications: []
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<INotification[]>) => {
            state.notifications = action.payload;
        }
    }
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;