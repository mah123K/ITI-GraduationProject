<template>
  <div class="p-8">
    <h2 class="text-2xl font-semibold text-[#133B5D] mb-6">My Work Gallery</h2>

    <!-- Upload Button Card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Upload Box -->
      <div
        class="flex flex-col items-center justify-center border-2 border-dashed border-[#133B5D]/50 rounded-2xl p-6 bg-white shadow hover:shadow-lg cursor-pointer transition"
        @click="triggerUpload"
      >
        <i class="fa-solid fa-upload text-5xl text-[#133B5D] mb-3"></i>
        <p class="text-[#133B5D] font-semibold">Upload Photo</p>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*"
          multiple
          @change="handleUpload"
        />
        <p v-if="images.length >= 15" class="text-red-500 text-sm mt-2">
          (Maximum 15 images)
        </p>
      </div>

      <!-- Gallery Images -->
      <div
        v-for="(img, index) in images"
        :key="index"
        class="relative rounded-2xl overflow-hidden bg-white shadow-lg"
      >
        <img
          :src="img.url"
          alt="Work photo"
          class="w-full h-48 object-cover rounded-2xl"
        />
        <button
          @click="confirmDelete(img.id)"
          class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
        >
          <i class="fa-solid fa-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Popup confirmation -->
    <AlertPopup
      :show="showPopup"
      :message="popupMessage"
      @close="handlePopupClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { uploadImageOnly } from "@/composables/useImageUpload";
import AlertPopup from "../AlertPopup.vue";

const images = ref([]);
const technicianId = ref(null);
const showPopup = ref(false);
const popupMessage = ref("");
const deleteTarget = ref(null);
const fileInput = ref(null);

const triggerUpload = () => {
  if (images.value.length >= 15) {
    popupMessage.value = "You can only upload up to 15 images.";
    showPopup.value = true;
    return;
  }
  fileInput.value.click();
};

const handleUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  if (!technicianId.value) return;

  const remainingSlots = 15 - images.value.length;
  const uploadList = files.slice(0, remainingSlots);

  for (const file of uploadList) {
    const imageUrl = await uploadImageOnly(file);
    await addDoc(collection(db, "technicians", technicianId.value, "gallery"), {
      url: imageUrl,
      uploadedAt: serverTimestamp(),
    });
  }

  popupMessage.value = "Images uploaded successfully!";
  showPopup.value = true;
  await loadGallery();
};

const confirmDelete = (id) => {
  deleteTarget.value = id;
  popupMessage.value = "Are you sure you want to delete this image?";
  showPopup.value = true;
};

const handlePopupClose = async (confirmed) => {
  // When AlertPopup closes
  if (deleteTarget.value && confirmed === true) {
    await deleteDoc(doc(db, "technicians", technicianId.value, "gallery", deleteTarget.value));
    deleteTarget.value = null;
    popupMessage.value = "Image deleted successfully!";
    await loadGallery();
  }
  showPopup.value = false;
};

const loadGallery = async () => {
  if (!technicianId.value) return;
  const col = collection(db, "technicians", technicianId.value, "gallery");
  const snap = await getDocs(col);
  images.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    technicianId.value = user.uid;
    await loadGallery();
  }
});
</script>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
