<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">{{ $t('adminDashboard.providers.title') }}</h2>

      <!-- Search -->
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="$t('adminDashboard.providers.searchPlaceholder')"
            class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <button
        @click="activeTab = 'company'"
        :class="[
          'px-6 py-3 text-lg font-medium border-b-2',
          activeTab === 'company'
            ? 'border-[#5984C6] text-[#5984C6]'
            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300',
        ]"
      >
        {{ $t('adminDashboard.providers.company') }}
      </button>
      <button
        @click="activeTab = 'craftsmen'"
        :class="[
          'px-6 py-3 text-lg font-medium border-b-2',
          activeTab === 'craftsmen'
            ? 'border-[#5984C6] text-[#5984C6]'
            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300',
        ]"
      >
        {{ $t('adminDashboard.providers.craftsmen') }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6 text-gray-400">
      {{ $t('adminDashboard.providers.loading') }} {{ activeTab === 'company' ? $t('adminDashboard.providers.loadingCompanies') : $t('adminDashboard.providers.loadingCraftsmen') }}...
    </div>

    <!-- Companies Table -->
    <div v-else-if="activeTab === 'company'" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4 p-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ $t('adminDashboard.providers.allCompanies') }}</h3>
        <button @click="toggleSort('createdAt')" class="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition">
          {{ $t('adminDashboard.providers.sortByCreated') }}
          <svg :class="['w-4 h-4 transition-transform', sortOrder === 'asc' ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
      </div>
      <table class="min-w-full text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.profile') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.companyName') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.email') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.phone') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.address') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.rating') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.orders') }}</th>
            <th class="py-3 px-6 text-left">{{ $t('adminDashboard.providers.status') }}</th>
                <th class="py-3 px-16  text-left">{{ $t('adminDashboard.providers.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="company in filteredCompanies"
            :key="company.id"
             class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-800 transition"
          >
            <td class="py-3 px-4">
              <div class="h-10 w-10 rounded-full bg-[#e8f0fe] dark:bg-gray-800 overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold">
                <img :src="getProviderImage(company) || defaultAvatar" alt="logo" class="h-full w-full object-cover" @error="onImgError" />
              </div>
            </td>
            <td class="py-3 px-4">{{ company.name }}</td>
            <td class="py-3 px-4">{{ company.email }}</td>
            <td class="py-3 px-4">{{ company.phone || '-' }}</td>
          <td class="py-3 px-4">{{ formatAddress(company) }}</td>

            <td class="py-3 px-4 flex items-center space-x-1">
              <span>{{ company.rating ?? 0 }}</span>
              <i class="bi bi-star-fill text-yellow-400"></i>
            </td>
            <td class="py-3 px-4">{{ company.orderCount ?? 0 }}</td>

            <td class="py-3 px-6">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  company.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : company.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ company.status === 'banned' ? $t('adminDashboard.providers.banned') : company.status === 'pending' ? $t('adminDashboard.providers.pending') : $t('adminDashboard.providers.active') }}
              </span>
            </td>
            <td class="py-3 px-6 flex space-x-2">
              <button @click="viewProvider(company)" class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 transition" :title="$t('adminDashboard.providers.view')">
                <i class="bi bi-eye"></i>
              </button>
              <div class="h-3 border-l border-gray-300 dark:border-gray-600 mt-3"></div>
              <button @click="openEditModal(company)" class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition" :title="$t('adminDashboard.providers.edit')">
                <i class="bi bi-pencil"></i>
              </button>
              <div class="h-3 border-l border-gray-300 dark:border-gray-600 mt-3"></div>
              <button
                v-if="company.status !== 'banned'"
                @click="openSuspendModal(company)"
                class="p-2 rounded-lg text-red-500 hover:bg-orange-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                :title="$t('adminDashboard.providers.suspend')"
              >
                <i class="bi bi-slash-circle"></i>
              </button>
              <button
                v-else
                @click="openReactivateModal(company)"
                class="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition"
                :title="$t('adminDashboard.providers.reactivate')"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              <div class="h-3 border-l border-gray-300 dark:border-gray-600 mt-3"></div>
              <button @click="openDeleteModal(company)" class="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition" :title="$t('adminDashboard.providers.delete')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Craftsmen Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4 p-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ $t('adminDashboard.providers.allCraftsmen') }}</h3>
        <button @click="toggleSort('createdAt')" class="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition">
          {{ $t('adminDashboard.providers.sortByCreated') }}
          <svg :class="['w-4 h-4 transition-transform', sortOrder === 'asc' ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
      </div>
      <table class="min-w-full text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.profile') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.name') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.email') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.phone') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.address') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.skill') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.rating') }}</th>
            <th class="py-3 px-4 text-left">{{ $t('adminDashboard.providers.orders') }}</th>
            <th class="py-3 px-8 text-left">{{ $t('adminDashboard.providers.status') }}</th>
            <th class="py-3 px-16  text-left">{{ $t('adminDashboard.providers.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="craft in filteredCraftsmen"
            :key="craft.id"
             class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-800 transition"
          >
            <td class="py-2 px-3">
              <div class="h-10 w-10 rounded-full bg-[#e8f0fe] dark:bg-gray-800 overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold">
                <img :src="getProviderImage(craft) || defaultAvatar" alt="avatar" class="h-full w-full object-cover" @error="onImgError" />
              </div>
            </td>
            <td class="py-2 px-3">{{ craft.name }}</td>
            <td class="py-2 px-3">{{ craft.email }}</td>
            <td class="py-2 px-3">{{ craft.phone || '-' }}</td>
            <td class="py-2 px-3">{{ formatAddress(craft) }}</td>

            <td class="py-2 px-3">{{ craft.skill || '-' }}</td>
            <td class="py-2 px-3 flex items-center space-x-1">
              <span>{{ craft.rating ?? 0 }}</span>
              <i class="bi bi-star-fill text-yellow-400"></i>
            </td>
            <td class="py-2 px-3">{{ craft.orderCount ?? 0 }}</td>
            <td class="py-3 px-8">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  craft.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : craft.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ craft.status === 'banned' ? $t('adminDashboard.providers.banned') : craft.status === 'pending' ? $t('adminDashboard.providers.pending') : $t('adminDashboard.providers.active') }}
              </span>
            </td>
            <td class="py-3 px-4 flex space-x-2">
              <button @click="viewProvider(craft)" class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 transition" :title="$t('adminDashboard.providers.view')">
                <i class="bi bi-eye"></i>
              </button>
              <div class="h-3 border-l border-gray-300 dark:border-gray-600 mt-3"></div>
              <button @click="openEditModal(craft)" class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition" :title="$t('adminDashboard.providers.edit')">
                <i class="bi bi-pencil"></i>
              </button>
              <div class="h-3 border-l border-gray-300 dark:border-gray-600 mt-3"></div>
              <button
                v-if="craft.status !== 'banned'"
                @click="openSuspendModal(craft)"
                class="p-2 rounded-lg text-red-500 hover:bg-orange-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                :title="$t('adminDashboard.providers.suspend')"
              >
                <i class="bi bi-slash-circle"></i>
              </button>
              <button
                v-else
                @click="openReactivateModal(craft)"
                class="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition"
                :title="$t('adminDashboard.providers.reactivate')"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              <div class="h-3 border-l border-gray-300 dark:border-gray-600 mt-3"></div>
              <button @click="openDeleteModal(craft)" class="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition" :title="$t('adminDashboard.providers.delete')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CONFIRMATION MODALS -->
    <div v-if="showDeleteModal || showSuspendModal || showReactivateModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

      <!-- Delete Modal -->
      <div v-if="showDeleteModal" class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h3 class="text-xl font-semibold text-red-600 mb-4">{{ $t('adminDashboard.providers.deleteProvider') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('adminDashboard.providers.confirmDelete') }} "<strong>{{ selectedActionProvider?.name }}</strong>"?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{{ $t('adminDashboard.providers.delete') }}</button>
          <button @click="closeModals" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">{{ $t('adminDashboard.providers.cancel') }}</button>
        </div>
      </div>

      <!-- Suspend Modal -->
      <div v-if="showSuspendModal" class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h3 class="text-xl font-semibold  text-red-600 mb-4">{{ $t('adminDashboard.providers.suspendProvider') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('adminDashboard.providers.confirmSuspend') }} "<strong>{{ selectedActionProvider?.name }}</strong>"?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmSuspend" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-600">{{ $t('adminDashboard.providers.suspend') }}</button>
          <button @click="closeModals" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">{{ $t('adminDashboard.providers.cancel') }}</button>
        </div>
      </div>

      <!-- Reactivate Modal -->
      <div v-if="showReactivateModal" class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <h3 class="text-xl font-semibold text-green-600 mb-4">{{ $t('adminDashboard.providers.reactivateProvider') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{{ $t('adminDashboard.providers.confirmReactivate') }} "<strong>{{ selectedActionProvider?.name }}</strong>"?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmReactivate" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{{ $t('adminDashboard.providers.reactivate') }}</button>
          <button @click="closeModals" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">{{ $t('adminDashboard.providers.cancel') }}</button>
        </div>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="relative bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
      <button @click="closeViewModal" class="absolute top-4 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">✖</button>

      <div class="flex items-center gap-4 mb-4">
        <div class="h-16 w-16 rounded-full bg-[#e8f0fe] dark:bg-gray-800 overflow-hidden flex items-center justify-center text-[#5984C6] text-xl font-semibold">
          <img :src="getProviderImage(selectedProvider) || defaultAvatar" alt="avatar" class="h-full w-full object-cover" @error="onImgError" />
        </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-2xl font-semibold text-[#5984C6] truncate">{{ selectedProvider?.name || 'Provider' }}</h3>
            <div class="mt-1">
              <span :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  selectedProvider?.status === 'banned' ? 'bg-red-100 text-red-600'
                  : selectedProvider?.status === 'pending' ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'
                ]">
                {{ selectedProvider?.status === 'banned' ? $t('adminDashboard.providers.banned') : selectedProvider?.status === 'pending' ? $t('adminDashboard.providers.pending') : $t('adminDashboard.providers.active') }}
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate"><i class="bi bi-geo-alt-fill mr-1"></i>{{ formatAddress(selectedProvider) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm">
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.email') }}</p>
            <p class="font-medium break-all">{{ selectedProvider?.email || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.phone') }}</p>
            <p class="font-medium">{{ selectedProvider?.phone || '-' }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.address') }}</p>
            <p class="font-medium wrap-break-word">{{ formatAddress(selectedProvider) }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.created') }}</p>
            <p class="font-medium">{{ selectedProvider?.createdAt ? new Date(selectedProvider.createdAt).toLocaleString() : '-' }}</p>
          </div>
          <div v-if="selectedProvider?.skill">
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.skill') }}</p>
            <p class="font-medium">{{ selectedProvider.skill }}</p>
          </div>
          <div v-if="selectedProvider?.rating !== undefined">
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.rating') }}</p>
            <p class="font-medium flex items-center gap-1">{{ selectedProvider.rating }} <i class="bi bi-star-fill text-yellow-400"></i></p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('adminDashboard.providers.orders') }}</p>
            <p class="font-medium">{{ selectedProvider.orderCount ?? 0 }} {{ $t('adminDashboard.providers.total') }} · {{ selectedProvider.completedCount ?? 0 }} {{ $t('adminDashboard.providers.completed') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <button @click="closeEditModal" class="absolute top-4 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">✖</button>
        <h3 class="text-2xl font-semibold text-[#5984C6] mb-4">{{ $t('adminDashboard.providers.editProvider') }}</h3>
        <form @submit.prevent="saveProviderChanges" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.providers.name') }}</label>
            <input v-model="editForm.name" type="text" class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.providers.email') }}</label>
            <input v-model="editForm.email" type="email" class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.providers.phone') }}</label>
            <input v-model="editForm.phone" type="text" class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.providers.address') }}</label>
            <input v-model="editForm.address" type="text" class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"/>
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">{{ $t('adminDashboard.providers.status') }}</label>
            <select v-model="editForm.status" class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]">
              <option value="active">{{ $t('adminDashboard.providers.active') }}</option>
              <option value="banned">{{ $t('adminDashboard.providers.banned') }}</option>
              <option value="pending">{{ $t('adminDashboard.providers.pending') }}</option>
            </select>
          </div>
          <button type="submit" class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4968a0] transition">{{ $t('adminDashboard.providers.saveChanges') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";

/* STATE */
const route = useRoute();
const searchTerm = ref("");
const activeTab = ref("company");
const loading = ref(true);
const sortKey = ref("createdAt");
const sortOrder = ref("desc");

const companies = ref([]);
const craftsmen = ref([]);
const filteredTechnicians = ref([]);

const showDeleteModal = ref(false);
const showSuspendModal = ref(false);
const showReactivateModal = ref(false);
const selectedActionProvider = ref(null);

const showViewModal = ref(false);
const showEditModal = ref(false);
const selectedProvider = ref(null);
const editForm = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
});

/* FETCH PROVIDERS */
const fetchProviders = async () => {
  loading.value = true;
  try {
    const providersRef = collection(db, "technicians");
    const snapshot = await getDocs(providersRef);
    const allProviders = [];
    snapshot.forEach((d) => {
      const data = d.data() || {};
      allProviders.push({
        id: d.id,
        ...data,
        // rating fields: prefer aggregated stored values
        rating: data.ratingAverage !== undefined ? Number(data.ratingAverage) : (data.rating !== undefined ? Number(data.rating) : 0),
        ratingCount: Number(data.ratingCount || 0),
        // placeholder counts; we'll fetch accurate counts after
        orderCount: Number(data.orderCount || 0),
        completedCount: Number(data.completedCount || 0),
      });
    });

    const selectedCategory = route.query.category;

    // 🟢 الشرط الجديد
    if (selectedCategory) {
      if (selectedCategory.toLowerCase() === "finishing") {
        // لو Finishing → اعرض الشركات فقط
        craftsmen.value = [];
        filteredTechnicians.value = [];
        activeTab.value = "company";
      } else {
        // لو Plumbing / Electrical / Carpentry → اعرض الفنيين فقط اللي skill بتاعتهم متوافقة
        filteredTechnicians.value = allProviders.filter(
          (p) =>
            p.skill &&
            p.skill.toLowerCase() === selectedCategory.toLowerCase()
        );
        companies.value = [];
        activeTab.value = "craftsmen";
      }
    } else {
      // لو مفيش category → اعرض الكل (شركات + فنيين)
      filteredTechnicians.value = allProviders;
      activeTab.value = "company"; // أو اختياري حسب اللي تحبي يظهر أولاً
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
  } finally {
    loading.value = false;
  }
};

// Helper: fetch order counts (total and completed) for given provider ids using 'in' queries in chunks
const fetchOrderCountsForProviderIds = async (ids = []) => {
  if (!ids || ids.length === 0) return {};
  const result = {};
  // initialize
  ids.forEach((id) => {
    result[id] = { orderCount: 0, completedCount: 0 };
  });

  // Firestore 'in' supports up to 10 items per query
  const chunkSize = 10;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    try {
      // total orders for these provider ids
      const ordersRef = collection(db, "orders");
      const qTotal = query(ordersRef, where("technicianId", "in", chunk));
      const snapTotal = await getDocs(qTotal);
      snapTotal.forEach((d) => {
        const data = d.data() || {};
        const pid = data.technicianId;
        if (pid && result[pid]) result[pid].orderCount++;
      });

      // completed orders for these provider ids
      const qCompleted = query(
        ordersRef,
        where("technicianId", "in", chunk),
        where("status", "==", "completed")
      );
      const snapCompleted = await getDocs(qCompleted);
      snapCompleted.forEach((d) => {
        const data = d.data() || {};
        const pid = data.technicianId;
        if (pid && result[pid]) result[pid].completedCount++;
      });
    } catch (e) {
      // if 'in' is not supported or fails, we silently continue — caller can fall back to stored fields
      console.error("Error fetching order counts for provider chunk:", e);
    }
  }

  return result;
};


/* COMPANIES LISTENER */
onMounted(() => {
  const unsubCompanies = onSnapshot(
    collection(db, "companies"),
    (snap) => {
      const list = [];
      snap.forEach((d) => {
        const data = d.data() || {};
        list.push({
          id: d.id,
          userType: "company",
          name: data.name || data.companyName || "",
          email: data.email || data.contact || "",
          phone: data.phone || "",
          address: data.address || "",
          status: data.status || "active",
          createdAt: data.createdAt || "",
          ...data,
          // include rating fields if company document contains aggregated values
          rating: data.ratingAverage !== undefined ? Number(data.ratingAverage) : (data.rating !== undefined ? Number(data.rating) : 0),
          ratingCount: Number(data.ratingCount || 0),
          // placeholders for order counts (will be updated by helper)
          orderCount: Number(data.orderCount || 0),
          completedCount: Number(data.completedCount || 0),
        });
      });
      companies.value = list;

      // fetch order counts for companies and attach
      const ids = list.map((c) => c.id).filter(Boolean);
      if (ids.length) {
        fetchOrderCountsForProviderIds(ids)
          .then((map) => {
            companies.value = companies.value.map((c) => ({
              ...c,
              orderCount: map[c.id]?.orderCount ?? c.orderCount ?? 0,
              completedCount: map[c.id]?.completedCount ?? c.completedCount ?? 0,
            }));
          })
          .catch((e) => console.error("Error attaching company order counts:", e));
      }
    },
    (err) => console.error(err)
  );

  fetchProviders();
});
/* TECHNICIANS REAL-TIME LISTENER */
onMounted(() => {
  const unsubTechnicians = onSnapshot(
    collection(db, "technicians"),
    (snap) => {
      const allProviders = [];
      snap.forEach((d) => {
        const data = d.data() || {};
        allProviders.push({
          id: d.id,
          ...data,
          rating: data.ratingAverage !== undefined ? Number(data.ratingAverage) : (data.rating !== undefined ? Number(data.rating) : 0),
          ratingCount: Number(data.ratingCount || 0),
        });
      });

      const selectedCategory = route.query.category;

      if (selectedCategory) {
        if (selectedCategory.toLowerCase() === "finishing") {
          // لو Finishing → اعرض الشركات فقط
          filteredTechnicians.value = [];
          activeTab.value = "company";
        } else {
          // لو Plumbing / Electrical / Carpentry → اعرض الفنيين فقط اللي skill بتاعتهم متوافقة
          filteredTechnicians.value = allProviders.filter(
            (p) =>
              p.skill &&
              p.skill.toLowerCase() === selectedCategory.toLowerCase()
          ).map((p) => ({
            ...p,
            orderCount: Number(p.orderCount || 0),
            completedCount: Number(p.completedCount || 0),
          }));
          // attach order counts for these filtered technicians
          (async () => {
            const ids = filteredTechnicians.value.map((p) => p.id).filter(Boolean);
            if (ids.length) {
              try {
                const map = await fetchOrderCountsForProviderIds(ids);
                filteredTechnicians.value = filteredTechnicians.value.map((p) => ({
                  ...p,
                  orderCount: map[p.id]?.orderCount ?? p.orderCount ?? 0,
                  completedCount: map[p.id]?.completedCount ?? p.completedCount ?? 0,
                }));
              } catch (e) {
                console.error("Error attaching technician order counts:", e);
              }
            }
          })();
          activeTab.value = "craftsmen";
        }
      } else {
        // لو مفيش category → اعرض كل الفنيين
        filteredTechnicians.value = allProviders.map((p) => ({
          ...p,
          orderCount: Number(p.orderCount || 0),
          completedCount: Number(p.completedCount || 0),
        }));
        // attach order counts for all technicians
        (async () => {
          const ids = filteredTechnicians.value.map((p) => p.id).filter(Boolean);
          if (ids.length) {
            try {
              const map = await fetchOrderCountsForProviderIds(ids);
              filteredTechnicians.value = filteredTechnicians.value.map((p) => ({
                ...p,
                orderCount: map[p.id]?.orderCount ?? p.orderCount ?? 0,
                completedCount: map[p.id]?.completedCount ?? p.completedCount ?? 0,
              }));
            } catch (e) {
              console.error("Error attaching technician order counts:", e);
            }
          }
        })();
      }

      loading.value = false;
    },
    (err) => console.error("Error listening to technicians:", err)
  );

  // تنظيف الاشتراك لما الصفحة تتقفل
  return () => unsubTechnicians();
});


watch(
  () => route.query.category,
  () => fetchProviders()
);

/* COMPUTED FILTERS */
const filteredCompanies = computed(() => {
  let filtered = companies.value.filter((c) =>
    [c.name, c.email, c.phone, c.address].join(" ").toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  // Sort the filtered results
  return filtered.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];
    if (sortKey.value === "createdAt") {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }
    if (sortOrder.value === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
});

const filteredCraftsmen = computed(() => {
  let filtered = filteredTechnicians.value.filter((c) =>
    [c.name, c.email, c.phone, c.address].join(" ").toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  // Sort the filtered results
  return filtered.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];
    if (sortKey.value === "createdAt") {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }
    if (sortOrder.value === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
});

/* SORTING */
const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "desc";
  }
};

/* ACTIONS */
const getCollectionName = (provider) => {
  if (provider.userType) return provider.userType === "company" ? "companies" : "technicians";
  if (provider.skill) return "technicians"; // ✅ إضافة
  return "companies";
};


const openDeleteModal = (p) => { selectedActionProvider.value = p; showDeleteModal.value = true; };
const openSuspendModal = (p) => { selectedActionProvider.value = p; showSuspendModal.value = true; };
const openReactivateModal = (p) => { selectedActionProvider.value = p; showReactivateModal.value = true; };
const closeModals = () => { showDeleteModal.value = false; showSuspendModal.value = false; showReactivateModal.value = false; selectedActionProvider.value = null; };

const confirmDelete = async () => {
  if (!selectedActionProvider.value) return;
  try { await deleteDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id)); }
  catch (err) { console.error(err); }
  finally { closeModals(); }
};

const confirmSuspend = async () => {
  if (!selectedActionProvider.value) return;
  try { await updateDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id), { status: "banned" }); }
  catch (err) { console.error(err); }
  finally { closeModals(); }
};

