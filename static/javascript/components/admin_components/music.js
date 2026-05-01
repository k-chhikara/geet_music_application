export default {
  template: `<div class="form_side">
                            
    <div class="h4">
        <span></span> <h4>ALL TRACKS</h4><span></span><span></span><span></span>
    </div>
    
    <div class="container" style="display: block;">
        
        <div class="rowtable" style="height: 250px;">
           
            <table class="table table-dark" >
                <thead >
                  <tr >
                    

                    <th  style="background: #111727;" > S.no</th>
                    <th  style="background: #111727;" >ID</th>
                    <th  style="background: #111727;" >Image</th>
                    <th  style="background: #111727;" >Name</th>
                    <th  style="background: #111727;" >Singer</th>
                    <th  style="background: #111727;" >Music</th>
                    <th  style="background: #111727;" >Lyricist</th>
                    <th  style="background: #111727;" >Published</th>
                    
                    <th  style="background: #111727;" >Owner</th>
                    <th  style="background: #111727;" >Update</th>
                    <th  style="background: #111727;" >&nbspDELETE</th>
                  </tr>
                </thead>
         <tbody>
                 
                  <tr  v-for="(track,index) in tracks" >
                    <th  style="background: #111727;" >{{index}}</th>
                    <td style="background: #111727;">{{track.id}}</td>
                    <td style="background: #111727;"><img style="height: 40px; width: 50px;" :src="imagesrc(track.trackimage)" alt=""></td>
                    <td style="background: #111727;" ><router-link :to="{name : 'trackSinglePage', params:{id: track.id}}" class="links" >{{track.name}}</router-link></td>
                    <td style="background: #111727;" >{{track.singer}}</td>
                    <td style="background: #111727;" >{{track.music}}</td>
                    <td style="background: #111727;">{{track.lyricist}}</td>
                    <td style="background: #111727;" >{{track.published.substring(0, 10)}}</td>
                    
                    <td style="background: #111727;">{{track.owner_name}}</td>
                    <td style="background: #111727;" ><button @click="trackUpdateRoute(track)" class="btn btn-sm btn-outline-info" >Update</button></td>    
                    <td style="background: #111727;" ><button @click="deleteTrack(track.id)" class="btn btn-sm btn-outline-danger" >Delete</button></td>    
                  </tr>
                 
                </tbody>
              </table>   
        </div>
        <div class="h4">
            <span></span> <h4>ALL ALBUMS</h4><span></span><span></span><span></span>
        </div>    
        <div class="rowtable" style="height: 250px;">
            <table class="table table-dark" >
                <thead >
                  <tr >
                    <th  style="background: #111727;" > S.no</th>
                    <th  style="background: #111727;" >ID</th>
                    <th  style="background: #111727;" >Image</th>
                    <th  style="background: #111727;" >Name</th>                                            
                    <th  style="background: #111727;" >Published</th>                                            
                    <th  style="background: #111727;" >Owner</th>
                    <th  style="background: #111727;" >Update</th>
                    <th  style="background: #111727;" >&nbspDELETE</th>
                  </tr>
                </thead>
         <tbody>
                    
                  <tr  v-for="(album,index) in albums" >
                    <th  style="background: #111727;" scope="row">{{index}}</th>
                    <td style="background: #111727;">{{album.id}}</td>
                    <td style="background: #111727;"><img style="height: 40px; width: 50px;" :src="imagesrc(album.albumcover)" alt=""></td>
                    <td style="background: #111727;" > <router-link :to="{name : 'albumSinglePage', params:{id: album.id}}" class="links" >{{album.title}}</router-link></td>
                    <td style="background: #111727;" >{{album.published.substring(0, 10)}}</td>                                            
                    <td style="background: #111727;">{{album.owner}}</td>
                    <td style="background: #111727;" ><button @click="updateroute(album)" class="btn btn-sm btn-outline-info" >Update</button></td>    
                    <td style="background: #111727;" ><button @click="deleteAlbum(album.id)" class="btn btn-sm btn-outline-danger" >Delete</button></td>    
                  </tr>
                  
                </tbody>    
              </table>   
        </div>
        </div>

</div>`,

  data() {
    return {
      tracks: [],
      albums: [],
    };
  },
  methods: {
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
    imagesrc(val) {
      return "/static/uploads/images/" + val;
    },
    async deleteAlbum(id) {
      const res = await fetch("http://localhost:8080/api/album/" + id, {
        method: "DELETE",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      try {
        const data = await res.json();
        if (res.ok) {
          alert("data has been deleted");
          this.albums = this.albums.filter((album) => album.id !== id);
          console.log("Album deleted successfully");
        } else {
          alert(data.message);
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    async deleteTrack(id) {
      const res = await fetch("http://localhost:8080/api/track/" + id, {
        method: "DELETE",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      console.log("hey");
      try {
        const data = await res.json();
        if (res.ok) {
          alert("data has been deleted");
          this.tracks = this.tracks.filter((track) => track.id !== id);
        } else {
          alert(data.message);
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    updateroute(album) {
      this.$router.push({ name: "updateAlbum", params: { album: album } });
    },
    trackUpdateRoute(track) {
      this.$router.push({ name: "updateTrack", params: { track: track } });
    },
  },
  mounted: function () {
    this.tracks = this.getTracks();
    this.tracks = this.getAlbums();
  },
};
