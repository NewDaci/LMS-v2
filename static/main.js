console.log("Injected Vue");

import router from "./router.js";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import store from "./store.js"


new Vue({
    el : "#app",
    router,
    store,
    components : {
        Navbar,
        Footer,
    },
    data: {
      showFooter: false,
  },
  watch: {
      $route(to, from) {
          this.updateFooterVisibility(to);
      }
  },
  methods: {
      updateFooterVisibility(route) {
          this.showFooter = route.path !== '/';
      }
  },
  created() {
      this.updateFooterVisibility(this.$route);
  },
    template : `
    <div>
        <Navbar></Navbar>
        <router-view></router-view>
        <Footer v-if="showFooter"></Footer>
    </div>
    `
    
    
})