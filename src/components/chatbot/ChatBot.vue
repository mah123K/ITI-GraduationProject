<template>
    <!-- Main widget container -->
    <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end">
    
        <!-- Chat Window -->
        <transition name="slide-up">
            <div v-if="isOpen" class="w-80 sm:w-96 h-[500px] mb-4 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
                
                <!-- Header -->
                <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
                    <h3 class="font-bold text-lg">Chat with AI</h3>
                    <button @click="toggleChat" class="p-1 rounded-full hover:bg-blue-700 transition-colors">
                        <!-- Close Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Message Body -->
                <div ref="chatBody" class="flex-1 p-4 overflow-y-auto bg-gray-50 chat-body">
                    
                    <!-- Loop through messages -->
                    <div v-for="(msg, index) in messages" :key="index" class="mb-3 flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                        <div 
                            class="inline-block p-3 rounded-lg max-w-[85%]"
                            :class="{
                                'bg-gray-200 text-gray-800 rounded-bl-none': msg.role === 'bot',
                                'bg-blue-600 text-white rounded-br-none': msg.role === 'user'
                            }"
                        >
                            <!-- Display uploaded image if it exists -->
                            <img v-if="msg.image" :src="msg.image" alt="Uploaded issue" class="rounded-md mb-2 max-w-full">
                            <!-- Display text -->
                            <span v-if="msg.text">{{ msg.text }}</span>
                        </div>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isLoading" class="mb-3">
                        <div class="inline-block bg-gray-200 text-gray-500 p-3 rounded-lg rounded-bl-none">
                            Bot is typing...
                        </div>
                    </div>

                </div>

                <!-- Input Footer -->
                <div class="p-3 border-t bg-white rounded-b-lg flex-shrink-0">
                    
                    <!-- Staged Image Preview -->
                    <div v-if="selectedImageBase64" class="relative w-20 h-20 mb-2 p-1 border border-gray-200 rounded-md">
                        <img :src="selectedImageBase64" class="w-full h-full object-cover rounded-md">
                        <button @click="clearSelectedImage" class="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm leading-none hover:bg-red-600 transition-colors">&times;</button>
                    </div>

                    <!-- Hidden File Input -->
                    <input 
                        type="file" 
                        accept="image/*" 
                        class="hidden" 
                        ref="fileInput" 
                        @change="handleFileSelect"
                    >

                    <div class="flex items-center space-x-2">
                        <!-- Attach Icon -->
                        <button
                            class="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors"
                            @click="triggerFileUpload"
                            :disabled="isLoading"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                        
                        <!-- Text Input -->
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-75"
                            v-model="userInput"
                            @keydown.enter="sendMessage"
                            :disabled="isLoading"
                        >
                        
                        <!-- Send Button -->
                        <button 
                            class="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            @click="sendMessage"
                            :disabled="isLoading"
                        >
                            <!-- Send Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 012 0v5.071a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Chat Bubble / Icon -->
        <button @click="toggleChat" class="bg-accent-color dark:bg-dark-blue text-white rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-xl hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-110">
            <!-- Show Chat Icon when closed -->
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-30" fill="currentColor" viewBox="0 0 640 544">
                <path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z"/>
            </svg>
            <!-- Show Close Icon when open -->
            <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

/**
 * A helper function for fetching with exponential backoff.
 * This helps handle rate limits or temporary server errors.
 */
async function fetchWithBackoff(url, options, retries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response; // Success

            // Handle client errors (4xx) - don't retry
            if (response.status >= 400 && response.status < 500) {
                console.error("Client error:", response.status);
                let errorText = "Client error";
                try {
                  errorText = await response.text();
                } catch (e) {}
                lastError = new Error(`Client error: ${response.status} ${errorText}`);
                break; // Break loop, don't retry
            }

            // Handle server errors (5xx) or rate limits (429) - retry
            console.warn(`Server error (${response.status}). Retrying in ${delay * Math.pow(2, i)}ms...`);
            lastError = new Error(`Server error: ${response.status}`);
            
        } catch (error) { // Network errors
            console.warn(`Network error. Retrying in ${delay * Math.pow(2, i)}ms...`);
            lastError = error;
        }
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
    // If we break or finish loop without returning, throw the last error
    console.error("Max retries reached or client error. Error:", lastError);
    throw lastError;
}