const confirmReactivate = async () => {
  if (!selectedActionProvider.value) return;
  try { await updateDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id), { status: "active" }); }
  catch (err) { console.error(err); }
  finally { closeModals(); }
};

/* VIEW & EDIT */
const viewProvider = (provider) => { selectedProvider.value = provider; showViewModal.value = true; };
const closeViewModal = () => { showViewModal.value = false; selectedProvider.value = null; };

const openEditModal = (provider) => {
  selectedProvider.value = provider;
  editForm.name = provider.name || "";
  editForm.email = provider.email || "";
  editForm.phone = provider.phone || "";
  editForm.address = provider.address || "";
  editForm.status = provider.status || "active";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedProvider.value = null;
  editForm.name = ""; editForm.email = ""; editForm.phone = ""; editForm.address = ""; editForm.status = "active";
};

const saveProviderChanges = async () => {
  if (!selectedProvider.value) return;
  try {
    await updateDoc(doc(db, getCollectionName(selectedProvider.value), selectedProvider.value.id), {
      name: editForm.name,
      companyName: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      status: editForm.status,
    });
    closeEditModal();
  } catch (err) { console.error(err); }
};

/* HELPERS */
const getProviderImage = (p) => p?.profileImage || p?.logoImage || p?.photoURL || p?.logo || p?.image || '';
const getInitials = (p) => ((p?.name || p?.companyName || p?.email || '-').slice(0,2)).toUpperCase();
const formatAddress = (p) => {
  if (!p) return '-';
  const addr = p.address;
  const parts = [];
  if (addr && typeof addr === 'object') {
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.country) parts.push(addr.country);
  } else if (typeof addr === 'string' && addr.trim()) {
    parts.push(addr.trim());
  }
  if (p.city && !parts.includes(p.city)) parts.push(p.city);
  return parts.length ? parts.join(', ') : '-';
};

