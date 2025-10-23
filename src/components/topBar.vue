<template>
  <div ref="wrapper">
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 px-4 max-w-7xl mx-auto"
    >
      <!-- Left section -->
      <div class="flex flex-row items-center w-full md:w-auto">
        <div class="relative flex items-center justify-center pr-4">
          <!-- Filter Button -->
          <button
            id="dropdownDefault"
            @click.stop="toggleDropdown"
            :aria-expanded="showDropdown"
            class="flex items-center justify-center gap-1 px-3 py-2 border rounded-lg border-[#0B161B]/15 text-[#0B161B]/80 hover:bg-[#DAECF6]/30 text-sm md:text-base transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 7v6l-4-2v-4L3 6V4z"
              />
            </svg>
            Filter
          </button>

          <!-- Dropdown Menu -->
          <div
            v-show="showDropdown"
            ref="dropdown"
            class="absolute top-full mt-2 left-32 transform -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50"
          >
            <div class="flex justify-between items-center mb-2">
              <h6 class="text-sm font-medium text-gray-800">Filters</h6>
              <div class="flex gap-3 text-xs">
                <button class="text-blue-500 hover:underline">Save view</button>
                <button class="text-gray-400 hover:text-red-500 transition" @click="clearAll">
                  Clear all
                </button>
              </div>
            </div>

            <input
              v-model="searchKeyword"
              type="text"
              placeholder="Search keywords..."
              class="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            />

            <div class="space-y-2 text-sm text-gray-700 max-h-64 overflow-y-auto">
              <details class="rounded-md p-2" open>
                <summary class="cursor-pointer font-medium text-gray-800">Category</summary>
                <ul class="mt-2 space-y-1 pl-2">
                  <li v-for="cat in categories" :key="cat.id" class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      :id="cat.id"
                      :value="cat.id"
                      v-model="selectedFilters"
                      @change="emitFilters"
                      class="rounded text-blue-600 focus:ring-blue-400"
                    />
                    <label :for="cat.id" class="cursor-pointer text-gray-700">
                      {{ cat.label }}
                    </label>
                  </li>
                </ul>
              </details>

              <details class="rounded-md p-2">
                <summary class="cursor-pointer font-medium text-gray-800">Price</summary>
                <div class="mt-2 space-y-1 pl-2">
                  <label
                    ><input
                      type="checkbox"
                      v-model="selectedFilters"
                      value="low"
                      class="mr-2"
                    />Under $50</label
                  ><br />
                  <label
                    ><input
                      type="checkbox"
                      v-model="selectedFilters"
                      value="medium"
                      class="mr-2"
                    />$50–$200</label
                  ><br />
                  <label
                    ><input
                      type="checkbox"
                      v-model="selectedFilters"
                      value="high"
                      class="mr-2"
                    />Over $200</label
                  >
                </div>
              </details>

              <details class="rounded-md p-2">
                <summary class="cursor-pointer font-medium text-gray-800">Rating</summary>
                <div class="mt-2 space-y-1 pl-2">
                  <label
                    ><input type="radio" v-model="selectedFilters" value="4stars" class="mr-2" />4
                    stars & up</label
                  ><br />
                  <label
                    ><input type="radio" v-model="selectedFilters" value="3stars" class="mr-2" />3
                    stars & up</label
                  >
                </div>
              </details>
            </div>
          </div>
        </div>

        <div class="text-[#0B161B]/90 font-medium text-sm md:text-base whitespace-nowrap">
          Showing 1–9 of 11 results
        </div>
      </div>

      <!-- Right section -->
      <div
        class="flex flex-row flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end"
      >
        <select
          class="px-3 py-2 border rounded-lg border-[#0B161B]/15 text-[#0B161B]/80 focus:outline-none text-sm md:text-base bg-white transition "
        >
          <option >Default sort</option>
          <option>Rating</option>
          <option>Location</option>
        </select>

        <!-- grid view icon -->
        <div
          @click="changeView('grid')"
          :class="[
            'border rounded-lg border-[#0B161B]/15 w-10 h-10 flex items-center justify-center cursor-pointer transition',
            currentView === 'grid' ? 'bg-[#DAECF6]/40 border-[#5984C6]' : '',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            class="w-6 h-6 text-[#0B161B]"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>

        <!-- list view icon -->
        <div
          @click="changeView('list')"
          :class="[
            'border rounded-lg border-[#0B161B]/15 w-10 h-10 flex items-center justify-center cursor-pointer transition',
            currentView === 'list' ? 'bg-[#DAECF6]/40 border-[#5984C6]' : '',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            class="w-6 h-6 text-[#0B161B]"
          >
            <circle cx="4" cy="6" r="1" fill="currentColor" />
            <line x1="8" y1="6" x2="20" y2="6" />
            <circle cx="4" cy="12" r="1" fill="currentColor" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <circle cx="4" cy="18" r="1" fill="currentColor" />
            <line x1="8" y1="18" x2="20" y2="18" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  data() {
    return {
      showDropdown: false,
      searchKeyword: "",
      selectedFilters: [],
      currentView: "grid",
      categories: [
        { id: "All Governments", label: "All Governments" },
        { id: "Cairo", label: "Cairo" },
        { id: "Alex", label: "Alex" },
        { id: "Giza", label: "Giza" },
        { id: "Suez", label: "Suez" },
        { id: "Aswan", label: "Aswan" },
        { id: "Luxor", label: "Luxor" },
        { id: "Red Sea", label: "Red Sea" },
      ],
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    changeView(view) {
      this.currentView = view;
      this.$emit("view-changed", view);
      this.showDropdown = false;
    },
    handleDocumentClick(e) {
      const wrapper = this.$refs.wrapper;
      if (wrapper && !wrapper.contains(e.target)) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
  },
};
</script>

<style scoped></style>
