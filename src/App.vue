<script>
import FooterLayout from "./layout/FooterLayout.vue";
import NavBar from "./layout/NavBar.vue";
import TechncionDashboard from "./components/TechncionDashboard.vue";
import TechnicionDashNav from "./layout/TechnicionDashNav.vue";
import MannageUserProfile from "./components/MannageUserProfile.vue";

export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    hideLayout() {
      const hiddenRoutes = ["/login", "/signup", "/dashboard","/technician-dashboard"];
      return hiddenRoutes.some((path) => this.$route.path.startsWith(path));
    },
  },
  components: {
    NavBar,
    TechncionDashboard,
    FooterLayout,
    TechnicionDashNav,
    MannageUserProfile,
  },
};
</script>
<template>   
  <nav-bar v-if="!hideLayout" />
  <router-view />
  <footer-layout v-if="!hideLayout" />
  <!-- <TechnicionDashNav/>
  <TechncionDashboard />  -->
  <!-- <MannageUserProfile/> -->
</template>

<style scoped></style>