const defaultAvatar = 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">\
  <circle cx="32" cy="32" r="32" fill="%23e5e7eb"/>\
  <circle cx="32" cy="24" r="12" fill="%239ca3af"/>\
  <path d="M12 54c4-10 12-16 20-16s16 6 20 16" fill="%239ca3af"/>\
</svg>';

const onImgError = (e) => { if (e && e.target) e.target.src = defaultAvatar; };

// realtime orders counts map and listener
const ordersCountsMap = ref({}); // { [id]: { orderCount, completedCount } }
let ordersUnsubscribe = null;

onMounted(() => {
  try {
    ordersUnsubscribe = onSnapshot(collection(db, "orders"), (snap) => {
      const byTech = {};
      const byComp = {};
      snap.forEach((d) => {
        const data = d.data() || {};
        const tech = data.technicianId || null;
        const comp = data.companyId || data.providerId || data.providerID || null;
        if (tech) {
          if (!byTech[tech]) byTech[tech] = { orderCount: 0, completedCount: 0 };
          byTech[tech].orderCount++;
          if ((data.status || "").toLowerCase() === "completed") byTech[tech].completedCount++;
        }
        if (comp) {
          if (!byComp[comp]) byComp[comp] = { orderCount: 0, completedCount: 0 };
          byComp[comp].orderCount++;
          if ((data.status || "").toLowerCase() === "completed") byComp[comp].completedCount++;
        }
      });

      ordersCountsMap.value = { byTech, byComp };

      // attach to technicians currently loaded
      if (filteredTechnicians.value && filteredTechnicians.value.length) {
        filteredTechnicians.value = filteredTechnicians.value.map((p) => ({
          ...p,
          orderCount: byTech[p.id]?.orderCount ?? p.orderCount ?? 0,
          completedCount: byTech[p.id]?.completedCount ?? p.completedCount ?? 0,
        }));
      }

      // attach to companies currently loaded
      if (companies.value && companies.value.length) {
        companies.value = companies.value.map((c) => ({
          ...c,
          orderCount: byComp[c.id]?.orderCount ?? c.orderCount ?? 0,
          completedCount: byComp[c.id]?.completedCount ?? c.completedCount ?? 0,
        }));
      }
    }, (err) => console.error("Orders realtime error:", err));
  } catch (e) {
    console.error("Failed to start orders realtime listener:", e);
  }
});

onUnmounted(() => {
  if (typeof ordersUnsubscribe === "function") ordersUnsubscribe();
});
</script>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.2s ease-in-out; }
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
</style>
