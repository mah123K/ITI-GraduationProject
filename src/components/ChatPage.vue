<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <!-- Loading State -->
    <div v-if="initializing" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      <p class="text-indigo-900">Initializing...</p>
    </div>

    <!-- Login/Signup Form -->
    <div v-else-if="!user" class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome to Chat</h1>
        <p class="text-gray-600">{{ isSignUp ? 'Create your account' : 'Sign in to continue' }}</p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            @keyup.enter="handleAuth"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            @keyup.enter="handleAuth"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="••••••••"
          />
        </div>

        <div v-if="authError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ authError }}
        </div>

        <button
          @click="handleAuth"
          :disabled="loading || !email || !password"
          class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
        </button>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="isSignUp = !isSignUp; authError = ''"
          class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
        </button>
      </div>

      <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-800 font-semibold mb-2">Demo Instructions:</p>
        <ul class="text-xs text-blue-700 space-y-1">
          <li>• Open this in 2 different browsers/windows</li>
          <li>• Sign up with different emails</li>
          <li>• Start chatting in real-time!</li>
        </ul>
      </div>
    </div>

    <!-- Chat Interface -->
    <div v-else class="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[600px] flex mt-20">
      <!-- Users Sidebar -->
      <div class="w-64 border-r border-gray-200 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tl-2xl">
          <h3 class="font-semibold">Users</h3>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div v-if="allUsers.length === 0" class="p-4 text-center text-gray-500 text-sm">
            No other users yet
          </div>
          
          <button
            v-for="chatUser in allUsers"
            :key="chatUser.id"
            @click="selectChatUser(chatUser.id)"
            :class="[ 'w-full p-4 text-left hover:bg-gray-100 transition-colors border-b border-gray-100', selectedUser?.id === chatUser.id ? 'bg-indigo-50' : '' ]"
          >
            <div class="flex items-center gap-3">
              <div 
  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
  :style="{ backgroundColor: stringToColor(chatUser.email) }"
>
  {{ chatUser.email.charAt(0).toUpperCase() }}
</div>

              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-800 truncate">
                  {{ chatUser.email.split('@')[0] }}
                </p>
                <p class="text-xs text-gray-500 truncate">{{ chatUser.email }}</p>
              </div>
            </div>
          </button>
        </div>
        
        <div class="p-3 border-t border-gray-200 bg-gray-50 rounded-bl-2xl">
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <div class="bg-indigo-600 text-white p-4 rounded-tr-2xl">
          <div v-if="selectedUser">
            <h2 class="text-lg font-bold">{{ selectedUser.email.split('@')[0] }}</h2>
            <p class="text-sm text-indigo-200">{{ selectedUser.email }}</p>
          </div>
          <div v-else>
            <h2 class="text-lg font-bold">Select a user to start chatting</h2>
            <p class="text-sm text-indigo-200">{{ user.email.split('@')[0] }}</p>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div v-if="!selectedUser" class="text-center text-gray-500 py-20">
            <p class="text-lg font-semibold">No chat selected</p>
            <p class="text-sm">Choose a user from the left to start chatting</p>
          </div>

          <div v-else-if="loadingMessages" class="text-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading messages...</p>
          </div>

          <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-20">
            <p class="text-lg font-semibold">No messages yet</p>
            <p class="text-sm">Start the conversation!</p>
          </div>

          <div v-else v-for="msg in messages" :key="msg.id" class="flex items-start gap-2" :class="msg.userId === user.uid ? 'justify-end' : 'justify-start'">
          <!-- Avatar -->
<div v-if="msg.userId !== user.uid"
     class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
     :style="{ backgroundColor: stringToColor(msg.userEmail) }">
  {{ msg.userEmail.charAt(0).toUpperCase() }}
