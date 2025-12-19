// services/api.ts
import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../lib/supabase";

// -------------------
//  Types
// -------------------

export type MedicineStatus = "active" | "paused" | "archived";

export interface Medicine {
  id: string;
  name: string;
  dosage: string | null;
  photo_url: string | null;
  status: MedicineStatus;
  created_at: string;
}

// Query args
type SupabaseBaseQueryArgs = {
  method: "GET" | "POST" | "PATCH";
  body?: any;
};

type SupabaseError = { message: string };

// Base query result type
// SupabaseBaseQueryResult type removed (unused)

// -------------------
//  Base Query
// -------------------

const supabaseBaseQuery: BaseQueryFn<
  SupabaseBaseQueryArgs,
  unknown,
  SupabaseError
> = async ({ method, body }) => {
  try {
    // GET ALL MEDICINES
    if (method === "GET") {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data };
    }

    // CREATE NEW MEDICINE
    if (method === "POST") {
      const { data, error } = await supabase
        .from("medicines")
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      return { data };
    }

    // UPDATE MEDICINE
    if (method === "PATCH") {
      const { data, error } = await supabase
        .from("medicines")
        .update(body)
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;
      return { data };
    }

    return { data: null };
  } catch (err: any) {
    return { error: { message: err.message ?? "Unknown error" } };
  }
};

// -------------------
//  RTK Query API
// -------------------

export const api = createApi({
  reducerPath: "api",
  baseQuery: supabaseBaseQuery,
  tagTypes: ["Medicine"],

  endpoints: (builder) => ({
    getMedicines: builder.query<Medicine[], void>({
      query: () => ({ method: "GET" }),
      providesTags: ["Medicine"],
    }),

    addMedicine: builder.mutation<Medicine, Partial<Medicine>>({
      query: (medicine) => ({
        method: "POST",
        body: medicine,
      }),
      invalidatesTags: ["Medicine"],
    }),

    updateMedicineStatus: builder.mutation<
      Medicine,
      { id: string; status: MedicineStatus }
    >({
      query: ({ id, status }) => ({
        method: "PATCH",
        body: { id, status },
      }),
      invalidatesTags: ["Medicine"],
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetMedicinesQuery,
  useAddMedicineMutation,
  useUpdateMedicineStatusMutation,
} = api;
