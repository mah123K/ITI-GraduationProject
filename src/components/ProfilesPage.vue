<template>
  <div class="profiles-page">
    <h1 class="main-header mt-20">{{ serviceName }} Profiles</h1>

    <TopBar
      @view-changed="currentView = $event"
      @filters-changed="applyFilters"
      @sort-changed="sortProfiles"
      :displayedCount="filteredProfiles.length"
      :totalCount="profiles.length"
    />

    <div
      :class="[
        'px-4 sm:px-8 max-w-7xl mx-auto mb-12 gap-6',
        currentView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col',
      ]"
    >
      <ProfileCard
        v-for="(profile, index) in filteredProfiles"
        :key="index"
        :profile="profile"
        :viewType="currentView"
      />
    </div>
  </div>
</template>

<script>
import ProfileCard from "./ProfileCard.vue";
import TopBar from "./topBar.vue";
// ADD: Import Firebase Firestore functions
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "ProfilesPage",
  components: { ProfileCard, TopBar },
  data() {
    return {
      currentView: "grid",
      serviceName: "",
      searchKeyword: "",
      selectedLocations: [],
      ratingFilter: "",
      sortOption: "default",
      isLoading: false, // ADD: For loading indicator

      // MODIFIED: Start with an empty array
      profiles: [],
    };
  },
  computed: {
    filteredProfiles() {
      let results = this.profiles;

      // This filter now works dynamically with Firebase data
      if (this.serviceName && this.serviceName !== "All") {
        results = results.filter(
          (p) => p.service.toLowerCase() === this.serviceName.toLowerCase()
        );
      }

      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(kw) ||
            p.bio.toLowerCase().includes(kw)
        );
      }

      if (this.selectedLocations.length) {
        results = results.filter((p) =>
          this.selectedLocations.includes(p.location)
        );
      }

      if (this.ratingFilter === "4stars") {
        results = results.filter((p) => p.rating >= 4);
      } else if (this.ratingFilter === "3stars") {
        results = results.filter((p) => p.rating >= 3);
      }

      if (this.sortOption === "rating") {
        results = [...results].sort((a, b) => b.rating - a.rating);
      } else if (this.sortOption === "location") {
        results = [...results].sort((a, b) => a.location.localeCompare(b.location));
      }

      return results;
    },
  },
  methods: {
    applyFilters({ search, locations, rating }) {
      this.searchKeyword = search;
      this.selectedLocations = locations;
      this.ratingFilter = rating;
    },
    sortProfiles(sortValue) {
      this.sortOption = sortValue;
    },

    // ADD: New method to fetch data from Firebase
    async fetchProfiles() {
      this.isLoading = true;
      this.profiles = []; // Clear existing profiles
      
      try {
        const techniciansCol = collection(db, "technicians");
        const snapshot = await getDocs(techniciansCol);
        
        const fetchedProfiles = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Map your Firebase data to the structure your component expects
          fetchedProfiles.push({
            id: doc.id, // Good to have a unique ID
            name: data.name, // Fetched from Firebase
            service: data.skill, // This is the "work type" (skill) from Firebase
            location: data.city || "Not specified", // Map 'city' to 'location'
            rating: data.rating || 0, // Use existing rating or default to 0
            bio: data.description || "No bio provided.", // Map 'description' to 'bio'
            profileImage: data.profileImage || null // Pass profile image URL
          });
        });
        
        this.profiles = fetchedProfiles;

      } catch (error) {
        console.error("Error fetching profiles: ", error);
        alert("Failed to load profiles. Please try again.");
      }
      this.isLoading = false;
    },
  },
  mounted() {
    this.serviceName = this.$route.params.service || "All";
    // ADD: Call the fetch method when the component is mounted
    this.fetchProfiles();
  },
  watch: {
    $route(to) {
      this.serviceName = to.params.service || "All";
      // The computed property 'filteredProfiles' will automatically re-filter
      // when serviceName changes, so you don't need to re-fetch here.
    },
  },
};
</script>

