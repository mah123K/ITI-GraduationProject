<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div v-if="initializing" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      <p class="text-indigo-900">Initializing Chat...</p>
    </div>

    <div v-else-if="user" class="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[600px] flex mt-20">
      <div class="w-64 border-r border-gray-200 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tl-2xl">
          <h3 class="font-semibold">Chats</h3>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div v-if="allUsers.length === 0 && !technicianId" class="p-4 text-center text-gray-500 text-sm">
            No active chats. <br/> Go to a technician's profile to start a chat.
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
            
            <button
              @click.stop="deleteChat(chatUser.id)" 
              class="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all"
              title="Delete chat from list"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        </div>

      <div class="flex-1 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tr-2xl">
          <div v-if="selectedUser">
            <h2 class="text-lg font-bold">{{ selectedUser.name || selectedUser.email.split('@')[0] }}</h2>
            <p class="text-sm text-indigo-200">{{ selectedUser.email }}</p>
          </div>
          <div v-else>
            <h2 class="text-lg font-bold">Welcome to Chat</h2>
            <p class="text-sm text-indigo-200">{{ currentUserDoc?.name || 'Guest' }}</p>
          </div>
        </div>

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
            <div v-if="msg.userId !== user.uid"
              class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              :style="{ backgroundColor: stringToColor(msg.userEmail) }">
              {{ (msg.userEmail || 'U').charAt(0).toUpperCase() }}
            </div>

            <div :class="['max-w-xs lg:max-w-md px-4 py-3 rounded-2xl', msg.userId === user.uid ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-md']">
              <p class="font-semibold text-sm mb-1">{{ msg.userName || msg.userEmail.split('@')[0] }}</p>
              <p class="break-words">{{ msg.text }}</p>
              <p :class="['text-xs mt-1', msg.userId === user.uid ? 'text-indigo-200' : 'text-gray-500']">
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>
        </div>

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
// MODIFIED: Added anonymous auth
import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth' 
// MODIFIED: Added deleteDoc and getDocs
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, setDoc, doc, getDoc, deleteDoc, getDocs } from 'firebase/firestore' 
import { auth, db } from '@/firebase/firebase'
import { useRoute } from 'vue-router'

const route = useRoute()
// This still works to get the technician ID from the "Hire Me" button
const technicianId = route.query.uid || null 

// State
const user = ref(null) // This will be our anonymous user
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const sending = ref(false)
const initializing = ref(true) // We still need this for loading
const loadingMessages = ref(false)
const allUsers = ref([]) // This will hold our active_chats
const selectedUser = ref(null)
const currentRoomId = ref(null)
const currentUserDoc = ref(null) // Stores our anonymous user's doc

const defaultAvatar = 'https://via.placeholder.com/150/808080/FFFFFF?text=G' // Generic Guest avatar

let unsubscribeMessages = null
let unsubscribeAuth = null
let unsubscribeUsers = null

const getRoomId = (userId1, userId2) => [userId1, userId2].sort().join('_')

// --- NEW AUTH LOGIC (Anonymous) ---

onMounted(() => {
  initializing.value = true
  unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      // User is signed in (or just signed in)
      user.value = currentUser
      
      // Check if we have a document for this user in the 'users' collection
      const userDocRef = doc(db, 'users', currentUser.uid)
      const userDocSnap = await getDoc(userDocRef)
      
      if (!userDocSnap.exists()) {
        // This is a new anonymous user, create a doc for them
        const newGuestUser = {
          uid: currentUser.uid,
          name: "Guest User",
          // Create a fake email for display, as anonymous users don't have one
          email: `guest_${currentUser.uid.substring(0, 5)}@chat.com`, 
          avatar: defaultAvatar,
          createdAt: serverTimestamp()
        }
        await setDoc(userDocRef, newGuestUser)
        currentUserDoc.value = newGuestUser
      } else {
        // We already have a doc for this user
        currentUserDoc.value = userDocSnap.data()
      }
      
      // Now that we are logged in and have user info, load the chat list
      listenToUsers()
      initializing.value = false

    } else {
      // User is not signed in, sign them in anonymously
      try {
        await signInAnonymously(auth)
        // onAuthStateChanged will fire again with the new user
      } catch (error) {
        console.error("Error signing in anonymously:", error)
        initializing.value = false
        // You could show an error message here
      }
    }
  })
})

onUnmounted(() => { 
  if (unsubscribeMessages) unsubscribeMessages()
  if (unsubscribeUsers) unsubscribeUsers()
  if (unsubscribeAuth) unsubscribeAuth() 
})

// This function is just in case of an error
const handleLogout = async () => { await signOut(auth) }


// --- CHAT LOGIC ---

