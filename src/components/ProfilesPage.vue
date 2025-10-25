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

      profiles: [
        {
          name: "Anas Adel",
          location: "Giza",
          rating: 4.5,
          bio: "Experienced plumber",
          service: "Plumbing",
        },
        {
          name: "Mona Sami",
          location: "Suez",
          rating: 4.8,
          bio: "Certified electrician",
          service: "Electrical",
        },
        {
          name: "Omar Khaled",
          location: "Aswan",
          rating: 4.2,
          bio: "Professional carpenter",
          service: "Carpentry",
        },
        {
          name: "Laila Hassan",
          location: "Cairo",
          rating: 4.7,
          bio: "Skilled finisher",
          service: "Finishing",
        },
        {
          name: "Ahmed Ali",
          location: "Alexandria",
          rating: 4.9,
          bio: "Experienced painter",
          service: "Finishing",
        },
        {
          name: "Sara Ahmed",
          location: "Giza",
          rating: 4.6,
          bio: "Skilled carpenter",
          service: "Carpentry",
        },
        {
          name: "Youssef Nabil",
          location: "Luxor",
          rating: 4.3,
          bio: "Certified plumber",
          service: "Plumbing",
        },
        {
          name: "Nadia Fathy",
          location: "Red Sea",
          rating: 4.4,
          bio: "Professional electrician",
          service: "Electrical",
        },
        {
          name: "Ahmed Mohamed",
          location: "Suez",
          rating: 4.5,
          bio: "Skilled finisher",
          service: "Finishing",
        },
      ],
    };
  },
  computed: {
    filteredProfiles() {
      let results = this.profiles;

      if (this.serviceName && this.serviceName !== "All") {
        results = results.filter((p) => p.service.toLowerCase() === this.serviceName.toLowerCase());
      }

      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword.toLowerCase();
        results = results.filter(
          (p) => p.name.toLowerCase().includes(kw) || p.bio.toLowerCase().includes(kw)
        );
      }

      if (this.selectedLocations.length) {
        results = results.filter((p) => this.selectedLocations.includes(p.location));
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
  },
  mounted() {
    this.serviceName = this.$route.params.service || "All";
  },
  watch: {
    $route(to) {
      this.serviceName = to.params.service || "All";
    },
  },
};
</script>
