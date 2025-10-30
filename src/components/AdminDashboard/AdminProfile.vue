<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6">
      <h2 class="text-2xl font-semibold text-[#5984C6] mb-4">Admin Profile Settings</h2>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8 text-gray-600">Loading profile...</div>

      <!-- Content -->
      <div v-else>
        <!-- Profile Picture Section -->
        <div class="flex flex-col items-center mb-6">
          <div class="relative">
            <div
              @click="triggerFileInput"
              class="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition"
            >
              <img
                v-if="photoURL"
                :src="photoURL"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <i v-else class="fa-solid fa-user text-4xl text-gray-500"></i>
            </div>
            
            <!-- Delete Image Button -->
         <button
  v-if="photoURL"
  @click="deleteProfileImage"
  class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
  title="Remove profile picture"
>
  <i class="fa-solid fa-xmark text-[10px]"></i>
</button>

          </div>

          <!-- Upload Instructions -->
          <p class="text-sm text-gray-500 mt-2">
            {{ photoURL ? 'Click to change picture' : 'Click to add picture' }}
          </p>

          <!-- Hidden Input for image -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="hidden"
          />
        </div>

        <!-- Profile Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Name</label>
            <input
              v-model="name"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              disabled
              class="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            @click="updateProfile"
            :disabled="saving"
            class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4a6ea8] transition"
          >
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
        
        <div class="mt-3">
          
          <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, storage } from "../../firebase/firebase";
import { getDoc, doc, updateDoc,setDoc } from "firebase/firestore";

import { updateProfile } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      name: "",
      email: "",
      photoURL: "",
      file: null,
      loading: true,
      saving: false,
      successMessage: '',
      errorMessage: '',
    };
  },

  async created() {
    const user = auth.currentUser;
    if (!user) {
      this.loading = false;
      return;
    }

    // 🔹 بيانات من Firebase Auth
    this.email = user.email;
    this.photoURL = user.photoURL || "";
    this.name = user.displayName || "Admin";

    // 🔹 بيانات إضافية من Firestore
    const docRef = doc(db, "admin", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      this.name = data.name || this.name;
      if (data.photoURL) this.photoURL = data.photoURL;
    }

    this.loading = false;
  },

  methods: {
    // 🔹 عند الضغط على الصورة
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // Handle image selection and upload to Cloudinary
    async onFileChange(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.file = file;
        this.photoURL = URL.createObjectURL(file);
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Please select a valid image file.';
      }
    },

    // Update profile with Cloudinary image
    // Delete profile image
    async deleteProfileImage() {
      try {
        const user = auth.currentUser;
        if (!user) {
          this.errorMessage = 'Please login first.';
          return;
        }

        this.saving = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Update Firebase Auth profile
        await updateProfile(user, {
          photoURL: null
        });

        // Update Firestore
        const refDoc = doc(db, 'admin', user.uid);
        await setDoc(
          refDoc,
          {
            photoURL: null
          },
          { merge: true }
        );

        // Clear local state and storage
        this.photoURL = null;
        this.file = null;
        localStorage.removeItem('adminPhoto');

        // Dispatch event for header update
        const event = new CustomEvent('adminProfileChanged', {
          detail: {
            photoURL: null
          }
        });
        window.dispatchEvent(event);

        this.successMessage = 'Profile picture removed successfully';
      } catch (error) {
        console.error('Error removing profile picture:', error);
        this.errorMessage = 'Failed to remove profile picture';
      } finally {
        this.saving = false;
      }
    },

    async updateProfile() {
      try {
        const user = auth.currentUser;
        if (!user) {
          this.errorMessage = 'Please login first.';
          return;
        }

        this.saving = true;
        this.errorMessage = '';
        this.successMessage = '';
        let newPhotoURL = this.photoURL;

        if (this.file) {
          try {
            const { uploadImageOnly } = await import('../../composables/useImageUpload');
            newPhotoURL = await uploadImageOnly(this.file);
          } catch (uploadError) {
            console.error('Error uploading to Cloudinary:', uploadError);
            this.errorMessage = 'Failed to upload image. Please try again.';
            this.saving = false;
            return;
          }
        }

        await updateProfile(user, {
          displayName: this.name,
          photoURL: newPhotoURL,
        });

        const refDoc = doc(db, 'admin', user.uid);
        await setDoc(
          refDoc,
          {
            name: this.name,
            photoURL: newPhotoURL,
          },
          { merge: true }
        );
        
        this.photoURL = newPhotoURL;
        localStorage.setItem('adminPhoto', newPhotoURL);
        localStorage.setItem('adminName', this.name);
        
        // Dispatch event for header update
        const event = new CustomEvent('adminProfileChanged', {
          detail: {
            name: this.name,
            photoURL: newPhotoURL
          }
        });
        window.dispatchEvent(event);

   
        try {
          window.dispatchEvent(new Event('adminProfileChanged'));
        } catch (e) {
          // ignore
        }
        // also update any UI that listens to auth change
      } catch (err) {
        console.error('Error updating profile:', err);
        this.errorMessage = 'Failed to update profile.';
      } finally {
        this.saving = false;
        // clear messages after a short delay
        setTimeout(() => {
          this.successMessage = '';
          this.errorMessage = '';
        }, 3000);
      }
    },
    },
    };
</script>

<style scoped>
input[type="file"] {
  border: none;
}
</style>
