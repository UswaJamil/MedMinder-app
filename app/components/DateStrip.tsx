import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

/* ---------------------------
   DATE HELPERS (UNCHANGED)
--------------------------- */
const formatDate = (d: Date) => d.toISOString().split("T")[0];

const generateWeek = () => {
  const today = new Date();
  const days = [];

  for (let i = -3; i <= 3; i++) {
    const dt = new Date();
    dt.setDate(today.getDate() + i);

    days.push({
      formatted: formatDate(dt),
      day: dt.getDate(),
      week: dt.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return days;
};

export default function DateStrip({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const days = generateWeek();

  return (
    <View>
      <Text style={styles.todayLabel}>Today</Text>

      {/* HEIGHT-CONSTRAINED STRIP */}
      <View style={styles.stripContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={days}
          keyExtractor={(item) => item.formatted}
          contentContainerStyle={styles.stripContent}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => {
            const active = item.formatted === selectedDate;

            return (
              <View style={styles.dayItem}>
                {/* DATE PILL */}
                <TouchableOpacity
                  style={[
                    styles.dayCard,
                    active && styles.activeCard,
                  ]}
                  onPress={() => onSelect(item.formatted)}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      active && styles.activeDay,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>

                {/* DAY NAME BELOW */}
                <Text
                  style={[
                    styles.week,
                    active && styles.activeWeek,
                  ]}
                >
                  {item.week}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

/* ---------------------------
   STYLES (FIGMA MATCHED)
--------------------------- */
const styles = StyleSheet.create({
  todayLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 11,
    color: "#484848",
  },

  /* STRIP HEIGHT FIX */
  stripContainer: {
    height: 90, // 🔑 prevents large vertical gap
    justifyContent: "flex-start",
  },
  stripContent: {
    alignItems: "flex-start",
    paddingTop: 23,
  },

  dayItem: {
    alignItems: "center",
  },

  dayCard: {
    width: 48,
    height: 48,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCard: {
    backgroundColor: "#30CFCF",
  },

  dayNum: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  activeDay: {
    color: "#fff",
  },

  week: {
    marginTop: 2,
    fontSize: 12,
    color: "#777",
  },
  activeWeek: {
    color: "#30CFCF",
    fontWeight: "600",
  },
});
