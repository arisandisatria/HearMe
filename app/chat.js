import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { db, onValue, push, ref } from "../services/firebase";

export default function ChatScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  const { role } = useLocalSearchParams();

  console.log(role);

  const roomId = "room_1";

  useEffect(() => {
    const chatRef = ref(db, `chat/${roomId}/messages`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const loadedMessages = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const chatRef = ref(db, `chat/${roomId}/messages`);

    if (!chatRef) return;

    await push(chatRef, {
      sender: role,
      text: inputText,
      timestamp: Date.now(),
    });
    setInputText("");
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
