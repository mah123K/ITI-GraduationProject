<template>
  <div class="flex h-screen bg-gray-50">

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-5xl mx-auto p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p class="text-gray-600">Manage your platform settings and preferences</p>
        </div>

        <!-- Admin Profile -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Admin Profile</h2>
          <p class="text-gray-600 mb-6">Update your admin account information</p>

          <form @submit.prevent="handleSaveProfile">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" v-model="formData.name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"/>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" v-model="formData.email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"/>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" v-model="formData.password" placeholder="Enter new password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"/>
            </div>

            <button type="submit" class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </form>
        </div>

        <!-- Platform Settings -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Platform Settings</h2>
          <p class="text-gray-600 mb-6">Configure general platform settings</p>

          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-gray-200" v-for="toggle in toggles" :key="toggle.name">
              <div>
                <h3 class="font-medium text-gray-900">{{ toggle.label }}</h3>
                <p class="text-sm text-gray-600">{{ toggle.description }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData[toggle.name]" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full
                  peer-checked:after:translate-x-full peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Localization -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Localization</h2>
          <p class="text-gray-600 mb-6">Language and regional settings</p>

          <form @submit.prevent="handleSavePreferences">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
              <select v-model="formData.language" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Arabic</option>
              </select>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select v-model="formData.currency" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
                <option>EGP (E£)</option>
              </select>
            </div>

            <button type="submit" class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Save Preferences
            </button>
          </form>
        </div>

        <!-- Commission Settings -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Commission Settings</h2>
          <p class="text-gray-600 mb-6">Set platform commission rates</p>

          <form @submit.prevent="handleUpdateCommission">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
              <input type="number" v-model="formData.commissionRate" min="0" max="100" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>

            <button type="submit" class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Update Commission
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { normalizeName } from '@/utils/normalize';

export default {
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      password: '',
      emailNotifications: true,
      autoApprove: false,
      maintenanceMode: false,
      language: 'English',
      currency: 'USD ($)',
      commissionRate: '15'
    });

    const toggles = [
      { name: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications for new orders' },
      { name: 'autoApprove', label: 'Auto-Approve Providers', description: 'Automatically approve new provider registrations' },
      { name: 'maintenanceMode', label: 'Maintenance Mode', description: 'Put the platform in maintenance mode' }
    ];

    const handleSaveProfile = () => alert('Profile changes saved!');
    const handleSavePreferences = () => alert('Preferences saved!');
    const handleUpdateCommission = () => alert('Commission rate updated!');

    onMounted(async () => {
      const user = auth.currentUser;
      if (user) {
        formData.email = user.email;
        
        const docRef = doc(db, "admin", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          formData.name = normalizeName(data.name || user.displayName);
        } else {
          formData.name = normalizeName(user.displayName);
        }
      }
    });

    return {
      formData,
      toggles,
      handleSaveProfile,
      handleSavePreferences,
      handleUpdateCommission
    };
  }
};
</script>
