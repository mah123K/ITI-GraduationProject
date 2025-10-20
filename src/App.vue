<script>
import HomePage from './components/HomePage.vue';
import OfferPage from './components/OfferPage.vue';
import FooterLayout from './layout/FooterLayout.vue';
import NavBar from './layout/NavBar.vue'
  export default{
    name:"App",
    data(){
      return{

      }
    },
    components:{
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
