<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6">
    <div class="max-w-2xl mx-auto bg-white dark:bg-[#1f2937] shadow-md rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">{{ $t('adminDashboard.adminProfile.title') }}</h2>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8 text-gray-600 dark:text-gray-300">{{ $t('adminDashboard.adminProfile.loading') }}</div>

      <!-- Content -->
      <div v-else>
        <!-- Profile Picture Section -->
        <div class="flex flex-col items-center mb-6">
          <div class="relative">
            <div
              @click="triggerFileInput"
              class="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition"
            >
              <img
                v-if="photoURL && photoURL !== 'null' && !photoURL.startsWith('undefined')"
                :src="photoURL"
                alt="Profile"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <i v-else class="fa-solid fa-user text-4xl text-gray-500"></i>
            </div>
            
          <!-- Delete Image Button -->
         <button
  v-if="photoURL"
  @click="deleteProfileImage"
  class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
  :title="$t('adminDashboard.adminProfile.removeProfilePicture')"
>
  <i class="fa-solid fa-xmark text-[10px]"></i>
</button>

          </div>

          <!-- Upload Instructions -->
          <p class="text-sm text-gray-500 dark:text-gray-300 mt-2">
            {{ photoURL ? $t('adminDashboard.adminProfile.clickToChange') : $t('adminDashboard.adminProfile.clickToAdd') }}
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
            <label class="block text-gray-700 dark:text-gray-200 mb-1">{{ $t('adminDashboard.adminProfile.name') }}</label>
            <input
              v-model="name"
              type="text"
              class="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block text-gray-700 dark:text-gray-200 mb-1">{{ $t('adminDashboard.adminProfile.email') }}</label>
            <input
              v-model="email"
              type="email"
              disabled
              class="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 cursor-not-allowed"
            />
          </div>

          <button
            @click="updateProfile"
            :disabled="saving"
            class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4a6ea8] transition"
          >
            {{ saving ? $t('adminDashboard.adminProfile.saving') : $t('adminDashboard.adminProfile.saveChanges') }}
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

import { auth, db } from "../../firebase/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { updateProfile, reload } from "firebase/auth";

