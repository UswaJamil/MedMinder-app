// src/redux/medicinesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { cancelNotifications } from "@/src/utils/notification";

export const fetchMedicines = createAsyncThunk(
  "medicines/fetchAll",
  async (_, thunkAPI) => {
    const { data: meds, error } = await supabase
      .from("medicines")
      .select("*, schedules(*)")
      .order("created_at", { ascending: false });

    if (error) return thunkAPI.rejectWithValue(error.message);
    return meds;
  }
);

export const updateMedicineStatus = createAsyncThunk(
  "medicines/updateStatus",
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    // If pausing, cancel any scheduled notifications
    if (status === "paused") {
      try {
        // Fetch the medicine with its schedules to get notification IDs
        const { data: med, error: fetchError } = await supabase
          .from("medicines")
          .select("*, schedules(*)")
          .eq("id", id)
          .single();

        if (!fetchError && med?.schedules?.length > 0) {
          const schedule = med.schedules[0];
          const notificationIds = schedule.notification_ids || [];
          
          // Cancel all notifications for this medicine
          if (notificationIds.length > 0) {
            await cancelNotifications(notificationIds);
          }
        }
      } catch {
        // failed to cancel notifications on pause; ignore to avoid console noise
      }
    }

    const { error } = await supabase
      .from("medicines")
      .update({ status })
      .eq("id", id);

    if (error) return thunkAPI.rejectWithValue(error.message);
    return { id, status };
  }
);

interface MedicinesState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicinesState = {
  items: [],
  loading: false,
  error: null,
};

export const medicinesSlice = createSlice({
  name: "medicines",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update status
      .addCase(updateMedicineStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const med = state.items.find((m) => m.id === id);
        if (med) med.status = status;
      });
  },
});

export default medicinesSlice.reducer;
