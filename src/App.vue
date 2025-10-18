<script>
import HomePage from './components/HomePage.vue';
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
      HomePage,
       FooterLayout,
     
    }
  }
</script>

<template>
   
  <nav-bar/>
  <home-page/>
  <footer-layout/>
</template>

<style scoped>

</style>
