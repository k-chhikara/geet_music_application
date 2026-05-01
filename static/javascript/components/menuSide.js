export default {
  template: `
    <div class="menu_side">
   
    <div class="headliner">
        <h3 class="logoh4"><img class="logo" src="/static/assets/logo3.png" alt="">&nbsp&nbsp Your Music, Your Mood</h3>
        
    </div>
   
    <h4 v-if="this.role=='admin'||this.creatorpage==1" class="active"><span></span><i class="bi bi-music-note-beamed"></i>WANNA ADD SOMETHING</h4>
    <h4 v-if="this.role=='user'||this.role=='creator' &&this.creatorpage==0"" class="active"><span></span><i class="bi bi-music-note-beamed"></i>Playlist&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i @click="refresh" class="bi bi-arrow-clockwise"  style="cursor:pointer;"    ></i></h4>
    
        <div  v-if="this.role=='admin'||this.creatorpage==1" class="playlist" style="overflow: hidden;">
          <li class="p_list">
              <span>&nbsp&nbsp&nbsp</span>
              <router-link  to="/addtrack" style="font-size: 15px;" >ADD NEW TRACK</router-link>        
          </li>
          <li class="p_list">
              <span>&nbsp&nbsp&nbsp</span>
              
              <router-link  to="/addalbum" style="font-size: 15px;" >ADD NEW ALBUM</router-link>
          </li>
        </div>
        <div v-else-if="this.role=='user'||this.role=='creator'&&this.creatorpage==0  " class="playlist">
              
                  <li  v-for="(playlist, index) in this.playlists" :key="playlist.id" class="p_list">
                      <span>&nbsp {{index+1}}</span>

                      <p @click="playlistSongs(playlist)">{{playlist.name}}</p>
                        
                  </li>
        </div>

        
      
            
            <hr>
            
            <h4 v-if="this.creatorpage==1" class="active" id="currentplaylist" ><span></span><i class="bi bi-music-note-beamed"></i>Trending Songs &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i @click="refresh" class="bi bi-arrow-clockwise"  style="cursor:pointer;"    ></i></h4>
            <h4 v-else class="active" id="currentplaylist" ><span></span><i class="bi bi-music-note-beamed"></i>All Songs &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i @click="refresh" class="bi bi-arrow-clockwise"  style="cursor:pointer;"    ></i></h4>
        <div class="menu_song" v-if="this.creatorpage==1" >
        <div class="card1" v-if="this.creatorpage==1">
            
        <h1>Top Liked Songs</h1> 
        <div class="card card-style mb-2" style="color: blue;">
            
            <div class="card-body">
                <div class="chart-container" style="position: relative;;">
                    <canvas id="creator_name_vs_likes"></canvas>
                </div>
            </div>
        </div>
        </div>
        </div>
        <div class="menu_song" v-else>
            
            
        
            <li  class="songItem test  " v-for="(track, index) in tracks" :key="track.id"  :class="{ 'menuPlayActive': index === activeIndex }">
                <span id="index"></span>
                <img :src="imagesrc(track.trackimage)" alt="Im">
                <h5>{{track.name}} <br>
            
                <p class=" url disabled" id="audio_playlist"></p>
                <p class="url disabled" id="image_playlist"></p>
                <p class="url disabled"></p>
                <p class="url disabled"></p>

                    <div class="subtitle">{{track.singer}}</div>
                </h5>
            
                <i class="bi  playListPlay bi-play-circle-fill" @click="playMusic(track,index)"></i>
            </li>


            
       
            
        
        </div>   
            
            
</div>`,

  props: {
    activeIndex: {
      type: Number,
      default: -1,
    },
    creatorpage: {
      type: Number,
    },
  },
  data() {
    return {
      tracks: [],
      playlists: [],
      change: false,
      role: null,
    };
  },
  methods: {
    async getTracks() {
      const token = localStorage.getItem("auth-token");
      const res = await fetch("http://localhost:8080/api/track", {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      try {
        const data = await res.json();
        if (res.ok) {
          this.tracks = data;
        } else {
          console.log(
            "something error happeend when retrieving albums from backend:",
            data.message
          );
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    async getPlaylist() {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(
        "http://localhost:8080/api/playlist/" +
          localStorage.getItem("current_user"),
        {
          method: "GET",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        }
      );
      try {
        const data = await res.json();

        if (res.ok) {
          this.playlists = data;
        } else {
          console.log(
            "something error happeend when retrieving playlist from backend:",
            data.message
          );
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    imagesrc(val) {
      return "/static/uploads/images/" + val;
    },
    playMusic(track, index) {
      this.$emit("play", track, this.tracks, index);
    },
    refresh() {
      this.change = !this.change;
    },
    playlistSongs(playlist) {
      this.$router.push({
        name: "playlistSongs",
        params: { playlist_id: playlist.id },
      });
    },
    async graph(){
      if (this.creatorpage == 1) {
        console.log("this is dashboard");
        const form = new FormData();
        form.append("current_user", localStorage.getItem("current_user"));
  
        const res = await fetch("http://localhost:8080/dashboard_graph", {
          method: "POST",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
          body: form,
        });
        if (res.ok) {
          const data = await res.json();
          const name_labels = data.top_tracks_names;
          const song_like = data.top_tracks_likes;
          new Chart(document.getElementById("creator_name_vs_likes"), {
            type: "bar",
            data: {
              labels: name_labels,
              datasets: [
                {
                  label: "Top 5 liked songs",
  
                  data: song_like,
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  lineTension: 0.1,
                  backgroundColor: [
                    "rgba(255, 99, 132,0.7)",
                    "rgba(255, 159, 64, 0.7)",
                    "rgba(255, 205, 86, 0.7)",
                    "rgba(75, 192, 192, 0.7)",
                    "rgba(54, 162, 235, 0.7)",
                    "rgba(153, 102, 255, 0.7)",
                    "rgba(201, 203, 207, 0.7)",
                    "rgba(255, 99, 132, 0.7)",
                    "rgba(255, 159, 64, 0.7)",
                    "rgba(255, 205, 86, 0.7)",
                  ],
                  borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgb(153, 102, 255)",
                    "rgb(201, 203, 207)",
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                  ],
                  borderWidth: 1,
                  hoverBorderColor: "black",
                  hoverBorderWidth: 2,
                  // hoverBackgroundColor: 'rgba(154, 245, 140)',
                  pointHoverRadius: 5,
                },
              ],
            },
            options: { indexAxis: "y" },
          });
        }
      }

    },
  },
  created: async function () {
    this.getTracks();
    this.getPlaylist();
    this.role = localStorage.getItem("role");

    if (this.role == "user") {
      this.getPlaylist();
    }
  },
  beforeUpdate: async function () {
    if (this.creatorpage == 1) {
      console.log("this is dashboard");
      const form = new FormData();
      form.append("current_user", localStorage.getItem("current_user"));

      const res = await fetch("http://localhost:8080/dashboard_graph", {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        const name_labels = data.top_tracks_names;
        const song_like = data.top_tracks_likes;
        new Chart(document.getElementById("creator_name_vs_likes"), {
          type: "bar",
          data: {
            labels: name_labels,
            datasets: [
              {
                label: "Top 5 liked songs",

                data: song_like,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                lineTension: 0.1,
                backgroundColor: [
                  "rgba(255, 99, 132,0.7)",
                  "rgba(255, 159, 64, 0.7)",
                  "rgba(255, 205, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                  "rgba(201, 203, 207, 0.7)",
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(255, 159, 64, 0.7)",
                  "rgba(255, 205, 86, 0.7)",
                ],
                borderColor: [
                  "rgb(255, 99, 132)",
                  "rgb(255, 159, 64)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                  "rgb(153, 102, 255)",
                  "rgb(201, 203, 207)",
                  "rgb(255, 99, 132)",
                  "rgb(255, 159, 64)",
                  "rgb(255, 205, 86)",
                ],
                borderWidth: 1,
                hoverBorderColor: "black",
                hoverBorderWidth: 2,
                // hoverBackgroundColor: 'rgba(154, 245, 140)',
                pointHoverRadius: 5,
              },
            ],
          },
          options: { indexAxis: "y" },
        });
      }
    }
  },
  watch: {
    change(newVal) {
      this.getTracks();
      this.getPlaylist();
      this.graph();
    },
  },
};
