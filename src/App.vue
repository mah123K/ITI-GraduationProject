<script>
  import AboutUs from "./components/AboutUs.vue";
import TechnichionProfile from './components/technichionProfile.vue';
  export default 
  {
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


<style scoped>

</style>
