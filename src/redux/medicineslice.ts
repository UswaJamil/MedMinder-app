// redux/medicine/medicineSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeSlot {
  time: string;
  dose: string;
  unit: string;
}

interface Timeframe {
  start: string; // ISO date string
  end: string;   // ISO date string
}

interface Schedule {
  frequency: "daily" | "interval" | "weekly" | "custom";
  intervalHours?: number;
  weeklyDays: string[];
  timeSlots: TimeSlot[];
  timeframes: Timeframe[];
}

interface MedicineState {
  name: string;
  type: string;
  strength: string;
  schedule: Schedule;
  notes: string;
  color: string;
}

const initialState: MedicineState = {
  name: "",
  type: "",
  strength: "",
  schedule: {
    frequency: "daily",
    intervalHours: 8,
    weeklyDays: [],
    timeSlots: [{ time: "09:00", dose: "1", unit: "tablet" }],
    timeframes: [],
  },
  notes: "",
  color: "#FFD93D",
};

export const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {
    setMedicineInfo: (state, action: PayloadAction<{ name?: string; type?: string; strength?: string }>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.type) state.type = action.payload.type;
      if (action.payload.strength) state.strength = action.payload.strength;
    },
    setSchedule: (state, action: PayloadAction<Partial<Schedule>>) => {
      state.schedule = { ...state.schedule, ...action.payload };
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    resetMedicine: () => initialState,
  },
});

export const { setMedicineInfo, setSchedule, setNotes, setColor, resetMedicine } = medicineSlice.actions;

export default medicineSlice.reducer;