// --- Reactive State ---
const isOpen = ref(false);
const userInput = ref('');
const isLoading = ref(false);
const messages = ref([
    { role: 'bot', text: 'Hello! How can I assist you today?' }
]);
const chatBody = ref(null); // DOM element ref for scrolling
const fileInput = ref(null); // DOM element ref for file input
const selectedImageBase64 = ref(null); // Stores the staged image

// --- Functions ---

// Function to toggle the chat window
const toggleChat = () => {
    isOpen.value = !isOpen.value;
};

// Triggers the hidden file input
const triggerFileUpload = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

// Clears the selected image preview
const clearSelectedImage = () => {
    selectedImageBase64.value = null;
    if (fileInput.value) {
        fileInput.value.value = null; // Clear the input's value
    }
};

// Handles file selection and converts to base64
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) {
        clearSelectedImage();
        return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        console.error("Selected file is not an image.");
        clearSelectedImage();
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImageBase64.value = e.target.result;
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        clearSelectedImage();
    };
    reader.readAsDataURL(file);
};


// Function to send a message to the AI
const sendMessage = async () => {
    const messageText = userInput.value.trim();
    const imageToSend = selectedImageBase64.value;

    // Don't send if both text and image are empty
    if (!messageText && !imageToSend) return;

    isLoading.value = true;

    // 1. Add user's message to chat
    const userMessage = { 
        role: 'user', 
        text: messageText,
        image: imageToSend // Add image data (will be null if none)
    };
    messages.value.push(userMessage);
    
    // Clear inputs
    userInput.value = '';
    clearSelectedImage();

    // 2. Prepare API request
    const apiKey = "AIzaSyBpmTZfjWAe27eagNKzwlSOzezKdNKdeSs"; // API key is handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    // Map our chat history to the API's expected format
    const apiMessages = messages.value.map(msg => {
        const parts = [];
        
        // Always add text, even if empty, as per API structure
        parts.push({ text: msg.text || "" }); // Ensure text is never null

        // Add image data if it exists for this user message
        if (msg.role === 'user' && msg.image) {
            try {
                const mimeType = msg.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
                const base64Data = msg.image.split(',')[1];
                
                parts.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                    }
                });
            } catch (e) {
                console.error("Error processing base64 image data:", e);
            }
        }
        
        return {
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: parts
        };
    });

    // Define the AI's role (updated)
    const systemPrompt = "You are a helpful technician. When a user describes an issue, your goal is to help them solve it. Provide clear, concise, and short answers to guide them through troubleshooting steps. If the user uploads an image of the issue, analyze it and use it to inform your troubleshooting steps. Keep your answers as short as possible.";

    const payload = {
        contents: apiMessages,
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    // 3. Call API with error handling and backoff
    try {
        const response = await fetchWithBackoff(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
            const botResponse = result.candidates[0].content.parts[0].text;
            messages.value.push({ role: 'bot', text: botResponse });
        } else {
             // Handle cases where response is missing candidates or text (e.g. safety block)
            if (result.promptFeedback && result.promptFeedback.blockReason) {
              console.error("Prompt blocked:", result.promptFeedback.blockReason);
              messages.value.push({ role: 'bot', text: 'I cannot respond to that request.' });
            } else {
              throw new Error("Invalid API response structure");
            }
        }
        
    } catch (error) {
        console.error("Failed to send message:", error);
        messages.value.push({ role: 'bot', text: 'Sorry, I encountered an error. Please try again.' });
    } finally {
        isLoading.value = false;
    }
};

// --- Watchers ---

// Watch the 'messages' array. When it changes, scroll to the bottom.
watch(messages, async () => {
    await nextTick(); // Wait for the DOM to update
    if (chatBody.value) {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
}, { deep: true }); // 'deep' ensures we watch for additions to the array

</script>

<!-- 
  Note: This <style> tag is NOT scoped.
  This is intentional so the animations and scrollbar apply correctly.
  If you move this to a scoped tag, you may need to use :deep() selectors.
-->
<style>
/* Animation for the chat window */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.slide-up-enter-to,
.slide-up-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* Custom scrollbar for the chat body */
.chat-body::-webkit-scrollbar {
  width: 6px;
}
.chat-body::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* Tailwind 'slate-300' */
  border-radius: 3px;
}
.chat-body::-webkit-scrollbar-track {
  background-color: #f1f5f9; /* Tailwind 'slate-100' */
}
</style>
