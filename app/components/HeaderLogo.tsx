import { View, Text, Image, StyleSheet } from "react-native";

export default function HeaderLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icons/logo-pill.png")} // adjust if needed
        style={styles.icon}
      />
      <Text style={styles.text}>MedMinder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
    resizeMode: "contain",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#30CFCF",
  },
});
