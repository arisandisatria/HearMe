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

  function formatWaitTime(createdAt) {
    if (!createdAt) return "Baru saja";
    const diffMinutes = Math.max(
      0,
      Math.floor((Date.now() - createdAt) / 60000),
    );
    if (diffMinutes < 1) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes} mnt lalu`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} jam lalu`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtnWrap}
        >
          <Text style={styles.backButton}>Kembali</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Cari Room</Text>
          <Text style={styles.headerSubtitle}>
            {rooms.length} room tersedia
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {rooms.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Belum ada room saat ini</Text>
            <Text style={styles.emptyDesc}>
              Room akan muncul ketika ada user yang mau curhat
            </Text>
          </View>
        ) : (
          rooms.map((room, index) => (
            <TouchableOpacity
              key={room.id}
              activeOpacity={0.8}
              style={styles.roomCard}
              onPress={() => handleJoinRoom(room.id)}
            >
              <View style={styles.roomInfo}>
                {room.status == "waiting" ? (
                  <View style={styles.badgeRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: "#059669" }]}
                    />
                    <Text style={[styles.statusText, { color: "#059669" }]}>
                      Menunggu
                    </Text>
                  </View>
                ) : (
                  <View style={styles.badgeRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: "#DC2626" }]}
                    />
                    <Text style={[styles.statusText, { color: "#DC2626" }]}>
                      Aktif
                    </Text>
                  </View>
                )}

                <Text style={styles.roomTitle}>Room {index + 1}</Text>
                <Text style={styles.timeText}>
                  {formatWaitTime(room.createdAt)}
                </Text>
              </View>

              <Text style={styles.joinText}>Ketuk untuk masuk room</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F6",
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
  backBtnWrap: {
    width: 72,
  },
  backButton: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  headerInfo: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  headerSpacer: {
    width: 72,
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  roomInfo: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },
  roomTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  joinBadge: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  joinText: {
    color: "#dadada",
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "200",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
