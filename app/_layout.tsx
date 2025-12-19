import type { NotificationBehavior } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { registerForNotifications } from "../src/utils/notification";

/* ✅ MUST be top-level */
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    registerForNotifications().catch((e) =>
      null
    );
  }, []);

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
