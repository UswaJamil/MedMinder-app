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
            source={require("../../assets/icons/intake-pill.png")}
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
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 50,
    marginTop: 38,
    color: "#333",
  },

  circleWrap: {
    alignItems: "center",
  },

  circle: {
    width: 220,
    height: 220,
    borderRadius: 115,
    borderWidth: 12,
    borderColor: "#E6FBF9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6FBF9",
  },

  pillImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
    
  },

  circleMain: {
    fontSize: 40,
    fontWeight: "700",
    color: "#78D1D3",
  },

  dayInside: {
    marginTop: 30,
    fontSize: 15,
    color: "#B8B8B8",
    fontWeight: "700",
  },
});
