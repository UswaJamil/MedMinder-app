import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

/**
 * Circular intake progress (Figma matched)
 * Pill icon + taken/total + day name INSIDE circle
 */
export default function IntakeProgress({
  taken,
  total,
}: {
  taken: number;
  total: number;
}) {
  const dayName = new Date().toLocaleDateString(undefined, {
    weekday: "long",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intakes</Text>

      <View style={styles.circleWrap}>
        <View style={styles.circle}>
          {/* PILL IMAGE */}
          <Image
            source={require("../../assets/icons/pill.png")}
            style={styles.pillImage}
          />

          {/* COUNT */}
          <Text style={styles.circleMain}>
            {taken}/{total}
          </Text>

          {/* DAY NAME (INSIDE CIRCLE) */}
          <Text style={styles.dayInside}>
            {dayName}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },

  circleWrap: {
    alignItems: "center",
  },

  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: "#E6FBF9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  pillImage: {
    width: 26,
    height: 26,
    resizeMode: "contain",
    marginBottom: 6,
  },

  circleMain: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E2E2E",
  },

  dayInside: {
    marginTop: 4,
    fontSize: 13,
    color: "#9C9D9D",
    fontWeight: "500",
  },
});
