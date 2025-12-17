import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * item expects:
 *  { id, name, strength, color, schedules: [{ times: ["09:00"] }], status }
 *
 * onPressTime optional - invoked when user taps the time badge
 */

export default function MedicineCard({
  item,
  onPause,
  onArchive,
  onResume,
}: {
  item: any;
  onPause?: (id: string) => void;
  onArchive?: (id: string) => void;
  onResume?: (id: string) => void;
}) {
  const time = item?.schedules?.[0]?.times?.[0] || "";

  return (
    <View style={styles.card}>
      <View style={[styles.dot, { backgroundColor: item.color || "#9B9B9B" }]} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.strength || ""}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity style={styles.timeBadge}>
          <Text style={styles.timeText}>{time}</Text>
        </TouchableOpacity>

        {/* Small action row */}
        <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
          {item.status === "active" && (
            <>
              <TouchableOpacity onPress={() => onPause?.(item.id)}>
                <Text style={styles.actionOrange}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onArchive?.(item.id)}>
                <Text style={styles.actionRed}>Archive</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === "paused" && (
            <TouchableOpacity onPress={() => onResume?.(item.id)}>
              <Text style={styles.actionPrimary}>Resume</Text>
            </TouchableOpacity>
          )}

          {item.status === "archived" && <Text style={styles.archivedLabel}>Archived</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    // subtle shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // elevation for Android
    elevation: 2,
  },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  meta: { fontSize: 13, color: "#7A7A7A", marginTop: 4 },
  timeBadge: {
    backgroundColor: "#E8FBFA",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  timeText: { color: "#0FAFA9", fontWeight: "700" },

  actionOrange: { color: "#FF9500", fontWeight: "700", fontSize: 12 },
  actionRed: { color: "#FF3B30", fontWeight: "700", fontSize: 12 },
  actionPrimary: { color: "#30CFCF", fontWeight: "700", fontSize: 12 },
  archivedLabel: { color: "#9A9A9A", fontSize: 12 },
});
