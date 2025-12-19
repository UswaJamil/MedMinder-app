import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type DailyParams = {
  medicineName: string;
  hour: number;
  minute: number;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

type IntervalParams = {
  medicineName: string;
  intervalHours: number;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

export async function registerForNotifications(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  // Android channel
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync("med-reminders", {
        name: "Medication Reminders",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
      });
    } catch (e) {
      console.warn("Failed to create notification channel:", e);
    }
  }

  return true;
}

function computeNextDateForTime(hour: number, minute: number, startDate?: Date | string | null) {
  const now = new Date();
  let candidate = new Date();
  candidate.setHours(hour, minute, 0, 0);

  if (startDate) {
    const s = typeof startDate === "string" ? new Date(startDate) : startDate;
    if (s) {
      const startAtTime = new Date(s);
      startAtTime.setHours(hour, minute, 0, 0);
      if (startAtTime > now) {
        return startAtTime;
      }
    }
  }

  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }

  return candidate;
}

export async function scheduleDailyReminder({ medicineName, hour, minute, startDate, endDate }: DailyParams) {
  // Prefer calendar trigger for reliable daily repeating notifications
  try {
    const trigger: any = { type: "daily", hour, minute, repeats: true };
    if (Platform.OS === "android") trigger.channelId = "med-reminders";

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${medicineName}`,
        body: `Take your medicine: ${medicineName}`,
        sound: "default",
        categoryIdentifier: "med-reminders",
      },
      trigger,
    });

    return id;
  } catch (e) {
    console.warn("scheduleDailyReminder failed, falling back to date trigger:", e);
    // Fallback: schedule next occurrence as a Date trigger
    const next = computeNextDateForTime(hour, minute, startDate);
    const fallbackTrigger: any = { type: "date", date: next };
    if (Platform.OS === "android") fallbackTrigger.channelId = "med-reminders";

    const id = await Notifications.scheduleNotificationAsync({
      content: { title: `Time for ${medicineName}`, body: `Take your medicine: ${medicineName}`, sound: "default" },
      trigger: fallbackTrigger,
    });
    return id;
  }
}

export async function scheduleIntervalReminder({ medicineName, intervalHours, startDate, endDate }: IntervalParams) {
  // Schedule multiple Date triggers (next 30 occurrences or until endDate) instead of using seconds-based triggers
  const ids: string[] = [];
  const now = new Date();
  let next = startDate ? (typeof startDate === "string" ? new Date(startDate) : new Date(startDate)) : new Date();

  // align next to now if in past
  if (next <= now) next = new Date();

  // compute first occurrence >= now
  // round to next hour boundary if startDate not provided
  if (!startDate) {
    next.setMinutes(0, 0, 0);
  }

  // ensure next is in future
  if (next <= now) next = new Date(now.getTime() + 1 * 60 * 1000);

  const maxOccurrences = 30; // schedule 30 occurrences to survive offline/restarts
  for (let i = 0; i < maxOccurrences; i++) {
    // stop if endDate reached
    if (endDate) {
      const e = typeof endDate === "string" ? new Date(endDate) : endDate;
      if (e && next > e) break;
    }

    const triggerDate: any = { type: "date", date: new Date(next) };
    if (Platform.OS === "android") triggerDate.channelId = "med-reminders";

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${medicineName}`,
        body: `Take your medicine: ${medicineName}`,
        sound: "default",
      },
      trigger: triggerDate,
    });

    ids.push(id);

    // advance
    next = new Date(next.getTime() + intervalHours * 60 * 60 * 1000);
  }

  return ids;
}

export default {
  registerForNotifications,
  scheduleDailyReminder,
  scheduleIntervalReminder,
};
