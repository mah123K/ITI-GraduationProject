<script>
import AboutUs from "./components/AboutUs.vue";
import TechnichionProfile from './components/technichionProfile.vue';
import HomePage from './components/HomePage.vue';
import OfferPage from './components/OfferPage.vue';
import FooterLayout from './layout/FooterLayout.vue';
import NavBar from './layout/NavBar.vue'
export default 
{
  export default{
    name:"App",
    data(){
      return{

      }
    },
    components:{
      AboutUs,
      TechnichionProfile
    }
  }
</script>
<template>
  <div>
    <AboutUs/>
    <technichionProfile/>
  </div>
</template>

      NavBar,
      // HomePage,
      // OfferPage,
       FooterLayout,
     
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
