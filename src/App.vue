<script>
  import FooterLayout from './layout/FooterLayout.vue';
  import NavBar from './layout/NavBar.vue'
  import TechncionDashboard from './components/TechncionDashboard.vue';
  import TechnicionDashNav from './layout/TechnicionDashNav.vue';
  import MannageUserProfile from './components/MannageUserProfile.vue';

  export default 
  {
    name:"App",
    data(){
      return{

      }
    },
    components:{
      NavBar,
      TechncionDashboard,
      FooterLayout,
      TechnicionDashNav,
      MannageUserProfile
    }
  }
</script>
<template>
  <!-- <nav-bar/>
  <router-view/>
  <footer-layout/>  -->
  <TechnicionDashNav/>
  <TechncionDashboard />
  <!-- <MannageUserProfile/> -->
</template>

<style scoped>

</style>
