<script>
  import HomePage from './components/HomePage.vue';
  import OfferPage from './components/OfferPage.vue';
  import AboutUs from "./components/AboutUs.vue";
  import TechnichionProfile from './components/technichionProfile.vue';
  import FooterLayout from './layout/FooterLayout.vue';
  import NavBar from './layout/NavBar.vue'
  export default 
  {
    name:"App",
    data(){
      return{

      }
    },
    components:{
      NavBar,
      HomePage,
      OfferPage,
      FooterLayout,
      AboutUs,
      TechnichionProfile
    }
  }
</script>
<template>
  <nav-bar/>
  <router-view/>
  <footer-layout/>
</template>

<style scoped>

</style>
