import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/icons/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>My Profile</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* PROFILE AVATAR */}
      <View style={styles.avatarWrap}>
        <Image
          source={require("../assets/icons/profile.png")}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarBtn}>
          <Text style={styles.editAvatarText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Your name"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    padding: 20,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },

  /* Avatar */
  avatarWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E6EAEA",
  },
  editAvatarBtn: {
    marginTop: 8,
  },
  editAvatarText: {
    color: "#30CFCF",
    fontWeight: "600",
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    elevation: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F2F4F5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#000",
  },

  /* Button */
  saveBtn: {
    backgroundColor: "#30CFCF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
