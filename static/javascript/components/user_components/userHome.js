export default {
  template: `<div class="home_main"> 

                <div class="trending_songs">
                <div class="h4">
                    <h4>Trending Songs</h4>
                    <div class="btns">
                        <i class="bi disabled bi-caret-left-fill"></i>
                        <i class="bi disabled bi-caret-right-fill"></i>
                    </div>
                </div>
                <div class="trend_song">
                   
                 <li class="songItem" v-for="track in tracks" :key="track.id" @click="trackSinglePage(track.id)">
                        <div class="img_play">
                            <img :src="imagesrc(track.trackimage)" alt="IM">
                            <i class="bi  playListPlay bi-play-circle-fill" id="1"></i>
                        </div>
                            <h5>{{track.name}} <br>
                                <div class="subtitle">{{track.singer}}</div>
                            </h5>
                    </li>
                </div>
            </div>

            <div class="album">
                <div class="h4">
                    <h4>Album</h4>
                    <div class="btns">
                        <i class="disabled  bi-caret-left-fill"></i>
                        <i class="disabled bi bi-caret-right-fill"></i>
                    </div>
                </div>
                <div class="item">
                    
                    <li v-for="album in albums" :key="album.id" @click="albumSinglePage(album.id)">
                        
                        <img :src="imagesrc(album.albumcover)" alt="album.img">
                        <h5>{{album.title}}
                        </h5>
                   
                    </li>
                    
                </div>
            </div>

           



</div>
     `,
  data() {
    return {
      tracks: [],
      albums: [],
    };
  },
  methods: {
    imagesrc(val) {
      return "/static/uploads/images/" + val;
    },

    async getTracks() {
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

    async getAlbums() {
      const res = await fetch("http://localhost:8080/api/album", {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      try {
        const data = await res.json();
        if (res.ok) {
          this.albums = data;
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

    trackSinglePage(val) {
      this.$router.push({ name: "trackSinglePage", params: { id: val } });
    },

    albumSinglePage(val) {
      this.$router.push({ name: "albumSinglePage", params: { id: val } });
    },
    // albumSinglePage(val){

    //     this.$router.push({name:"albumSinglePage", params:{id: val}})
    // }
  },
  created() {
    this.getTracks();
    this.getAlbums();
  },
};
