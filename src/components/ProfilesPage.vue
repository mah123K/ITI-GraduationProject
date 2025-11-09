<template>
  <div class="profiles-page">
    <h1 class="main-header mt-20">
      {{ $t(translatedServiceName) }} {{ $t("profilesPage.titleSuffix") }}
    </h1>

    <TopBar
      @view-changed="currentView = $event"
      @filters-changed="applyFilters"
      @sort-changed="sortProfiles"
      :displayedCount="filteredProfiles.length"
      :totalCount="profilesInCategory.length"
    />

    <div
      v-if="isLoading"
      class="px-4 sm:px-8 max-w-7xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="bg-white rounded-2xl shadow-xl p-4 animate-pulse flex flex-col items-center"
      >
        <div class="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
        <div class="h-4 bg-gray-200 w-2/3 mb-2 rounded"></div>
        <div class="h-3 bg-gray-200 w-1/2 mb-2 rounded"></div>
        <div class="h-3 bg-gray-200 w-3/4 rounded"></div>
      </div>
    </div>

    <div
      v-else
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
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "ProfilesPage",
  components: { ProfileCard, TopBar },
  data() {
    return {
      currentView: "grid",
      serviceName: "",
      searchKeyword: "",
      selectedLocations: [],
      projectsFilter: "",
      ratingMin: null,
      sortOption: "default",
      isLoading: false,
      profiles: [],
      clientCity: null, // Client's city for location-based sorting
    };
  },
  computed: {
    // UPDATED: New computed property to translate the service name
    translatedServiceName() {
      if (!this.serviceName || this.serviceName === "all") {
        return "profilesPage.allProfiles";
      }
      const key = this.serviceName;

      // Map route param to your existing navbar translation keys
      if (key === "plumbing") return "navbar.plumbing";
      if (key === "electrical") return "navbar.electrical";
      if (key === "finishing") return "navbar.finishing";
      if (key === "carpentry") return "navbar.carpentry";

      return this.serviceName; // Fallback if no match
    },
    profilesInCategory() {
      if (!this.serviceName || this.serviceName === "All") {
        return this.profiles;
      }
      return this.profiles.filter((p) => p.service === this.serviceName);
    },

    filteredProfiles() {
      let results = this.profiles;

      // Filter by service name
      if (this.serviceName && this.serviceName !== "All") {
        results = results.filter((p) => p.service === this.serviceName);
      }

      // Filter by search keyword (case-insensitive)
      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword.toLowerCase().trim();
        results = results.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(kw)) ||
            (p.bio && p.bio.toLowerCase().includes(kw)) ||
            (p.service && p.service.toLowerCase().includes(kw))
        );
      }

      // Filter by locations (exact match)
      if (this.selectedLocations.length) {
        results = results.filter((p) => {
          const profileLocation = (p.location || "").toLowerCase().trim();
          return this.selectedLocations.some((loc) => {
            const filterLocation = (loc || "").toLowerCase().trim();
            // Exact match or partial match (e.g., "Cairo" matches "Cairo, Egypt")
            return profileLocation === filterLocation || profileLocation.includes(filterLocation);
          });
        });
      }

      // Filter by projects count (completed orders)
      if (this.projectsFilter) {
        if (this.projectsFilter === "few") {
          results = results.filter((p) => (p.completedOrders || 0) < 10);
        } else if (this.projectsFilter === "medium") {
          results = results.filter(
            (p) => (p.completedOrders || 0) >= 10 && (p.completedOrders || 0) <= 50
          );
        } else if (this.projectsFilter === "many") {
          results = results.filter((p) => (p.completedOrders || 0) > 50);
        }
      }

      // Filter by minimum rating
      if (this.ratingMin !== null && this.ratingMin !== undefined) {
        results = results.filter((p) => (p.rating || 0) >= this.ratingMin);
      }

      // Sort results
      if (this.sortOption === "rating-desc") {
        results = [...results].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA; // Descending (high to low)
        });
      } else if (this.sortOption === "rating-asc") {
        results = [...results].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingA - ratingB; // Ascending (low to high)
        });
      } else if (this.sortOption === "location") {
        // Sort by proximity to client's city
        results = [...results].sort((a, b) => {
          const locA = (a.location || "").toLowerCase().trim();
          const locB = (b.location || "").toLowerCase().trim();
          const clientCityLower = (this.clientCity || "").toLowerCase().trim();

          // If client city is known, prioritize exact matches
          if (clientCityLower) {
            const aMatches = locA === clientCityLower || locA.includes(clientCityLower);
            const bMatches = locB === clientCityLower || locB.includes(clientCityLower);

            if (aMatches && !bMatches) return -1; // a comes first
            if (!aMatches && bMatches) return 1; // b comes first
            if (aMatches && bMatches) {
              // Both match, sort alphabetically
              return locA.localeCompare(locB);
            }
          }

          // If no client city or no matches, sort alphabetically
          return locA.localeCompare(locB);
        });
      } else {
        // Default: sort by name alphabetically
        results = [...results].sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });
      }

      return results;
    },
  },
  methods: {
    applyFilters({ search, locations, projects, ratingMin }) {
      this.searchKeyword = search || "";
      this.selectedLocations = locations || [];
      this.projectsFilter = projects || "";
      this.ratingMin = ratingMin !== undefined ? ratingMin : null;
    },
    sortProfiles(sortValue) {
      this.sortOption = sortValue || "default";
    },

    async fetchProfiles() {
      this.isLoading = true;
      this.profiles = [];

      try {
        const techniciansCol = collection(db, "technicians");
        const snapshot = await getDocs(techniciansCol);

        const fetchedProfiles = [];

        // Fetch all profiles and their completed orders count
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();

          // Fetch completed orders count for this technician
          let completedOrders = 0;
          try {
            const ordersRef = collection(db, "orders");
            const ordersQuery = query(
              ordersRef,
              where("technicianId", "==", docSnap.id),
              where("status", "==", "completed")
            );
            const ordersSnapshot = await getDocs(ordersQuery);
            completedOrders = ordersSnapshot.size;
          } catch (e) {
            console.warn(`Could not fetch orders count for technician ${docSnap.id}:`, e);
          }

          fetchedProfiles.push({
            id: docSnap.id,
            name: data.name,
            service: data.skill,
            // UPDATED: Use $t for fallback text
            location: data.address?.city || this.$t("profilesPage.fallbackLocation"),
            rating: data.ratingAverage || data.rating || 0,
            // UPDATED: Use $t for fallback text
            bio: data.description || this.$t("profilesPage.fallbackBio"),
            profileImage: data.profileImage || null,
            completedOrders: completedOrders,
          });
        }

        this.profiles = fetchedProfiles;
      } catch (error) {
        console.error("Error fetching profiles: ", error);
        // UPDATED: Use $t for the error message
        alert(this.$t("profilesPage.loadingError"));
      }
      this.isLoading = false;
    },
  },
  mounted() {
    this.serviceName = this.$route.params.service || "All";

    // Get client's city for location-based sorting
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const clientRef = doc(db, "clients", user.uid);
          const clientSnap = await getDoc(clientRef);
          if (clientSnap.exists()) {
            const clientData = clientSnap.data();
            this.clientCity = clientData.address?.city || clientData.city || null;
          }
        } catch (e) {
          console.warn("Could not fetch client city:", e);
        }
      }
    });

    this.fetchProfiles();
  },
  watch: {
    $route(to) {
      this.serviceName = to.params.service || "All";
    },
  },
};
</script>

<style scoped></style>
