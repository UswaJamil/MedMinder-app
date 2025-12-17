import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";

/* ---------------- ICONS ---------------- */
const DownArrowIcon = require("../../assets/icons/arrow-down.png");
const WatchIcon = require("../../assets/icons/watch.png");

/* ---------------- OPTIONS ---------------- */
const frequencyOptions = [
  { label: "Daily", value: "daily" },
  { label: "Every X hours", value: "every_x_hours" },
  { label: "Weekly", value: "weekly" },
  { label: "Custom", value: "custom" },
];

const unitOptions = [
  { label: "Tablet", value: "tablet" },
  { label: "Capsule", value: "capsule" },
  { label: "Liquid", value: "liquid" },
  { label: "Injection", value: "injection" },
  { label: "Drop", value: "drop" },
];

/* ---------------- HELPERS ---------------- */
const pad = (n: number) => n.toString().padStart(2, "0");
const formatTimeHHmm = (d?: Date | null) =>
  d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "";

const formatDateFriendly = (d?: Date | null) =>
  d
    ? d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Select date";

/* ---------------- SCREEN ---------------- */
export default function Step2Screen() {
  const router = useRouter();
  const params = useLocalSearchParams() as any;

  /* ---------- STATE ---------- */
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date | null>(null);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showTimePickerIndex, setShowTimePickerIndex] =
    useState<number | null>(null);

  const [frequency, setFrequency] = useState<string>("");
  const [intervalHours, setIntervalHours] = useState(8);

  const [times, setTimes] = useState([
    { time: null as Date | null, dose: "", unit: "" },
  ]);

  /* ---------- FUNCTIONS ---------- */
  const updateTime = (i: number, field: string, value: any) => {
    const copy = [...times];
    copy[i] = { ...copy[i], [field]: value };
    setTimes(copy);
  };

  const addTime = () =>
    setTimes([...times, { time: null, dose: "", unit: "" }]);

  const isValid =
    frequency &&
    times.every((t) => t.time && t.dose && t.unit);

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add medication</Text>
          <Text style={styles.medicineName}>{params?.medName}</Text>

          {/* TIMEFRAME */}
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowFromPicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDateFriendly(fromDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowToPicker(true)}
            >
              <Text
                style={[
                  styles.dateText,
                  !toDate && styles.placeholder,
                ]}
              >
                {formatDateFriendly(toDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              onChange={(_, d) => {
                setShowFromPicker(false);
                if (d) setFromDate(d);
              }}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={toDate || new Date()}
              mode="date"
              onChange={(_, d) => {
                setShowToPicker(false);
                if (d) setToDate(d);
              }}
            />
          )}

          {/* FREQUENCY */}
          <RNPickerSelect
            value={frequency}
            onValueChange={(v) => setFrequency(v)}
            placeholder={{ label: "Frequency", value: "" }}
            items={frequencyOptions}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />

          {/* TIME / DOSE / UNIT */}
          {times.map((t, i) => (
            <View key={i} style={styles.timeRow}>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setShowTimePickerIndex(i)}
              >
                <Text
                  style={[
                    styles.timeText,
                    !t.time && styles.placeholder,
                  ]}
                >
                  {t.time ? formatTimeHHmm(t.time) : "Time"}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={styles.doseInput}
                placeholder="Dose"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={t.dose}
                onChangeText={(v) => updateTime(i, "dose", v)}
              />

              <View style={styles.unitPickerWrapper}>
                <RNPickerSelect
                  value={t.unit}
                  onValueChange={(v) => updateTime(i, "unit", v)}
                  placeholder={{ label: "Unit", value: "" }}
                  items={unitOptions}
                  style={pickerSelectSmallStyles}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Image
                      source={DownArrowIcon}
                      style={styles.downArrowSmall}
                    />
                  )}
                />
              </View>

              {showTimePickerIndex === i && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour
                  onChange={(_, d) => {
                    setShowTimePickerIndex(null);
                    if (d) updateTime(i, "time", d);
                  }}
                />
              )}
            </View>
          ))}

          {/* ADD TIME */}
          <TouchableOpacity style={styles.addTimeBtn} onPress={addTime}>
            <Image source={WatchIcon} style={styles.watchIcon} />
            <Text style={styles.addTimeText}>Add time</Text>
          </TouchableOpacity>

          {/* NEXT */}
          <TouchableOpacity
            style={[styles.nextBtn, !isValid && { opacity: 0.5 }]}
            disabled={!isValid}
            onPress={() => {
              router.push({
                pathname: "/(add-medicine)/review",
                params: {
                  medName: params.medName,
                  medType: params.medType, // ✅ FIX
                  strength: params.strength,
                  schedule: JSON.stringify({
                    frequency,
                    start_date: fromDate.toISOString(),
                    end_date: toDate?.toISOString() ?? null,
                    intervalHours,
                    times_with_dose: times.map((t) => ({
                      time: formatTimeHHmm(t.time),
                      dose: t.dose,
                      unit: t.unit,
                    })),
                  }),
                },
              });
            }}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>

          <Text style={styles.cancelText}>Cancel</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === Styles (kept visually consistent with your pasted design) ===
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
    marginBottom: 4,
    color: "#000",
  },
  medicineName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: "#FAFAFA",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    color: "#B0B0B0",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#000",
  },
  doseInput: {
    width: 60,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginRight: 10,
    textAlign: "center",
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FAFAFA",
  },
  unitPickerWrapper: {
    width: 110,
    marginRight: 10,
  },
  removeText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 14,
  },

  addTimeBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30CFCF",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 24,
    justifyContent: "center",
    backgroundColor: "#E0F7F7",
  },
  watchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#30CFCF",
  },
  addTimeText: {
    color: "#30CFCF",
    fontWeight: "700",
    fontSize: 16,
  },

  nextBtn: {
    backgroundColor: "#30CFCF",
    borderRadius: 30,
    paddingVertical: 16,
    marginTop: 32,
    marginBottom: 16,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  cancelText: {
    textAlign: "center",
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 24,
  },

  downArrowSmall: {
    width: 14,
    height: 14,
    tintColor: "#999",
  },

  // small chips (used in interval UI)
  smallChip: { padding: 8, backgroundColor: "#FAFAFA", borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: "#E8ECEF" },
  smallChipActive: { backgroundColor: "#E8FBFB", borderColor: "#30CFCF" },
  smallChipText: { color: "#666" },
  smallChipTextActive: { color: "#30CFCF", fontWeight: "700" },

  dayChip: { padding: 8, backgroundColor: "#FAFAFA", borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: "#E8ECEF", marginTop: 8 },
  dayChipActive: { backgroundColor: "#E8FBFB", borderColor: "#30CFCF" },
  dayChipText: { color: "#666" },
  dayChipTextActive: { color: "#30CFCF", fontWeight: "700" },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    color: "#000",
    backgroundColor: "#FAFAFA",
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    color: "#000",
    backgroundColor: "#FAFAFA",
    paddingRight: 30,
    marginBottom: 16,
  },
});

const pickerSelectSmallStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    color: "#000",
    backgroundColor: "#FAFAFA",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    color: "#000",
    backgroundColor: "#FAFAFA",
    paddingRight: 30,
  },
});
