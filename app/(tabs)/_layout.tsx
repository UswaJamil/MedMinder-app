import { Tabs, useRouter } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import HeaderLogo from "../components/HeaderLogo";

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
      }
    };
    checkSession();
  }, []);

  return (
    <Tabs
      screenOptions={{
        // ✅ Header only for logo
        headerShown: true,
        headerTitle: "",
        headerRight: () => <HeaderLogo />,
        headerShadowVisible: false,
        headerStyle: {
          height: 55, // 🔥 VERY IMPORTANT (prevents push-down)
          backgroundColor: "#fff",
        },

        // ✅ Tabs
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#30CFCF",
        tabBarInactiveTintColor: "#999",

        tabBarStyle: {
          height: 100,
          paddingBottom: 18,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
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

<Tabs.Screen
  name="add"
  options={{
    title: "Add",
    tabBarIcon: ({ focused }) => (
      <Image
        source={
          focused
            ? require("../../assets/icons/plus-active.png")
            : require("../../assets/icons/plus.png")
        }
        style={styles.plusIcon}
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
    width: 24,
    height: 24,
  },
  plusIcon: {
    width: 26,
    height: 26,
    
    
  },
});
