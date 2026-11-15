import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "volunteer",
      text: "Halo, saya relawan yang bertugas hari ini. Apa yang sedang kamu rasakan sekarang? Kamu aman di sini.",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "volunteer",
          text: "Terima kasih sudah berbagi. Ceritakan lebih banyak, saya mendengarkan.",
        },
      ]);
    }, 1500);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Keluar</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Sesi Anonim</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            alert("Nomor Darurat Hotline Kesehatan Mental: 119 (Ext 8)")
          }
        >
          <Text style={styles.sosButton}>SOS</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  isUser ? styles.userBubble : styles.volunteerBubble,
                ]}
              >
                <Text
                  style={[
                    styles.chatText,
                    isUser ? styles.userText : styles.volunteerText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Tulis pesanmu di sini..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  homeContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 24,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0284C7",
    marginRight: 6,
  },
  badgeText: {
    color: "#0369A1",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 32,
    paddingHorizontal: 16,
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
  sosButton: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatBubble: {
    maxW: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  volunteerBubble: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#FFFFFF",
  },
  volunteerText: {
    color: "#1F2937",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: "#1F2937",
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
