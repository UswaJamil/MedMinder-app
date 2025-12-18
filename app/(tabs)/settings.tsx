import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SettingsRow from "../components/SettingsRow";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>

      
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={require("../../assets/icons/profile.png")}
          style={styles.profileImg}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>My profile</Text>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SETTINGS LIST */}
      <SettingsRow
        icon={require("../../assets/icons/security.png")}
        label="Security Options"
        onPress={() => {}}
      />

      <SettingsRow
        icon={require("../../assets/icons/alarm.png")}
        label="Alarm Settings"
        onPress={() => {}}
      />

      <SettingsRow
        icon={require("../../assets/icons/theme.png")}
        label="Theme"
        onPress={() => {}}
      />

      <SettingsRow
        icon={require("../../assets/icons/health.png")}
        label="Alarm Health Check"
        onPress={() => {}}
      />

      <SettingsRow
        icon={require("../../assets/icons/support.png")}
        label="Support"
        onPress={() => {}}
      />

      <SettingsRow
        icon={require("../../assets/icons/share.png")}
        label="Tell a friend"
        onPress={() => {}}
      />

      <SettingsRow
        icon={require("../../assets/icons/terms.png")}
        label="Terms of Service"
        onPress={() => {}}
      />

      {/* FOOTER */}
      <Text style={styles.version}>Version 1.2.9</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20 },

  header: {
   marginTop: 26,
    marginBottom: 18,
  },

  title: { fontSize: 38, fontWeight: "700" },

 

  /* Profile Card */
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 1,
  },

  profileImg: { width: 50, height: 50, borderRadius: 25, marginRight: 14 },

  profileName: { fontSize: 17, fontWeight: "700" },

  editText: {
    color: "#30CFCF",
    marginTop: 4,
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
