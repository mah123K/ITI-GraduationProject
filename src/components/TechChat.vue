<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div v-if="initializing" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      <p class="text-indigo-900">Loading technician chat...</p>
    </div>

    <div v-else-if="user" class="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[600px] flex mt-20">
      <!-- Sidebar -->
      <div class="w-64 border-r border-gray-200 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tl-2xl">
          <h3 class="font-semibold">Clients</h3>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="clients.length === 0" class="p-4 text-center text-gray-500 text-sm">
            No messages from clients yet.
          </div>

          <div
            v-for="client in clients"
            :key="client.id"
            class="relative group"
          >
            <button
              @click="selectClient(client.id)"
              :class="[
                'w-full p-4 text-left hover:bg-gray-100 transition-colors border-b border-gray-100',
                selectedClient?.id === client.id ? 'bg-indigo-50' : ''
              ]"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  :style="{ backgroundColor: stringToColor(client.email) }"
                >
                  {{ (client.name || client.email).charAt(0).toUpperCase() }}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800 truncate">{{ client.name || client.email.split('@')[0] }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ client.lastMessage || client.email }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Chat window -->
      <div class="flex-1 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tr-2xl">
          <div v-if="selectedClient">
            <h2 class="text-lg font-bold">{{ selectedClient.name }}</h2>
            <p class="text-sm text-indigo-200">{{ selectedClient.email }}</p>
          </div>
          <div v-else>
            <h2 class="text-lg font-bold">Technician Chat</h2>
            <p class="text-sm text-indigo-200">Select a client from the list</p>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div v-if="!selectedClient" class="text-center text-gray-500 py-20">
            <p class="text-lg font-semibold">No chat selected</p>
          </div>

          <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-20">
            <p>No messages yet</p>
          </div>

          <div
            v-else
            v-for="msg in messages"
            :key="msg.id"
            :class="['flex', msg.userId === user.uid ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-xs lg:max-w-md px-4 py-3 rounded-2xl',
                msg.userId === user.uid
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-md'
              ]"
            >
              <p class="font-semibold text-sm mb-1">{{ msg.userName }}</p>
              <p>{{ msg.text }}</p>
              <p :class="['text-xs mt-1', msg.userId === user.uid ? 'text-indigo-200' : 'text-gray-500']">
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Send message -->
        <div class="p-4 border-t border-gray-200 flex gap-2 bg-white rounded-br-2xl">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            :disabled="!selectedClient || sending"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || !selectedClient || sending"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { auth, db } from '@/firebase/firebase'
import { collection, onSnapshot, query, orderBy, addDoc, setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)
const clients = ref([])
const selectedClient = ref(null)
const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const initializing = ref(true)
const messagesContainer = ref(null)

const clientIdFromUrl = route.query.uid

const getRoomId = (id1, id2) => [id1, id2].sort().join('_')

// Load technician and chats
onMounted(async () => {
  auth.onAuthStateChanged(async (currentUser) => {
    if (!currentUser) return
    user.value = currentUser

    // 🔥 Listen for all active chats from clients
    const q = query(collection(db, 'users', user.value.uid, 'active_chats'), orderBy('updatedAt', 'desc'))
    onSnapshot(q, (snapshot) => {
      clients.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      if (clientIdFromUrl) {
        const found = clients.value.find(c => c.id === clientIdFromUrl)
        if (found) selectClient(found.id)
      }
    })

    initializing.value = false
  })
})

const selectClient = (clientId) => {
  selectedClient.value = clients.value.find(c => c.id === clientId)
  if (!selectedClient.value) return

  const roomId = getRoomId(user.value.uid, clientId)
  const q = query(collection(db, 'rooms', roomId, 'messages'), orderBy('timestamp', 'asc'))
  onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    nextTick(scrollToBottom)
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedClient.value) return
  sending.value = true

  const text = newMessage.value
  newMessage.value = ''
  const roomId = getRoomId(user.value.uid, selectedClient.value.id)

  await addDoc(collection(db, 'rooms', roomId, 'messages'), {
    text,
    userId: user.value.uid,
    userEmail: user.value.email,
    userName: user.value.displayName || 'Technician',
    timestamp: serverTimestamp()
  })

  // Update active_chats for both
  await setDoc(doc(db, 'users', user.value.uid, 'active_chats', selectedClient.value.id), {
    ...selectedClient.value,
    lastMessage: text,
    updatedAt: serverTimestamp()
  })
  await setDoc(doc(db, 'users', selectedClient.value.id, 'active_chats', user.value.uid), {
    uid: user.value.uid,
    name: user.value.displayName || 'Technician',
    email: user.value.email,
    lastMessage: text,
    updatedAt: serverTimestamp()
  })

  sending.value = false
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const stringToColor = (str) => {
  if (!str) return '#888'
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - color.length) + color
}
</script>
