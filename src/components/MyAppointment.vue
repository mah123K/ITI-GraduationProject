<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase' // Make sure this path is correct
// MODIFIED: Import updateDoc instead of setDoc
import { doc, getDoc, updateDoc } from 'firebase/firestore' 

const props = defineProps({
  technicianId: {
    type: String,
    required: true,
  },
})

const loading = ref(true)
const saving = ref(false)

// Define the structure for each day
const days = ref([
  { name: 'Monday', active: false, start: '09:00', end: '17:00' },
  { name: 'Tuesday', active: false, start: '09:00', end: '17:00' },
  { name: 'Wednesday', active: false, start: '09:00', end: '17:00' },
  { name: 'Thursday', active: false, start: '09:00', end: '17:00' },
  { name: 'Friday', active: false, start: '09:00', end: '17:00' },
  { name: 'Saturday', active: false, start: '09:00', end: '17:00' },
  { name: 'Sunday', active: false, start: '09:00', end: '17:00' },
])

// Generate time options (e.g., 08:00, 08:30, ...)
const timeOptions = ref([])
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = h.toString().padStart(2, '0')
    const minute = m.toString().padStart(2, '0')
    timeOptions.value.push(`${hour}:${minute}`)
  }
}

// MODIFIED: Load availability from the main technician document
const loadAvailability = async () => {
  if (!props.technicianId) return
  loading.value = true
  try {
    // Point directly to the technician's document
    const docRef = doc(db, 'technicians', props.technicianId) 
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      // Get data from the 'availability' field
      const scheduleData = docSnap.data().availability 
      
      // Check if scheduleData is an array (it might be the old "55" string)
      if (Array.isArray(scheduleData)) {
        // Map loaded data to the local 'days' ref
        days.value = days.value.map(day => {
          const savedDay = scheduleData.find(d => d.name === day.name)
          // Merge saved data with default structure if found, otherwise keep default
          return savedDay ? { ...day, ...savedDay } : day
        })
      } else {
        console.warn("Availability data is not in the expected format (array). Using defaults.");
        // Keep the default days structure if the field wasn't an array
      }
    } else {
      console.warn("Technician document not found. Using default availability.");
    }
  } catch (error) {
    console.error("Error loading availability:", error)
  }
  loading.value = false
}

// MODIFIED: Save the availability array directly into the technician document
const saveAvailability = async () => {
  if (!props.technicianId) return
  saving.value = true
  try {
    // Point directly to the technician's document
    const docRef = doc(db, 'technicians', props.technicianId) 
    
    // Use updateDoc to merge the availability field without overwriting other fields
    await updateDoc(docRef, { 
      availability: days.value // Save the entire array to the 'availability' field
    }) 
    alert('Availability saved successfully!')
  } catch (error) {
    console.error("Error saving availability:", error)
    alert('Failed to save availability.')
  }
  saving.value = false
}

// Load data when the component is mounted
onMounted(() => {
  loadAvailability()
})
</script>