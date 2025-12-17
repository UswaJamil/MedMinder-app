import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import {
  fetchMedicines,
  updateMedicineStatus,
} from "@/src/redux/medicinesSlice";
import DateStrip from "../components/DateStrip";

type TabType = "active" | "paused" | "archived";

export default function MyMedicationsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const medicines = useSelector((s: RootState) => s.medicines.items || []);

  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    dispatch(fetchMedicines());
  }, []);

  /* ---------------- COUNTS ---------------- */
  const counts = useMemo(() => {
    return {
      active: medicines.filter((m) => m.status === "active").length,
      paused: medicines.filter((m) => m.status === "paused").length,
      archived: medicines.filter((m) => m.status === "archived").length,
    };
  }, [medicines]);

  const filteredMeds = medicines.filter(
    (m) => m.status === activeTab
  );

  /* ---------------- HELPERS ---------------- */
  const formatFrequency = (schedule: any) => {
    if (!schedule) return null;

    if (schedule.schedule_type === "daily") return "Daily";
    if (schedule.schedule_type === "weekly") return "Weekly";
    if (schedule.schedule_type === "interval")
      return `Every ${schedule.interval_hours} hours`;

    return "Custom";
  };

  /* ---------------- RENDER MED CARD ---------------- */
  const renderMedicine = ({ item }: any) => {
    const schedule = item?.schedules?.[0];
    const firstDose = schedule?.times_with_dose?.[0];

    // ✅ TIME
    const time = firstDose?.time ?? "--:--";

    // ✅ DOSE
    const doseText = firstDose
      ? `${firstDose.dose} ${firstDose.unit}`
      : null;

    // ✅ SECOND LINE: strength OR frequency
    const secondaryText =
      item.strength ||
      formatFrequency(schedule);

    const subtitle = [doseText, secondaryText]
      .filter(Boolean)
      .join(" · ");

    return (
      <View style={styles.medCard}>
        <View style={styles.topRow}>
          <View style={styles.leftRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: item.color || "#FFD93D" },
              ]}
            />
            <View>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medSub}>{subtitle}</Text>
            </View>
          </View>

          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          {item.status === "active" && (
            <>
              <TouchableOpacity
                style={styles.pauseBtn}
                onPress={() =>
                  dispatch(
                    updateMedicineStatus({
                      id: item.id,
                      status: "paused",
                    })
                  )
                }
              >
                <Text style={styles.pauseText}>Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.archiveBtn}
                onPress={() =>
                  dispatch(
                    updateMedicineStatus({
                      id: item.id,
                      status: "archived",
                    })
                  )
                }
              >
                <Text style={styles.archiveText}>Archive</Text>
              </TouchableOpacity>
            </>
          )}

          {(item.status === "paused" ||
            item.status === "archived") && (
            <TouchableOpacity
              style={styles.resumeBtn}
              onPress={() =>
                dispatch(
                  updateMedicineStatus({
                    id: item.id,
                    status: "active",
                  })
                )
              }
            >
              <Text style={styles.resumeText}>Resume</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.logoWrap}>
        <Image
          source={require("../../assets/icons/pill.png")}
          style={{ width: 22, height: 22 }}
        />
        <Text style={styles.logoText}>MedMinder</Text>
      </View>

      <Text style={styles.title}>My Medications</Text>

      <View style={styles.tabRow}>
        {(["active", "paused", "archived"] as TabType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tabBtn,
              activeTab === t && styles.tabActive,
            ]}
            onPress={() => setActiveTab(t)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === t && styles.tabTextActive,
              ]}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}{" "}
              {counts[t].toString().padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredMeds.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Image
            source={require("../../assets/icons/pill.png")}
            style={styles.emptyImg}
          />
          <Text style={styles.emptyText}>Nothing here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMeds}
          keyExtractor={(item) => item.id}
          renderItem={renderMedicine}
          contentContainerStyle={{ paddingTop: 12 }}
        />
      )}
    </View>
  );
}

/* ---------------- STYLES (UNCHANGED) ---------------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", padding: 20 },
  logoWrap: { alignItems: "center", marginBottom: 6 },
  logoText: { color: "#30CFCF", fontWeight: "700", marginTop: 2 },
  title: { fontSize: 26, fontWeight: "800", marginVertical: 12 },
  tabRow: { flexDirection: "row", marginBottom: 16 },
  tabBtn: {
    backgroundColor: "#F2F4F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginRight: 10,
  },
  tabActive: { backgroundColor: "#30CFCF" },
  tabText: { fontWeight: "700", color: "#444" },
  tabTextActive: { color: "#fff" },
  emptyWrap: { alignItems: "center", marginTop: 80 },
  emptyImg: { width: 120, height: 120, resizeMode: "contain", opacity: 0.6 },
  emptyText: { fontSize: 18, fontWeight: "700", marginTop: 16 },
  medCard: {
    backgroundColor: "#F9FDFD",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  leftRow: { flexDirection: "row", flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 6 },
  medName: { fontSize: 16, fontWeight: "700" },
  medSub: { fontSize: 13, color: "#777", marginTop: 4 },
  timeBadge: {
    backgroundColor: "#E8FBFA",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  timeText: { color: "#14B8A6", fontWeight: "700" },
  actionRow: { flexDirection: "row", marginTop: 14 },
  pauseBtn: {
    backgroundColor: "#EEF1F4",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
  },
  pauseText: { fontWeight: "600" },
  archiveBtn: {
    backgroundColor: "#FDECEC",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  archiveText: { color: "#E74C3C", fontWeight: "600" },
  resumeBtn: {
    backgroundColor: "#E8FBFA",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  resumeText: { color: "#14B8A6", fontWeight: "700" },
});
