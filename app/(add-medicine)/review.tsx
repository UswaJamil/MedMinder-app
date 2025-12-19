

import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import {
  scheduleDailyReminder,
  scheduleIntervalReminder,
} from "../../src/utils/notification";

/* ---------------- HELPERS ---------------- */
const monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDateFriendly = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${monthsShort[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as any;

  const medName = params?.medName ?? "";
  const medType = params?.medType ?? "";
  const strength = params?.strength ?? "";
  const scheduleJson = params?.schedule ?? "{}";

  let schedule: any = {};
  try {
    schedule = JSON.parse(scheduleJson);
  } catch {
    schedule = {};
  }

  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("#FFD93D");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- IMAGE PICKER ---------------- */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  /* ---------------- SAVE ---------------- */
  const save = async () => {
    if (loading) return;

    if (!medType) {
      Alert.alert("Error", "Medicine type is missing");
      return;
    }

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("User not logged in");

      let photo_url: string | null = null;

      if (photoUri) {
        const blob = await (await fetch(photoUri)).blob();
        const fileName = `${userId}/${Date.now()}.jpg`;

        await supabase.storage
          .from("med-photos")
          .upload(fileName, blob, { upsert: true });

        photo_url = supabase.storage
          .from("med-photos")
          .getPublicUrl(fileName).data.publicUrl;
      }

      const { data: medData, error: medError } = await supabase
        .from("medicines")
        .insert({
          user_id: userId,
          name: medName,
          type: medType.toLowerCase(), // ✅ FIX
          strength,
          status: "active",
          notes,
          color,
          photo_url,
        })
        .select()
        .single();

      if (medError) throw medError;

     const { error: schedError } = await supabase.from("schedules").insert({
  medicine_id: medData.id,
  schedule_type: schedule.frequency,
  start_date: schedule.start_date,
  end_date: schedule.end_date,
  times_with_dose: schedule.times_with_dose,
  interval_hours: schedule.intervalHours || null,
  weekdays: schedule.weeklyDays || [],
});

if (schedError) throw schedError;

      // Schedule local notifications AFTER successful DB save and collect IDs
      try {
        const notificationIds: string[] = [];
        if (schedule.frequency === "daily") {
          for (const t of schedule.times_with_dose || []) {
            const [hh, mm] = (t.time || "00:00").split(":");
            const hour = parseInt(hh, 10);
            const minute = parseInt(mm, 10);
            const id = await scheduleDailyReminder({
              medicineName: medName,
              hour,
              minute,
              startDate: schedule.start_date,
              endDate: schedule.end_date,
            });
            if (id) notificationIds.push(id);
          }
        } else if (schedule.frequency === "interval") {
          const interval = Number(schedule.intervalHours) || 8;
          const ids = await scheduleIntervalReminder({
            medicineName: medName,
            intervalHours: interval,
            startDate: schedule.start_date,
            endDate: schedule.end_date,
          });
          if (ids && ids.length) notificationIds.push(...ids);
        }

        // Store notification IDs in the schedule record
        if (notificationIds.length > 0) {
          const { error: updateError } = await supabase
            .from("schedules")
            .update({ notification_ids: notificationIds })
            .eq("id", (await supabase.from("schedules").select("id").eq("medicine_id", medData.id)).data?.[0]?.id);
          
          if (updateError) {
            // storing notification IDs failed; ignore to avoid noisy logs
          }
        }
      } catch {
        // scheduling notifications failed; proceed without logging
      }

      /* ✅ THEN CONTINUE */
      Alert.alert("Success", "Medication saved");
      router.replace("/(tabs)/medicines");

    } catch (err: any) {
      Alert.alert("Save failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI DATA ---------------- */
  const scheduleSummary = useMemo(() => {
    const start = formatDateFriendly(schedule.start_date);
    const end = schedule.end_date ? formatDateFriendly(schedule.end_date) : "Ongoing";

    const freq =
      schedule.frequency === "daily"
        ? "Daily, Every Day"
        : schedule.frequency === "weekly"
        ? `Weekly: ${(schedule.weeklyDays || []).join(", ")}`
        : schedule.frequency === "interval"
        ? `Every ${schedule.intervalHours} hours`
        : "Custom";

    return { range: `${start} to ${end}`, freq };
  }, [schedule]);

  const timesDisplay = useMemo(() => {
    if (!schedule.times_with_dose?.length) return "—";

    return schedule.times_with_dose
      .map(
        (t: any) =>
          `${t.time} • ${t.dose} ${t.unit} ${medType}`
      )
      .join("\n");
  }, [schedule, medType]);

  const colorOptions = ["#898A8D","#FFD93D","#DDA0DD","#9B59B6","#27AE60","#95A5A6"];

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.root}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Review details</Text>
          
        </View>

        {/* SCHEDULING */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Scheduling</Text>
            <Text style={[styles.link, { opacity: 0.4 }]}>
              View full schedule
            </Text>
          </View>

          <View style={styles.scheduleBox}>
            <Text style={styles.small}>{scheduleSummary.range}</Text>
            <Text style={[styles.small, { marginTop: 6 }]}>
              {scheduleSummary.freq}
            </Text>
            <Text style={[styles.small, { marginTop: 8, lineHeight: 18 }]}>
              {timesDisplay}
            </Text>
          </View>
        </View>

        {/* PHOTO */}
        <TouchableOpacity style={styles.photoArea} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <>
              <Image source={require("../../assets/icons/pill.png")} style={styles.pillIcon} />
              <Text style={styles.photoText}>Add medication's photo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* NOTES */}
        <View style={styles.noteBox}>
          <TextInput
            placeholder="Instructions note"
            placeholderTextColor="#AAA"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={styles.noteInput}
          />
        </View>

        {/* COLOR */}
        <Text style={styles.sectionTitle}>Color Code</Text>
        <View style={styles.colorRow}>
          {colorOptions.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c, borderWidth: color === c ? 3 : 0 },
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* SAVE */}
        <TouchableOpacity style={styles.completeBtn} onPress={save}>
          {loading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.completeText}>Complete!</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addAnother}
          onPress={() => router.push("/(add-medicine)/step1")}
        >
          <Text style={styles.addAnotherText}>Add another medication</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES (UNCHANGED) ---------------- */
const styles = StyleSheet.create({
  root: { padding: 18, paddingBottom: 60 },
  header: {  justifyContent: "center", alignItems: "center" },
  
  title: { fontSize: 22, fontWeight: "400",  marginTop: 22, marginBottom: 11 },

  card: {  borderRadius: 12, padding: 12, marginTop: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontSize: 19, fontWeight: "700" },
  link: { color: "#58B0D2", fontSize: 13 },

  scheduleBox: { marginTop: 10, backgroundColor: "#F7F7F7", padding: 12, borderRadius: 8 },
  small: { fontSize: 13, color: "#666" },

  photoArea: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  photo: { width: 80, height: 80, borderRadius: 8 },
  pillIcon: { width: 48, height: 48 },
  photoText: { color: "#2F9E9E", marginTop: 8 },

  noteBox: { backgroundColor: "#F7F7F8", borderRadius: 8, padding: 12, marginTop: 14 },
  noteInput: { color: "#333" },

  sectionTitle: { fontSize: 15, fontWeight: "700", marginTop: 16 },
  colorRow: { flexDirection: "row", marginBottom: 18 },
  colorDot: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },

  completeBtn: { borderWidth: 1, borderColor: "#DDD", padding: 14, borderRadius: 10, alignItems: "center" },
  completeText: { fontWeight: "700" },

  addAnother: { backgroundColor: "#30CFCF", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 12 },
  addAnotherText: { color: "#fff", fontWeight: "700" },
});