</div>

            <!-- Message Bubble -->
            <div :class="['max-w-xs lg:max-w-md px-4 py-3 rounded-2xl', msg.userId === user.uid ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-md']">
              <p class="font-semibold text-sm mb-1">{{ msg.userEmail.split('@')[0] }}</p>
              <p class="break-words">{{ msg.text }}</p>
              <p :class="['text-xs mt-1', msg.userId === user.uid ? 'text-indigo-200' : 'text-gray-500']">
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t border-gray-200 flex gap-2 bg-white rounded-br-2xl">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            :disabled="sending || !selectedUser"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || sending || !selectedUser"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase'
import { useRoute } from 'vue-router'

const route = useRoute()
const technicianId = route.query.uid || null

// State
const user = ref(null)
const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const authError = ref('')
const loading = ref(false)
const sending = ref(false)
const initializing = ref(true)
const loadingMessages = ref(false)
const allUsers = ref([])
const selectedUser = ref(null)
const currentRoomId = ref(null)

const defaultAvatar = 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v<version>/default_avatar.png'

let unsubscribeMessages = null
let unsubscribeAuth = null
let unsubscribeUsers = null

const getRoomId = (userId1, userId2) => [userId1, userId2].sort().join('_')

// Authentication
const handleAuth = async () => {
  if (!email.value || !password.value) return
  authError.value = ''
  loading.value = true

  try {
    let userCredential
    if (isSignUp.value) {
      userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      await setDoc(doc(db, 'technicians', userCredential.user.uid), {
        email: userCredential.user.email,
        avatar: defaultAvatar,
        createdAt: serverTimestamp()
      })
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    }
    email.value = ''
    password.value = ''
  } catch (error) {
    console.error(error)
    authError.value = error.message
  } finally { loading.value = false }
}

const handleLogout = async () => { await signOut(auth) }

const listenToUsers = () => {
  const q = query(collection(db, 'technicians'), orderBy('email', 'asc'))
  unsubscribeUsers = onSnapshot(q, snapshot => {
    let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.id !== user.value?.uid)
    
    // ✅ Restrict chat only to the technician profile
    if (technicianId) {
      users = users.filter(u => u.id === technicianId)
    }

    allUsers.value = users
    if (allUsers.value.length > 0 && !selectedUser.value) selectChatUser(allUsers.value[0].id)
  })
}


const selectChatUser = (id) => {
  selectedUser.value = allUsers.value.find(u => u.id === id)
  currentRoomId.value = getRoomId(user.value.uid, id)
  if (unsubscribeMessages) unsubscribeMessages()
  listenToMessages(currentRoomId.value)
}

const listenToMessages = (roomId) => {
  loadingMessages.value = true
  messages.value = []
  const messagesRef = collection(db, 'rooms', roomId, 'messages')
  const q = query(messagesRef, orderBy('timestamp', 'asc'))
  unsubscribeMessages = onSnapshot(q, snapshot => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    loadingMessages.value = false
    nextTick(scrollToBottom)
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !user.value || sending.value || !currentRoomId.value) return
  sending.value = true
  const messageText = newMessage.value
  newMessage.value = ''
  try {
    await addDoc(collection(db, 'rooms', currentRoomId.value, 'messages'), {
      text: messageText,
      userId: user.value.uid,
      userEmail: user.value.email,
      userAvatar: user.value.avatar || defaultAvatar,
      timestamp: serverTimestamp()
    })
  } catch (err) { console.error(err); alert(err.message) } 
  finally { sending.value = false }
}

const scrollToBottom = () => { if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight }

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Lifecycle
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, currentUser => {
    user.value = currentUser
    initializing.value = false
    if (currentUser) listenToUsers()
    else { if (unsubscribeMessages) unsubscribeMessages(); if (unsubscribeUsers) unsubscribeUsers(); messages.value = []; allUsers.value = []; selectedUser.value = null; currentRoomId.value = null }
  })
})

onUnmounted(() => { if (unsubscribeMessages) unsubscribeMessages(); if (unsubscribeUsers) unsubscribeUsers(); if (unsubscribeAuth) unsubscribeAuth() })


const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}
</script>
