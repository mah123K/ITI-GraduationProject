<template>
  <div class="profiles-page">
    <h1 class="main-header mt-30">Finishing Companies</h1>
    <TopBar @view-changed="currentView = $event" />
    <div
      :class="[
        'px-4 sm:px-8 max-w-7xl mx-auto mb-12 gap-6',
        currentView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col',
      ]"
    >
      <FinishingCard
        v-for="(profile, index) in profiles"
        :key="index"
        :profile="profile"
        :viewType="currentView"
      />
    </div>
  </div>
</template>

<script>
import FinishingCard from "./FinishingCard.vue";
import TopBar from "./topBar.vue";

export default {
  name: "ProfilesPage",
  components: { FinishingCard, TopBar },
  data() {
    return {
      currentView: "grid",
      profiles: [
        {
          name: "Qeema Group",
          location: "Giza",
          rating: 4.5,
          bio: "Experienced plumber with 5 years in residential and commercial plumbing.",
          service: "Plumbing",
          image:
            "../images/pngtree-construction-worker-engineer-with-building-plan-png-image_13078126.png",
        },
        {
          name: "The Design Hub",
          location: "Suez",
          rating: 4.8,
          bio: "Certified electrician specializing in home and office electrical systems.",
          service: "Plumbing",
          image:
            "../images/pngtree-construction-worker-engineer-with-building-plan-png-image_13078126.png",
        },
        {
          name: "Oscar Rattan",
          location: "Aswan",
          rating: 4.2,
          bio: "Professional carpenter offering custom furniture and cabinetry services.",
          service: "Plumbing",
          image:
            "../images/pngtree-construction-worker-engineer-with-building-plan-png-image_13078126.png",
        },
        {
          name: "Up Interiors",
          location: "Luxor",
          rating: 4.7,
          service: "Plumbing",
          bio: "Skilled painter providing interior and exterior painting services.",
          image:
            "../images/pngtree-construction-worker-engineer-with-building-plan-png-image_13078126.png",
        },
        {
          name: "Almohandes Co",
          location: "Red Sea",
          rating: 4.6,
          service: "Plumbing",
          bio: "Experienced HVAC technician specializing in installation and repair.",
          image:
            "../images/pngtree-construction-worker-engineer-with-building-plan-png-image_13078126.png",
        },
        {
          name: "Up Interiors",
          location: "Alex",
          rating: 4.9,
          bio: "Expert landscaper specializing in garden design and maintenance.",
          service: "Plumbing",
          image:
            "../images/pngtree-construction-worker-engineer-with-building-plan-png-image_13078126.png",
        },
      ],
    };
  },
};
</script>
