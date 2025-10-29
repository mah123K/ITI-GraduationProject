<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div v-if="initializing" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      <p class="text-indigo-900">Initializing Chat...</p>
    </div>

<div v-else-if="user" class="bg-white rounded-2xl shadow-xl w-full h-[calc(100vh-10rem)] flex">      <!-- Sidebar (Chat list) -->
      <div class="w-64 border-r border-gray-200 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 ">
          <h3 class="font-semibold">Chats</h3>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="allUsers.length === 0" class="p-4 text-center text-gray-500 text-sm">
            No active chats yet.
          </div>

          <div
            v-for="chatUser in allUsers"
            :key="chatUser.id"
            class="relative group"
          >
            <button
              @click="selectChatUser(chatUser.id)"
              :class="[ 'w-full p-4 text-left hover:bg-gray-100 transition-colors border-b border-gray-100', selectedUser?.id === chatUser.id ? 'bg-indigo-50' : '' ]"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  :style="{ backgroundColor: stringToColor(chatUser.email) }"
                >
                  {{ (chatUser.name || chatUser.email).charAt(0).toUpperCase() }}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800 truncate">
                    {{ chatUser.name || chatUser.email.split('@')[0] }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">{{ chatUser.email }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Chat area -->
      <div class="flex-1 flex flex-col">
        <div class="bg-indigo-600 text-white p-3.5 mr-1">
          <h2 class="text-lg font-bold">
            {{ selectedUser ? (selectedUser.name || selectedUser.email.split('@')[0]) : 'Select a chat' }}
          </h2>
        </div>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div v-if="!selectedUser" class="text-center text-gray-500 py-20">
            <p class="text-lg font-semibold">No chat selected</p>
          </div>

          <div v-else v-for="msg in messages" :key="msg.id" class="flex" :class="msg.userId === user.uid ? 'justify-end' : 'justify-start'">
            <div :class="['max-w-xs px-4 py-3 rounded-2xl', msg.userId === user.uid ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-md']">
              <p class="text-sm mb-1 font-semibold">{{ msg.userName }}</p>
              <p>{{ msg.text }}</p>
              <p class="text-xs mt-1 opacity-75">{{ formatTime(msg.timestamp) }}</p>
            </div>
          </div>
        </div>

        <!-- Send box -->
        <div class="p-4 border-t border-gray-200 flex gap-2 bg-white rounded-br-2xl">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            :disabled="sending || !selectedUser"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || sending || !selectedUser"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import {
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore"
import { auth, db } from "@/firebase/firebase"

const route = useRoute()
const technicianId = route.query.uid || null // technician id from URL

// State
const user = ref(null)
const initializing = ref(true)
const allUsers = ref([])
const selectedUser = ref(null)
const currentRoomId = ref(null)
const messages = ref([])
const newMessage = ref("")
const sending = ref(false)
const messagesContainer = ref(null)
const currentUserDoc = ref(null)
let unsubscribeMessages = null
let unsubscribeAuth = null
let unsubscribeUsers = null

const defaultAvatar = "https://via.placeholder.com/150/808080/FFFFFF?text=G"

// Utility
const getRoomId = (uid1, uid2) => [uid1, uid2].sort().join("_")

// Auth setup
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser
      const userDocRef = doc(db, "users", currentUser.uid)
      const snap = await getDoc(userDocRef)
      if (!snap.exists()) {
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          name: "Guest User",
          email: `guest_${currentUser.uid.substring(0, 6)}@chat.com`,
          avatar: defaultAvatar,
          createdAt: serverTimestamp(),
        })
      }
      currentUserDoc.value = (await getDoc(userDocRef)).data()
      listenToUsers()
      initializing.value = false
    } else {
      await signInAnonymously(auth)
    }
  })
})

onUnmounted(() => {
  if (unsubscribeMessages) unsubscribeMessages()
  if (unsubscribeUsers) unsubscribeUsers()
  if (unsubscribeAuth) unsubscribeAuth()
})

// Load chat list
const listenToUsers = async () => {
  if (unsubscribeUsers) unsubscribeUsers()

  const chatsRef = collection(db, "users", user.value.uid, "active_chats")
  unsubscribeUsers = onSnapshot(chatsRef, async (snap) => {
    const active = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    if (technicianId && !active.some((u) => u.id === technicianId)) {
      const techSnap = await getDoc(doc(db, "users", technicianId))
      if (techSnap.exists()) {
        active.unshift({ id: techSnap.id, ...techSnap.data() })
      }
    }

    allUsers.value = active

    if (technicianId && allUsers.value.some((u) => u.id === technicianId)) {
      selectChatUser(technicianId)
    }
  })
}

// Select chat
const selectChatUser = (id) => {
  selectedUser.value = allUsers.value.find((u) => u.id === id)
  if (!selectedUser.value) return
  currentRoomId.value = getRoomId(user.value.uid, id)
  listenToMessages(currentRoomId.value)
}

// Listen to messages
const listenToMessages = (roomId) => {
  if (unsubscribeMessages) unsubscribeMessages()
  const msgsRef = collection(db, "rooms", roomId, "messages")
  const q = query(msgsRef, orderBy("timestamp", "asc"))
  unsubscribeMessages = onSnapshot(q, (snap) => {
    messages.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    nextTick(scrollToBottom)
  })
}

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value) return
  sending.value = true
  const msgText = newMessage.value
  newMessage.value = ""

  try {
    // Save to room
    await addDoc(collection(db, "rooms", currentRoomId.value, "messages"), {
      text: msgText,
      userId: user.value.uid,
      userEmail: currentUserDoc.value.email,
      userName: currentUserDoc.value.name,
      timestamp: serverTimestamp(),
    })

    // Update both users’ active chat list
    const other = selectedUser.value

    await setDoc(doc(db, "users", user.value.uid, "active_chats", other.id), {
      uid: other.id,
      name: other.name || other.email.split("@")[0],
      email: other.email,
      lastMessage: msgText,
      updatedAt: serverTimestamp(),
    })

    await setDoc(doc(db, "users", other.id, "active_chats", user.value.uid), {
      uid: user.value.uid,
      name: currentUserDoc.value.name,
      email: currentUserDoc.value.email,
      lastMessage: msgText,
      updatedAt: serverTimestamp(),
    })
  } catch (err) {
    console.error("Error sending message:", err)
  } finally {
    sending.value = false
  }
}

// Helpers
const scrollToBottom = () => {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
}

const formatTime = (ts) => {
  if (!ts) return ""
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const stringToColor = (str) => {
  if (!str) return "#999"
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return "#" + ((hash >> 24) & 0xffffff).toString(16).padStart(6, "0")
}
</script>
