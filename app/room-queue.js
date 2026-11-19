import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../services/firebase";
import { useRouter } from "expo-router";

export default function RoomQueue() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const roomRef = ref(db, "rooms");

    const getRooms = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const availableRooms = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRooms(availableRooms);
      } else {
        setRooms([]);
      }
    });
    return () => getRooms();
  }, []);

  async function handleJoinRoom(roomId) {
    try {
      const selectedRoomRef = ref(db, `/rooms/${roomId}`);

      await update(selectedRoomRef, { status: "active" });

      router.push({
        pathname: "/chat",
        params: {
          role: "volunteer",
          roomId,
        },
      });
    } catch (error) {
      console.log("Gagal masuk ke room:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Kembali</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Cari Room</Text>
        </View>
      </View>

      <ScrollView style={styles.chatContainer}>
        {rooms &&
          rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.button}
              onPress={() => handleJoinRoom(room.id)}
            >
              <Text style={{ color: "#fff" }}>
                Room menunggu: {room.status}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
});
