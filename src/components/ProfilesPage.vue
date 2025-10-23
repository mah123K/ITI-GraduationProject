<template>
  <div class="profiles-page">
    <h1 class="main-header mt-20">{{ serviceName }} Profiles</h1>
    <TopBar @view-changed="currentView = $event" />
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
      profiles: [
        {
          name: "Anas Adel",
          location: "Giza",
          rating: 4.5,
          bio: "Experienced plumber with 5 years in residential and commercial plumbing.",
          service: "Plumbing",
          image: "../images/plumber.png",
        },
        {
          name: "Mona Sami",
          location: "Suez",
          rating: 4.8,
          bio: "Certified electrician specializing in home and office electrical systems.",
          service: "Electrical",
          image: "../images/electrician.png",
        },
        {
          name: "Omar Khaled",
          location: "Aswan",
          rating: 4.2,
          bio: "Professional carpenter offering custom furniture and cabinetry services.",
          service: "Carpentry",
          image: "../images/carpenter.png",
        },
        {
          name: "Laila Hassan",
          location: "Cairo",
          rating: 4.7,
          bio: "Skilled finishing contractor with expertise in interior and exterior finishes.",
          service: "Finishing",
          image: "../images/finishing.png",
        },
        {
          name: "Ahmed Ali",
          location: "Alexandria",
          rating: 4.9,
          bio: "Experienced painter specializing in residential and commercial painting services.",
          service: "Finishing",
          image: "../images/painter.png",
        },
        {
          name: "Sara Ahmed",
          location: "Giza",
          rating: 4.6,
          bio: "Skilled carpenter offering custom furniture and cabinetry services.",
          service: "Carpentry",
          image: "../images/carpenter.png",
        },
        {
          name: "Ahmed Ali",
          location: "Alexandria",
          rating: 4.9,
          bio: "Experienced painter specializing in residential and commercial painting services.",
          service: "Finishing",
          image: "../images/painter.png",
        },
        {
          name: "Sara Ahmed",
          location: "Giza",
          rating: 4.6,
          bio: "Skilled carpenter offering custom furniture and cabinetry services.",
          service: "Carpentry",
          image: "../images/carpenter.png",
        },
        {
          name: "Ahmed Ali",
          location: "Alexandria",
          rating: 4.9,
          bio: "Experienced painter specializing in residential and commercial painting services.",
          service: "plumbing",
          image: "../images/painter.png",
        },
        {
          name: "Sara Ahmed",
          location: "Giza",
          rating: 4.6,
          bio: "Skilled carpenter offering custom furniture and cabinetry services.",
          service: "Carpentry",
          image: "../images/carpenter.png",
        },
      ],
      
    };
  },
  computed: {
    filteredProfiles() {
      return this.profiles.filter(
        (p) => p.service.toLowerCase() === this.serviceName.toLowerCase()
      );
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

<style scoped>
svg {
  height: 100%;
}
</style>
