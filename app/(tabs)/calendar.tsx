import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchMedicines } from "@/src/redux/medicinesSlice";
import { useRouter } from "expo-router";
import DateStrip from "../components/DateStrip";
import IntakeProgress from "../components/IntakeProgress";

const formatDate = (d: Date) => d.toISOString().split("T")[0];

export default function CalendarScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const medicines = useSelector((s: RootState) => s.medicines.items || []);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  useEffect(() => {
    dispatch(fetchMedicines());
  }, []);

  /* ---------------- FILTER MEDS BY DATE ---------------- */
  const medsForDate = medicines.filter((m: any) =>
    m.schedules?.some((s: any) => {
      if (!s.start_date) return false;
      const start = s.start_date;
      const end = s.end_date || s.start_date;
      return selectedDate >= start && selectedDate <= end;
    })
  );

  const empty = medsForDate.length === 0;

  /* ---------------- INTAKE LOGIC ---------------- */
  const { taken, total } = useMemo(() => {
    // For now: taken = 0 (can be wired later)
    // total = number of doses today
    let totalDoses = 0;

    medsForDate.forEach((m: any) => {
      const sched = m.schedules?.[0];
      totalDoses += sched?.times_with_dose?.length || 0;
    });

    return { taken: 0, total: totalDoses };
  }, [medsForDate]);

  /* ---------------- HELPERS ---------------- */
  const formatFrequency = (schedule: any) => {
    if (!schedule) return null;
    if (schedule.schedule_type === "daily") return "Daily";
    if (schedule.schedule_type === "weekly") return "Weekly";
    if (schedule.schedule_type === "interval")
      return `Every ${schedule.interval_hours} hours`;
    return "Custom";
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.sub}>
            Your medications on{" "}
            <Text style={{ fontWeight: "700" }}>
              {new Date().toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </Text>
        </View>
      </View>

      {/* DATE STRIP */}
      <DateStrip
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      {/* EMPTY STATE */}
      {empty ? (
        <View style={styles.emptyWrap}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.emptyImg}
          />

          <Text style={styles.emptyTitle}>
            You haven't added any medications yet
          </Text>

          <Text style={styles.emptySub}>
            Record your medications to receive timely reminders.
          </Text>

          <TouchableOpacity
            style={styles.addFirstBtn}
            onPress={() => router.push("/(add-medicine)/step1")}
          >
            <Text style={styles.addFirstText}>
              Add First Medication
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
         {/* INTAKES + ADD BUTTON */}
<View style={styles.intakeRow}>
  <IntakeProgress taken={taken} total={total} />

  <TouchableOpacity
    style={styles.addCircleBtn}
    onPress={() => router.push("/(add-medicine)/step1")}
  >
    <Text style={styles.addCircleText}>+</Text>
  </TouchableOpacity>
</View>

          

          {/* MED LIST */}
          <FlatList
            data={medsForDate}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 16 }}
            renderItem={({ item }) => {
              const schedule = item?.schedules?.[0];
              const firstDose =
                schedule?.times_with_dose?.[0];

              const time = firstDose?.time || "--:--";

              const doseText = firstDose
                ? `${firstDose.dose} ${firstDose.unit}`
                : null;

              const secondary =
                item.strength ||
                formatFrequency(schedule);

              const subtitle = [doseText, secondary]
                .filter(Boolean)
                .join(" • ");

              return (
                <View style={styles.medCard}>
                  <View
                    style={[
                      styles.medDot,
                      {
                        backgroundColor:
                          item.color || "#FFD93D",
                      },
                    ]}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.medName}>
                      {item.name}
                    </Text>
                    <Text style={styles.medSub}>
                      {subtitle}
                    </Text>
                  </View>

                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>
                      {time}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
}

/* ---------------- STYLES (UNCHANGED) ---------------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 52,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: { fontSize: 29, fontWeight: "700" },
  sub: {
    color: "#919193",
    marginTop: 33,
    fontWeight: "400",
    fontSize: 14,
  },

  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyImg: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 37,
  },
  emptySub: {
    textAlign: "center",
    color: "#9C9D9D",
    fontWeight: "400",
    fontSize: 19,
    maxWidth: 260,
    marginTop: 4,
  },
  addFirstBtn: {
    backgroundColor: "#3ACCCB",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    marginTop: 22,
  },
  addFirstText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  medCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    
    marginBottom: 12,
  },
  medDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  medName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  medSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  timeBadge: {
    backgroundColor: "#3ACCCB",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  timeText: {
    color: "#FFFFFF",

    fontWeight: "700",
    fontSize: 15,
  },
  intakeRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 8,
  marginBottom: 12,
},

addCircleBtn: {
  width: 48,
  height: 49,
  borderRadius: 24,
  backgroundColor: "#3ACCCB",
  justifyContent:"flex-end",
  alignItems: "center",
  marginLeft: 22,
  marginTop: 310,
},

addCircleText: {
  color: "#fff",
  fontSize: 28,
  fontWeight: "600",
  marginBottom: 6,
},

});
