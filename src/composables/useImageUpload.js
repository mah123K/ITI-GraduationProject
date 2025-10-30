// // 📁 src/composables/useImageUpload.js
// import axios from "axios";
// import { db } from "@/firebase/firebase";
// import { addDoc, collection } from "firebase/firestore";

// /**
//  * Uploads an image file to Cloudinary and saves the URL to Firestore.
//  * 
//  * @param {File} file - The image file to upload
//  * @param {String} collectionName - Firestore collection name (e.g. "technicians")
//  * @param {String} keyName - Key name to store the image under (e.g. "profileImage" or "idCardImage")
//  * @param {Object} [extraData={}] - Optional extra fields to save with the image URL
//  * @returns {String} The Cloudinary image URL
//  */
// export async function uploadAndSaveImage(file, collectionName, keyName, extraData = {}) {
//   if (!file) throw new Error("No file provided");
//   if (!collectionName) throw new Error("No Firestore collection name provided");
//   if (!keyName) throw new Error("No key name provided");

//   // 🔧 Cloudinary Configuration
//   const cloudName = "dnzqq4f24"; // ⬅️ Replace with your real Cloud Name
//   const uploadPreset = "unsigned_preset"; // ⬅️ Replace with your real unsigned preset

//   try {
//     // 1️⃣ Upload the image to Cloudinary
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", uploadPreset);

//     const uploadRes = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       formData
//     );

//     const imageUrl = uploadRes.data.secure_url;

//     // 2️⃣ Save to Firestore
//     const docData = {
//       [keyName]: imageUrl,
//       createdAt: new Date(),
//       ...extraData,
//     };

//     await addDoc(collection(db, collectionName), docData);

//     console.log(`✅ Uploaded to Cloudinary and saved to Firestore → ${collectionName}.${keyName}`);
//     return imageUrl;
//   } catch (error) {
//     console.error("❌ Image upload failed:", error);
//     throw error;
//   }
// }
// 📁 src/composables/useImageUpload.js
import axios from "axios";

/**
 * Uploads an image file to Cloudinary and returns its URL.
 * 
 * @param {File} file - The image file to upload
 * @returns {String} - The Cloudinary image URL
 */
export async function uploadImageOnly(file) {
  if (!file) throw new Error("No file provided");

  const cloudName = "dnzqq4f24"; 
  const uploadPreset = "unsigned_preset"; 

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    const imageUrl = uploadRes.data.secure_url;
    console.log("✅ Uploaded to Cloudinary:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    throw error;
  }
}