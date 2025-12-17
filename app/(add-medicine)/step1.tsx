import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPES = [
  { key: "tablet", label: "Tablet", icon: require("../../assets/icons/tablet.png") },
  { key: "capsule", label: "Capsule", icon: require("../../assets/icons/capsule.png") },
  { key: "liquid", label: "Liquid", icon: require("../../assets/icons/liquid.png") },
  { key: "injection", label: "Injection", icon: require("../../assets/icons/injection.png") },
  { key: "drop", label: "Drop", icon: require("../../assets/icons/drop.png") },
  { key: "other", label: "Other", icon: require("../../assets/icons/other.png") },
];

export default function Step1Screen() {
  const router = useRouter();

  const [medName, setMedName] = useState("");
  const [medType, setMedType] = useState<string>("capsule");

  const goNext = () => {
    if (!medName.trim()) return;

    router.push({
      pathname: "/(add-medicine)/step2",
      params: {
        medName: medName.trim(),
        medType, // normalized, lowercase
      },
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Add medication</Text>

      {/* Medication type */}
      <Text style={styles.sectionLabel}>Medication type</Text>

      <View style={styles.grid}>
        {TYPES.map((t) => {
          const active = medType === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.typeItem}
              onPress={() => setMedType(t.key)}
            >
              <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
                <Image source={t.icon} style={styles.icon} />
              </View>
              <Text style={styles.typeLabel}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Medication name */}
      <TextInput
        style={styles.input}
        placeholder="Medication Name & Strengths"
        placeholderTextColor="#999"
        value={medName}
        onChangeText={setMedName}
        multiline
      />

      <Text style={styles.helperText}>
        Medication strengths are usually written on the medication packaging.
        For example: Atorvastatin 10 mg
      </Text>

      {/* Next */}
      <TouchableOpacity
        style={[styles.nextBtn, !medName && styles.nextBtnDisabled]}
        onPress={goNext}
        disabled={!medName}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 38,
    marginTop: 90,
  },

  sectionLabel: {
    fontSize: 19,
    fontWeight: "700",
    color: "#404040",
    marginBottom: 28,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  typeItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 22,
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 28,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  iconCircleActive: {
    backgroundColor: "#E6FBFA",
    borderWidth: 2,
    borderColor: "#30CFCF",
  },

  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  typeLabel: {
    fontSize: 12,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    minHeight: 56,
    marginBottom: 10,
  },

  helperText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 30,
  },

  nextBtn: {
    backgroundColor: "#30CFCF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  nextBtnDisabled: {
    opacity: 0.4,
  },

  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  cancel: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },
});
