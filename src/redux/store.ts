import { configureStore } from "@reduxjs/toolkit";
import medicinesReducer from "./medicinesSlice";
import { api } from "../services/api.config";

export const store = configureStore({
  reducer: {
    medicines: medicinesReducer,   // ⬅️ NEW
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
