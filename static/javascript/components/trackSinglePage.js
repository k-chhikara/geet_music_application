export default {
  template: ` <div class="content">
    <div class="singlepage">

      <h1>{{track.name}} </h1>
      <div class="whole">

        <div class="left">
          
              <div class="title">
                
                <h3>Singer</h3>
                <span id="singer">{{track.singer}}</span>
                
                
              </div>
              <div class="title">
                <h3>Music</h3>
                
                <span id="music">{{track.music}}</span>
                
                
              </div>
              <div class="title">
                <h3>Lyricist</h3>
                <span id="lyricist">{{track.lyricist}}</span>
              </div>
              <div class="title">
                <h3>Album </h3>
                <span >{{track.album_title}}</span>
              </div>    
              <div class="title">
                <h3>Published on</h3>
                <span >{{this.track.published}}</span>
              </div>
        </div>
        <div class="right">
          <img :src="imgsrc(this.track.trackimage)" alt="">
          </div>
          </div>
          <div class="buttons" >
          <i  class="bi play bi-play-fill" id="masterPlay" ></i>
          <i  @click="likeSong" class=" like bi bi-heart-fill " :style="{color: liked ? 'red' : '#fff' }" ></i>
          <button class="btn btn-outline-danger" @click="songFlag(track.id)">&nbspflag&nbsp</button>
        </div>        

        <div>


        <form style="display: inline;" @submit.prevent="submit" >   
        <p  v-if="error!=null"> <label class="text-danger">{{error}} </label> <span @click="closeButton" style="cursor: pointer;"><i class="bi bi-x-circle text-info"></i></span></p>   
        <p  v-if="message!=null"> <label class="text-info">{{message}}</label> <span @click="closeButton" style="cursor: pointer;"><i class="bi bi-x-circle text-info"></i></span></p>   
             
          <select v-model="addplaylistid" class="form-control" >
            <option value=""> Select a playlist</option>
            
            <option v-for="playlist in playlists" :value="playlist.id">{{playlist.name}}</option>
            
          </select> 
          <button type="submit" class="playlistadd">Add to Playlist</button>
          
        </form>
    </div>
      

      
        

        
        <h4>Lyrics</h4>
     <div class="lyrics" >
      
      <p>{{track.lyrics}} 
      </p>
     </div>
    </div>

</div>`,
  props: ["id"],
  data() {
    return {
      track: "null",
      playlists: [],
      addplaylistid: null,
      message: null,
      error: null,
      liked: false,
    };
  },
  created: async function () {
    await this.getTracks();
    await this.getPlaylist();
    await this.checkLike();
  },

  methods: {

    closeButton() {
      this.message = null;
      this.error = null;
    },
    imgsrc(val = "default.jpg") {
      const value = val;

      return `/static/uploads/images/${value}`;
    },

    async getTracks() {
      const token = localStorage.getItem("auth-token");
      const res = await fetch("http://localhost:8080/api/track/" + this.id, {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      try {
        const data = await res.json();
  
        if (res.ok) {
          this.track = data;
          this.track.published = this.track.published.substring(0, 10);
        } else {
          console.log(
            "some error happend when retrieving albums from backend:",
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
    async submit() {
      const formData = new FormData();
      formData.append("playlist_id", this.addplaylistid);
      formData.append("song_id", this.track.id);
      console.log(formData);
      const res = await fetch("http://localhost:8080/api/playlistsongs", {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
        body: formData,
      });
      try {
        const data = await res.json();
        if (res.ok) {
          this.message = data.message;
          console.log(data.message);
          console.log(this.message);
        } else {
          this.error = data.message;
        }
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },

    async checkLike() {
      try {
        console.log(
          "this.is when check like is called before fetch::  ",
          "http://localhost:8080/checkliked/" +
            localStorage.getItem("current_user") +
            "/" +
            this.track.id
        );
        const res = await fetch(
          "http://localhost:8080/checkliked/" +
            localStorage.getItem("current_user") +
            "/" +
            this.track.id,
          {
            method: "GET",
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        console.log("something happening here");

        console.log("this.is when check like is called after fetch");
       
        if (res.ok) {
          if (res.status == 204) {
            console.log("not found in liked playlist");
            this.liked = false;
            alert("this song is notliked")
          } else {
            this.liked = true;
            alert("this song is liked")
          }
        } else {
          console.log("some error occurred while retrieving like status");
        }
      } catch (error) {
        console.log("this.error happend", error);
      }
    },
    async likeSong() {
      console.log("inside likedSong function");
      console.log(this.liked);
      if (this.liked == false) {
        const formData = new FormData();
        formData.append("playlist_id", this.playlists[0].id);
        formData.append("song_id", this.track.id);

        const res = await fetch("http://localhost:8080/api/playlistsongs", {
          method: "POST",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },

          body: formData,
        });
        try {
          const data = await res.json();
          if (res.ok) {
            this.liked = true;
          } else {
            console.log(data.message);
          }
        
        } catch (error) {
          // Handle the error here
          alert("You are not authorised");
        }
      } else {console.log("pppp")
        const formData = new FormData();
        formData.append("song_id", this.track.id);
        formData.append("playlist_id", this.playlists[0].id);
        const res = await fetch("http://localhost:8080/api/playlistsongs", {
          method: "DELETE",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
          body: formData,
        });
        try {
          const data = await res.json();
          if (res.ok) {
            this.liked = false;
          } else {
            alert(data.message);
          }
        
        } catch (error) {
          // Handle the error here
          alert("You are not authorised");
        }
      }
    },
    async songFlag(val){
      const formData=new FormData()
      formData.append("current_user",localStorage.getItem("current_user"))
      formData.append("action","Track")
      const res= await fetch("http://localhost:8080/flagsong/"+val,{
        method:"POST",
        
        body:formData
        
      })
      try {
        const d = await res.json();
        if (res.ok){
          
          alert(d.message)
  
            
        }else{
          
          console.log("error happened", d.message)
        }
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
     

    }
  },
};
