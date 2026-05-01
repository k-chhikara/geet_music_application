import userNavbar from "./components/userNavbar.js"

import loginNavbar from "./components/login_components/loginNavbar.js"
import router from "./routes.js";

import menuSide from "./components/menuSide.js";
import masterPlayer from "./components/masterPlayer.js";

router.beforeEach((to, from, next) => {
  if (to.name == 'login' && localStorage.getItem('auth-token') ? true : false)
    console.log
  else next()
})


var app = new Vue({
  el: "#app",
  template: `
  <div class="header">
    <header v-if="this.role==null"> 
    <link
        rel="stylesheet"
        href="/static/css/cssformpage.css"
        />
    
        <div class="song_side_main">
            <loginNavbar/>
            <router-view/>  
            
        
            
            
        </div>


    </header>

    <header v-if="this.role=='admin'" >
        <link
        rel="stylesheet"
        href="/static/css/csshomepage.css"
        />
        <menuSide @play="playtrack" :activeIndex="activeIndex" />
        <div class="song_side">
            <userNavbar :key="has_changed"/>
            <div class="form_side">
            <router-view />
            </div>
        </div>
        <masterPlayer :currentTrack="currentTrack" :tracks="tracks" @prev-track="prevTrack" @next-track="nextTrack" />
    </header>
    <header v-else-if="this.role=='user'||this.role=='creator'">
        <link rel="stylesheet" href="/static/css/csshomepage.css"/>
        <menuSide @play="playtrack" :activeIndex="activeIndex" :creatorpage="creatorpage" />
        <div class="song_side">
           <!-- <userNavbar :key="has_changed"/> -->
           <userNavbar :key="has_changed"/>
            
            <div class="form_side">
            <router-view />
            </div>
        </div>
        <masterPlayer :currentTrack="currentTrack" :tracks="tracks" @prev-track="prevTrack" @next-track="nextTrack" />
    </header>
  </div>



    `,
  
  data: {
    has_changed: true,
    login: null,
    role: null,

    currentTrack: null,
    tracks: null,
    activeIndex: -1,
    creatorpage: 0
  },
  components: {
    userNavbar,
   
    loginNavbar,
    menuSide,
    masterPlayer,
  },
  router,
  methods: {
    playtrack(track, tracks, activeIndex) {
      this.currentTrack = track;
      this.tracks = tracks;
      this.activeIndex = activeIndex;
    },
    prevTrack() {
      if (this.activeIndex > 0) {
        this.activeIndex--; // Update activeIndex directly
        this.currentTrack = this.tracks[this.activeIndex]; // Update currentTrack directly
      }
    },
    nextTrack() {
      if (this.activeIndex < this.tracks.length - 1) {
        this.activeIndex++; // Update activeIndex directly
        this.currentTrack = this.tracks[this.activeIndex]; // Update currentTrack directly
      }
    },
  },
  watch: {
    $route(to, from) {
      this.has_changed = !this.has_changed;
      this.creatorpage=0
      console.log("before:",this.creatorpage)
      
      if(to.name=="creatorPage"){
        this.creatorpage=1
        console.log("this is when creator page is opened",this.creatorpage)
      }
     
    },
  },

 

  
  created: function () {
    this.role = localStorage.getItem("role");
   
  },
  updated: function () {
    this.role = localStorage.getItem("role");
    
  },
});
