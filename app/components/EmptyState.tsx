import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

/**
 * Provide an exported PNG illustration at: assets/empty-pills.png
 */

export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Image source={require("../../assets/icons/pill.png")} style={styles.img} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", padding: 28 },
  img: { width: 120, height: 120, resizeMode: "contain", marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "700", color: "#333", marginTop: 6 },
  sub: { color: "#7A7A7A", marginTop: 6, textAlign: "center", maxWidth: 260 },
});
