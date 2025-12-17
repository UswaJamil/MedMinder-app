import { Tabs, useRouter } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { registerForNotifications } from "../../src/utils/notification";

export default function TabsLayout() {
  const router = useRouter();

  // 🔔 Request notification permission (once)
  useEffect(() => {
    registerForNotifications().catch(console.warn);
  }, []);

  // 🔐 Auth guard – handle deleted / invalid user
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error?.message?.includes("User not found") || !data?.user) {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
      }
    };

    checkSession();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#30CFCF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 100,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      {/* Calendar Tab */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/icons/calendar-active.png")
                  : require("../../assets/icons/calendar.png")
              }
              style={styles.icon}
            />
          ),
        }}
      />

      {/* My Meds Tab */}
      <Tabs.Screen
        name="medicines"
        options={{
          title: "My Meds",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/icons/pill-active.png")
                  : require("../../assets/icons/pill.png")
              }
              style={styles.icon}
            />
          ),
        }}
      />

      {/* Center Add Button */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/icons/plus-active.png")}
              style={[styles.icon, styles.plusIcon]}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/(add-medicine)/step1");
          },
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/icons/settings-active.png")
                  : require("../../assets/icons/settings.png")
              }
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  plusIcon: {
    width: 36,
    height: 36,
    
    tintColor: "#30CFCF",
  },
});
