import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function SettingsRow({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.text}>{label}</Text>
      </View>

      <Image
        source={require("../../assets/icons/arrow-right.png")}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 1,
  },
  left: { flexDirection: "row", alignItems: "center" },
  icon: { width: 26, height: 26, resizeMode: "contain", marginRight: 12 },
  text: { fontSize: 15, fontWeight: "600", color: "#333" },
  arrow: { width: 18, height: 18, opacity: 0.4 },
});
