<template>
  <div class="profiles-page">
    <h1 class="main-header mt-20">
      {{ $t(translatedServiceName) }} {{ $t('profilesPage.titleSuffix') }}
    </h1>

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
      isLoading: false,
      profiles: [],
    };
  },
  computed: {
    // UPDATED: New computed property to translate the service name
    translatedServiceName() {
      if (!this.serviceName || this.serviceName === "all") {
        return 'profilesPage.allProfiles';
      }
      const key = this.serviceName;
      
      // Map route param to your existing navbar translation keys
      if (key === 'plumbing') return 'navbar.plumbing';
      if (key === 'electrical') return 'navbar.electrical';
      if (key === 'finishing') return 'navbar.finishing';
      if (key === 'carpentry') return 'navbar.carpentry';
      
      return this.serviceName; // Fallback if no match
    },
    
    filteredProfiles() {
      let results = this.profiles;

      if (this.serviceName && this.serviceName !== "All") {
        results = results.filter(
          (p) => p.service === this.serviceName
        );
      }

      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword;
        results = results.filter(
          (p) =>
            p.name.includes(kw) ||
            p.bio.includes(kw)
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

    async fetchProfiles() {
      this.isLoading = true;
      this.profiles = []; 
      
      try {
        const techniciansCol = collection(db, "technicians");
        const snapshot = await getDocs(techniciansCol);
        
        const fetchedProfiles = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          fetchedProfiles.push({
            id: doc.id,
            name: data.name,
            service: data.skill,
            // UPDATED: Use $t for fallback text
            location: data.city || this.$t('profilesPage.fallbackLocation'),
            rating: data.rating || 0,
            // UPDATED: Use $t for fallback text
            bio: data.description || this.$t('profilesPage.fallbackBio'),
            profileImage: data.profileImage || null
          });
        });
        
        this.profiles = fetchedProfiles;

      } catch (error) {
        console.error("Error fetching profiles: ", error);
        // UPDATED: Use $t for the error message
        alert(this.$t('profilesPage.loadingError'));
      }
      this.isLoading = false;
    },
  },
  mounted() {
    this.serviceName = this.$route.params.service || "All";
    this.fetchProfiles();
  },
  watch: {
    $route(to) {
      this.serviceName = to.params.service || "All";
    },
  },
};
</script>