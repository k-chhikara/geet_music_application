export default {
  template: `<div class="container">
    <div class="row">
    <div class="h4" style="margin-bottom: 10px">
    <span></span> <h4>Playlist {{playlist_id}}</h4><span></span><span></span><span></span>
</div>            
       
        <table class="table table-dark" >
            <thead >
              <tr >
                <th  style="background: #111727;" > S.no</th>
                <th  style="background: #111727;" >Name</th>
                <th  style="background: #111727;" >Album</th>
                <th  style="background: #111727;" >Music</th>
                <th  style="background: #111727;" >Director</th>
                <th  style="background: #111727;" >Published</th>
                <th  style="background: #111727;" >&nbspDelete</th>
              </tr>
            </thead>
            <tbody>
            
              <tr v-for="(track, index) in songs"  >
                <th style="background: #111727;" >{{index+1}}</th>
                <td style="background: #111727;" @click="trackSinglePage(track.id)" @mouseover="hover = true"  
                @mouseout="hover = false"  :style="{cursor: hover ? 'pointer' : 'default', color: hover ? '#36e2ec' : '#fff'}">{{track.name}}</td>
                <td style="background: #111727;" >{{track.album_name}}</td>
                <td style="background: #111727;" >{{track.singer}}</td>
                <td style="background: #111727;" >{{track.music}}</td>
                <td style="background: #111727;" >{{track.published.substring(0,10) }}</td>
                <td style="background: #111727;" ><button @click="deletetrack(track.id)"  class="btn btn-sm btn-outline-danger">DELETE</button></td>    
              </tr>
            
              
              
            </tbody>
          </table>                         
        
        

    </div>

</div>`,
  props: ["playlist_id"],
  data() {
    return {
      playlist: null,
      songs: [],
      playlist: null,
      hover: false,
    };
  },
  created: function () {
    this.getPlaylistSongs();
  },
  watch: {
    playlist_id(newValue, oldValue) {
      console.log("myProp changed:", newValue);
      this.getPlaylistSongs();
    },
  },
  methods: {
    async getPlaylistSongs() {
      const res = await fetch(
        "http://localhost:8080/api/playlistsongs/" + this.playlist_id,
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
          this.songs = data;
  
          console.log(this.songs);
        } else {
          console.log("failed to get playlists' songs");
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    async deletetrack(id) {
      const formData = new FormData();
      formData.append("song_id", id);
      formData.append("playlist_id", this.playlist_id);
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
          alert("data has been deleted");
          this.songs = this.songs.filter((track) => track.id !== id);
  
          console.log("Album deleted successfully");
        } else {
          alert(data.message);
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    trackSinglePage(val) {
      this.$router.push({ name: "trackSinglePage", params: { id: val } });
    },
  },
};