// THIS IS THE CORRECTED `listenToUsers` FUNCTION
const listenToUsers = async () => {
  if (unsubscribeUsers) unsubscribeUsers()

  // Listen to the user's "active_chats" subcollection
  const chatsQuery = query(collection(db, 'users', user.value.uid, 'active_chats'), orderBy('email', 'asc'))
  
  unsubscribeUsers = onSnapshot(chatsQuery, async (snapshot) => {
    let activeChatUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Check if a new technicianId was passed from the URL
    if (technicianId) {
      const techExists = activeChatUsers.some(u => u.id === technicianId)
      
      // If the new tech isn't already in our chat list, fetch their info and add them
      if (!techExists) {
        try {
          // Check 'users' collection first (where technicians *should* be)
          let userDocRef = doc(db, 'users', technicianId) 
          let userDocSnap = await getDoc(userDocRef)
          
          if (!userDocSnap.exists()) {
            // Fallback: Check 'technicians' collection if not in 'users'
            userDocRef = doc(db, 'technicians', technicianId)
            userDocSnap = await getDoc(userDocRef)
          }

          if (userDocSnap.exists()) {
            const newChatUser = { id: userDocSnap.id, ...userDocSnap.data() }
            // Add the new user to the top of the list temporarily
            activeChatUsers.unshift(newChatUser) 
          } else {
            console.error("Technician to chat with not found")
          }
        } catch (error) {
          console.error("Error fetching specific technician:", error)
        }
      }
    }
    
    allUsers.value = activeChatUsers
    
    // Auto-select the technician from the URL, or the first in the list
    if (technicianId && allUsers.value.some(u => u.id === technicianId)) {
      selectChatUser(technicianId)
    } else if (allUsers.value.length > 0 && !selectedUser.value) {
      // Don't auto-select if a chat was just deleted
      if (selectedUser.value !== null) {
         selectChatUser(allUsers.value[0].id)
      }
    } else if (allUsers.value.length === 0) {
      // If list is now empty, clear the chat window
      selectedUser.value = null
      currentRoomId.value = null
      if (unsubscribeMessages) unsubscribeMessages()
      messages.value = []
    }
  })
}

// THIS IS THE CORRECTED `deleteChat` FUNCTION
const deleteChat = async (otherUserId) => {
  if (!confirm("Are you sure you want to permanently delete this entire chat history? This cannot be undone.")) return
  
  try {
    // 1. Get the Room ID
    const roomId = getRoomId(user.value.uid, otherUserId)

    // 2. Delete all messages in the room
    const messagesRef = collection(db, 'rooms', roomId, 'messages')
    const q = query(messagesRef)
    const messagesSnap = await getDocs(q) // Use getDocs here

    const deletePromises = []
    messagesSnap.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref))
    })
    await Promise.all(deletePromises)

    // 3. Delete the chat link from *my* sidebar
    await deleteDoc(doc(db, 'users', user.value.uid, 'active_chats', otherUserId))

    // 4. Delete the chat link from the *other user's* sidebar
    await deleteDoc(doc(db, 'users', otherUserId, 'active_chats', user.value.uid))
    
    // 5. Clear the UI
    // The onSnapshot listener in listenToUsers will automatically remove the user
    // from the sidebar. We just need to clear the message pane.
    if (selectedUser.value?.id === otherUserId) {
      selectedUser.value = null
      currentRoomId.value = null
      if (unsubscribeMessages) unsubscribeMessages()
      messages.value = []
    }
    
    console.log("Chat history permanently deleted.");

  } catch (error) {
    console.error("Error deleting chat:", error)
    alert("Could not delete chat history.")
  }
}

const selectChatUser = (id) => {
  selectedUser.value = allUsers.value.find(u => u.id === id)
  if (!selectedUser.value) return // Safety check
  
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

// This function now also creates the persistent chat link for both users
const sendMessage = async () => {
  if (!newMessage.value.trim() || !user.value || sending.value || !currentRoomId.value) return
  sending.value = true
  const messageText = newMessage.value
  newMessage.value = ''
  
  try {
    // 1. Add the message to the 'messages' subcollection
    await addDoc(collection(db, 'rooms', currentRoomId.value, 'messages'), {
      text: messageText,
      userId: user.value.uid,
      userEmail: currentUserDoc.value.email, // Use anonymous user's email
      userName: currentUserDoc.value.name, // Add user's name
      userAvatar: currentUserDoc.value?.avatar || defaultAvatar,
      timestamp: serverTimestamp()
    })
    
    // 2. Create/Update the persistent chat link in *both* users' "active_chats"
    const otherUser = selectedUser.value
    
    // Add chat to *my* list
    await setDoc(doc(db, 'users', user.value.uid, 'active_chats', otherUser.id), {
      // Save the other user's info
      uid: otherUser.id,
      name: otherUser.name || otherUser.email.split('@')[0],
      email: otherUser.email,
      avatar: otherUser.avatar || defaultAvatar
    })
    
    // Add chat to the *other user's* list
    // Make sure the other user *also* has a doc in the 'users' collection
    const otherUserDocRef = doc(db, 'users', otherUser.id)
    const otherUserDocSnap = await getDoc(otherUserDocRef)
    if(otherUserDocSnap.exists()) {
       await setDoc(doc(db, 'users', otherUser.id, 'active_chats', user.value.uid), {
         ...currentUserDoc.value // Save my info
       })
    } else {
      // This is a safety check in case the technician is not in the 'users' collection
      console.warn(`Could not find user doc for ${otherUser.id}. Chat will only appear in your list.`)
    }

  } catch (err) { 
    console.error(err); 
    alert(err.message) 
  } finally { 
    sending.value = false 
  }
}

// --- HELPER FUNCTIONS ---

const scrollToBottom = () => { if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight }

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const stringToColor = (str) => {
  if (!str) str = 'default' // Add a check for null/undefined strings
  let hash = 0
  for (let i = 0; i.e < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}
</script>