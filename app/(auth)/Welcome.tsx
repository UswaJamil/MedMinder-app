import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")} // change if needed
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome To</Text>
      <Text style={styles.brand}>MedMinder</Text>

      <Text style={styles.subtitle}>
        Your personal assistant for managing your medication schedule.
      </Text>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    color: "#777",
  },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#30CFCF",
    marginBottom: 20,
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  loginBtn: {
    backgroundColor: "#30CFCF",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: { color: "white", fontSize: 16, fontWeight: "bold" },

  registerBtn: {
    borderWidth: 1,
    borderColor: "#30CFCF",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  registerText: {
    color: "#30CFCF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
