import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

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

export async function scheduleMedicineReminder({
  medicineName,
  time,
}: {
  medicineName: string;
  time: string; // "09:00"
}) {
  const [hour, minute] = time.split(":").map(Number);

  const trigger = new Date();
  trigger.setHours(hour);
  trigger.setMinutes(minute);
  trigger.setSeconds(0);

  if (trigger < new Date()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder 💊",
      body: `Time to take ${medicineName}`,
      sound: "default",
    },
    trigger,
  });
}

export async function cancelMedicineNotifications(ids: string[]) {
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}
