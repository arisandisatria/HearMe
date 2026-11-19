import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { db, push } from "../services/firebase";
import { ref, set } from "firebase/database";

export default function App() {
  const router = useRouter();

  async function handleCreateUserRoom() {
    try {
      const roomRef = ref(db, "rooms");

      const newRoomRef = push(roomRef);
      const roomId = newRoomRef.key;

      await set(newRoomRef, {
        status: "waiting",
        createdAt: Date.now(),
      });

      router.push({
        pathname: "/chat",
        params: { role: "user", roomId },
      });
    } catch (error) {
      console.log("Failed making room:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HearMe</Text>
        <Text style={styles.subtitle}>
          Tempat aman untuk cerita dan didengar secara real-time.
        </Text>

        <View style={styles.roleButtonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/room-queue",
                params: { role: "volunteer" },
              })
            }
          >
            <Text style={styles.buttonText}>Mulai sebagai Volunteer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleCreateUserRoom()}
          >
            <Text style={styles.buttonText}>Mulai sebagai User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  roleButtonContainer: {
    width: "100%",
    gap: 8,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
