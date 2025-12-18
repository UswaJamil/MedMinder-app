import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/* --------------------------------------------------
   REGISTER & PERMISSIONS
-------------------------------------------------- */
export async function registerForNotifications() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const { status: newStatus } =
      await Notifications.requestPermissionsAsync();

    if (newStatus !== "granted") {
      throw new Error("Notification permission not granted");
    }
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("med-reminders", {
      name: "Medication Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }
}

/* --------------------------------------------------
   DAILY REPEATING REMINDER
-------------------------------------------------- */
export async function scheduleDailyReminder({
  medicineName,
  hour,
  minute,
}: {
  medicineName: string;
  hour: number;
  minute: number;
}) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder 💊",
      body: `Time to take ${medicineName}`,
      sound: "default",
      channelId: "med-reminders", // ✅ NO RED LINE
    },
    trigger: {
      type: "daily", // ✅ STRING TYPE (FIX)
      hour,
      minute,
    },
  });
}

/* --------------------------------------------------
   INTERVAL (EVERY X HOURS) REMINDER
-------------------------------------------------- */
export async function scheduleIntervalReminder({
  medicineName,
  intervalHours,
}: {
  medicineName: string;
  intervalHours: number;
}) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder 💊",
      body: `Time to take ${medicineName}`,
      sound: "default",
      channelId: "med-reminders",
    },
    trigger: {
      type: "timeInterval", // ✅ STRING TYPE (FIX)
      seconds: intervalHours * 3600,
      repeats: true,
    },
  });
}

/* --------------------------------------------------
   CANCEL NOTIFICATIONS
-------------------------------------------------- */
export async function cancelMedicineNotifications(ids: string[]) {
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}
