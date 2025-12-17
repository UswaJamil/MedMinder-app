// app/_layout.tsx
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
