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
      const hiddenRoutes = ["/login", "/signup", "/dashboard","/technician-dashboard", "/technician-chat"];
      return hiddenRoutes.some((path) => this.$route.path.startsWith(path));
    },
    
    // --- FIX ---
    // I have removed BOTH of the duplicate 'currentLocale' properties.
    // They are not needed because the 'watch' block below is correct.
    
  },
  components: {
    NavBar,
    TechncionDashboard,
    FooterLayout,
    TechnicionDashNav,
    MannageUserProfile,
  },
  
  // This 'watch' block is perfect. It does not need the
  // 'currentLocale' computed property to work.
  watch: {
    '$i18n.locale': {
      handler(newLang) {
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      },
      immediate: true 
    }
  }
};
</script>

<template>   
  <nav-bar v-if="!hideLayout" />
  <router-view />
  <footer-layout v-if="!hideLayout" />
</template>

<style scoped></style>