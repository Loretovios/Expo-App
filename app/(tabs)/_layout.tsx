import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerBackTitle: "Back",
          headerShadowVisible: false,
          headerLeft: ({ canGoBack }) => 
            canGoBack ? (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
            ) : null,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="reminder"
          options={{
            title: "Reminders",
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity 
                style={{ marginRight: 16 }}
                onPress={() => {
                  // Add any header right action here
                }}
              >
                <Ionicons name="options-outline" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity 
                style={{ marginRight: 16 }}
                onPress={() => {
                  // Add any header right action here
                }}
              >
                <Ionicons name="search-outline" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}