export default {
  data() {
    return {
      name: "",
      email: "",
      photoURL: "",
      photoPublicId: "", // Add public ID tracking
      file: null,
      loading: true,
      saving: false,
      successMessage: "",
      errorMessage: ""
    };
  },

  async created() {
    const user = auth.currentUser;
    if (!user) {
      this.loading = false;
      return;
    }

    // ✅ Refresh the user data to get the latest photoURL from Firebase Auth
    await reload(user);

    // 🔹 Get data from Firebase Auth
    this.email = user.email;
    this.name = user.displayName || "Admin";

    // 🔹 Get additional data from Firestore
    const docRef = doc(db, "admin", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      this.name = data.name || this.name;
      
      // Check for valid photo URL from Firestore
      if (data.photoURL && data.photoURL !== 'null' && !data.photoURL.startsWith('undefined')) {
        this.photoURL = data.photoURL;
      } else {
        this.photoURL = null;
      }
      
      if (data.photoPublicId) {
        this.photoPublicId = data.photoPublicId;
      }
    } else {
      // If no Firestore data, check Firebase Auth photoURL
      if (user.photoURL && user.photoURL !== 'null' && !user.photoURL.startsWith('undefined')) {
        this.photoURL = user.photoURL;
      } else {
        this.photoURL = null;
      }
    }

    this.loading = false;
  },

  methods: {
    applyTheme(theme) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
        this.isDark = true;
      } else {
        root.removeAttribute('data-theme');
        root.classList.remove('dark');
        this.isDark = false;
      }
    },
    toggleDarkMode() {
      const next = this.isDark ? 'light' : 'dark';
      this.applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    },
    // Handle image load errors
    handleImageError(event) {
      // If image fails to load, set photoURL to null to show default icon
      this.photoURL = null;
      event.target.style.display = 'none';
    },

    // Clear all image caches and states
    async clearImageCaches() {
      // Clear browser cache for the image
      if (this.photoURL) {
        // Add timestamp to force cache invalidation
        const timestamp = Date.now();
        await updateProfile(auth.currentUser, {
          photoURL: `null?t=${timestamp}`
        });
        
        // Clear all storages
        localStorage.removeItem("adminPhoto");
        sessionStorage.removeItem("adminPhoto");
        
        // Clear blob URLs
        if (this.photoURL.startsWith('blob:')) {
          URL.revokeObjectURL(this.photoURL);
        }
        
        // Force reload the image element
        const img = document.querySelector('img[alt="Profile"]');
        if (img) {
          img.src = '';
        }
      }
      
      // Clear file input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      
      this.photoURL = null;
      this.file = null;
    },
    
    // 🔹 When clicking the profile image
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 🔹 Handle image selection
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.errorMessage = this.$t('adminDashboard.adminProfile.noFileSelected');
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        this.errorMessage = this.$t('adminDashboard.adminProfile.selectValidImage');
        this.$refs.fileInput.value = '';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.errorMessage = this.$t('adminDashboard.adminProfile.imageSizeError');
        this.$refs.fileInput.value = '';
        return;
      }

      try {
        this.file = file;
        const tempURL = URL.createObjectURL(file);
        
        // Create an image element to check if it loads correctly
        const img = new Image();
        img.onload = async () => {
          // After successful load, start the upload process immediately
          try {
            const { uploadImageOnly } = await import("../../composables/useImageUpload");
            const uploadResult = await uploadImageOnly(file);
            
            if (uploadResult && uploadResult.url) {
              const user = auth.currentUser;
              if (user) {
                // Update Firebase Auth
                await updateProfile(user, {
                  photoURL: uploadResult.url
                });

                // Update Firestore
                const refDoc = doc(db, "admin", user.uid);
                await setDoc(refDoc, {
                  photoURL: uploadResult.url,
                  photoPublicId: uploadResult.publicId || null,
                  lastImageUpdate: Date.now()
                }, { merge: true });

                // Update local state and storage
                this.photoURL = uploadResult.url;
                this.photoPublicId = uploadResult.publicId;
                localStorage.setItem("adminPhoto", uploadResult.url);

                // Dispatch event for immediate header update
                const event = new CustomEvent("adminProfileChanged", {
                  detail: {
                    photoURL: uploadResult.url,
                    timestamp: Date.now()
                  }
                });
                window.dispatchEvent(event);

        this.successMessage = this.$t('adminDashboard.adminProfile.success');
              }
            }
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            this.errorMessage = this.$t('adminDashboard.adminProfile.error');
          } finally {
            URL.revokeObjectURL(tempURL);
          }
        };

        img.onerror = () => {
          this.errorMessage = this.$t('adminDashboard.adminProfile.errorProcessingImage');
          this.file = null;
          this.photoURL = null;
          URL.revokeObjectURL(tempURL);
          this.$refs.fileInput.value = '';
        };

        // Show the temporary URL while uploading
        this.photoURL = tempURL;
        img.src = tempURL;
        this.errorMessage = "";
        
      } catch (error) {
        console.error("Error handling file:", error);
        this.errorMessage = "Error processing image. Please try again.";
        this.file = null;
        this.photoURL = null;
        this.$refs.fileInput.value = '';
      }
    },

    // 🔹 Delete profile image
    async deleteProfileImage() {
      try {
        const user = auth.currentUser;
        if (!user) {
          this.errorMessage = this.$t('adminDashboard.adminProfile.loginFirst');
          return;
        }

        this.saving = true;
        this.errorMessage = "";
        this.successMessage = "";

        const timestamp = Date.now();

        // Immediately clear local state and UI
        this.photoURL = null;
        this.photoPublicId = null;
        this.file = null;
        
        // Immediately clear storages
        localStorage.removeItem('adminPhoto');
        sessionStorage.removeItem('adminPhoto');

        // Force immediate UI update in all components
        window.dispatchEvent(new CustomEvent('adminProfileChanged', { 
          detail: { 
            name: this.name,
            photoURL: null,
            timestamp,
            forceUpdate: true
          } 
        }));

        // Clear any blob URLs and force image updates
        document.querySelectorAll('img[alt="Profile"]').forEach(img => {
          if (img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
          }
          img.src = '';
          img.style.display = 'none'; // Force hide images
        });

        // Clear file input
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }

        try {
          // Update Firebase Auth first
          await updateProfile(user, { 
            photoURL: null
          });

          // Then update Firestore
          const refDoc = doc(db, 'admin', user.uid);
          await setDoc(refDoc, { 
            photoURL: null, 
            photoPublicId: null,
            lastImageUpdate: timestamp
          }, { merge: true });

          // Force reload user data
          await reload(user);

          // Dispatch another event after backend update
          window.dispatchEvent(new CustomEvent('adminProfileChanged', { 
            detail: { 
              name: this.name,
              photoURL: null,
              timestamp: Date.now(),
              forceUpdate: true
            } 
          }));

          this.successMessage = this.$t('adminDashboard.adminProfile.success');
        } catch (error) {
          throw error; // Re-throw to be caught by outer try-catch
        }
      } catch (error) {
        console.error('Error removing profile picture:', error);
        this.errorMessage = this.$t('adminDashboard.adminProfile.error');
        
        // Try to revert changes if backend operations fail
        try {
          const storedPhoto = localStorage.getItem('adminPhoto');
          if (storedPhoto) {
            this.photoURL = storedPhoto;
            window.dispatchEvent(new CustomEvent('adminProfileChanged', { 
              detail: { 
                name: this.name,
                photoURL: storedPhoto,
                timestamp: Date.now(),
                forceUpdate: true
              } 
            }));
          }
        } catch (e) {
          console.error('Failed to revert changes:', e);
        }
      } finally {
        this.saving = false;
      }
    },

    // 🔹 Update profile info (name + photo)
    async updateProfile() {
      try {
        const user = auth.currentUser;
        if (!user) {
          this.errorMessage = this.$t('adminDashboard.adminProfile.loginFirst');
          return;
        }

        this.saving = true;
        this.errorMessage = "";
        this.successMessage = "";

        let newPhotoURL = this.photoURL;
        let newPhotoPublicId = this.photoPublicId;

        // Upload new image if selected
        if (this.file) {
          try {
            const { uploadImageOnly } = await import("../../composables/useImageUpload");
            console.log("Starting image upload...");
            const uploadResult = await uploadImageOnly(this.file);
            console.log("Upload result:", uploadResult);
            
            if (uploadResult && uploadResult.url) {
              newPhotoURL = uploadResult.url;
              newPhotoPublicId = uploadResult.publicId || null;
              console.log("New photo URL:", newPhotoURL);
            } else {
              throw new Error("Invalid upload result");
            }
          } catch (uploadError) {
            console.error("Error uploading to Cloudinary:", uploadError);
            this.errorMessage = this.$t('adminDashboard.adminProfile.errorProcessingImage');
            this.saving = false;
            return;
          }
        }

        // Update Firebase Auth
        await updateProfile(user, {
          displayName: this.name,
          photoURL: newPhotoURL,
        });

        // Update Firestore with both URL and public ID
        const refDoc = doc(db, "admin", user.uid);
        await setDoc(refDoc, { 
          name: this.name, 
          photoURL: newPhotoURL,
          photoPublicId: newPhotoPublicId 
        }, { merge: true });

        // Update local storage
        this.photoURL = newPhotoURL;
        localStorage.setItem("adminPhoto", newPhotoURL);
        localStorage.setItem("adminName", this.name);

        // Dispatch event for header update
        const event = new CustomEvent("adminProfileChanged", {
          detail: { name: this.name, photoURL: newPhotoURL },
        });
        window.dispatchEvent(event);

        try {
          window.dispatchEvent(new Event("adminProfileChanged"));
        } catch (e) {
          // ignore
        }

        this.successMessage = this.$t('adminDashboard.adminProfile.changesSaved');
      } catch (err) {
        console.error("Error updating profile:", err);
        this.errorMessage = this.$t('adminDashboard.adminProfile.saveError');
      } finally {
        this.saving = false;
        // Clear messages after delay
        setTimeout(() => {
          this.successMessage = "";
          this.errorMessage = "";
        }, 3000);
      }
    },
  },
  mounted() {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const hasClass = document.documentElement.classList.contains('dark');
      const target = saved ? saved : (prefersDark ? 'dark' : 'light');
      // If DOM already matches, just sync isDark; else apply
      if ((hasClass && target === 'dark') || (!hasClass && target === 'light')) {
        this.isDark = target === 'dark';
      } else {
        this.applyTheme(target);
      }
    } catch (e) {
      // fallback: derive from DOM
      this.isDark = document.documentElement.classList.contains('dark');
    }
  }
};
</script>


<style scoped>
input[type="file"] {
  border: none;
}
</style>
