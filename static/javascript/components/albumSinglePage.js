export default {
  template: `  <div class="content">
       <div class="singlepage">
  
         <h1>{{album.title}} </h1>
         <div class="whole" style="height: 120px;">
  
           <div class="left">
  
                 <div class="title">
                   <h3>Author</h3>
                   <span id="singer">{{album.author}}</span>
                 </div>
                 <div class="title">
                   <h3>published by</h3>
                   <span id="music">{{album.owner}}</span>
                 </div>
                 <div class="title">
                   <h3>Published on</h3>
                   <span id="published">{{album.published}}</span>
                 </div>
           </div>
           <div class="right">
             <img :src="imgsrc(album.albumcover)" alt="Image">
           </div>
         </div>
         <div class="buttons" >
           <i  class="" id="" ></i>
  
         </div>
  
           <!-- <button id="Play">Play</button>
           <button>Like</button>
           <button>Add to playlist</button> -->
        <div class="lyrics">
        <router-link :to="{name: 'albumSongs', params: {id: album_id}}" class="links"href="">
  
               <p @mouseover="hover = true"  
               @mouseout="hover = false"  :style="{cursor: hover ? 'pointer' : 'default', color: hover ? '#fff' : '#a4a4a4'}">List of all songs</p>
               </router-link>
           
               </div>     
               
               </div>
               <button class="btn btn-outline-danger" @click="songFlag(album.id)">&nbspflag&nbsp</button>
  
   </div>`,
  props: ["id"],
  data() {
    return {
      album: "null",
      hover: false,
      album_id: 0,
    };
  },
  created: function () {
    this.getAlbum();
  },
  methods: {
    // substring(value) {

    //   return value.substring(0, 10)
    // },
    imgsrc(val) {
      const value = val;
      return `/static/uploads/images/${value}`;
    },

    async getAlbum() {
      const token = localStorage.getItem("auth-token");
      const res = await fetch("http://localhost:8080/api/album/" + this.id, {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      try {
        const data = await res.json();

        if (res.ok) {
          this.album = data;
          this.album.published = this.album.published.substring(0, 10);
          this.album_id = this.album.id;
        } else {
          console.log(
            "something error happeend when retrieving album from backend:",
            data.message
          );
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    async songFlag(val) {
      const formData = new FormData();
      formData.append("current_user", localStorage.getItem("current_user"));
      formData.append("action", "Album");
      const res = await fetch("http://localhost:8080/flagsong/" + val, {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
        body: formData,
      });
      try {
        const d = await res.json();
        if (res.ok) {
          
          alert(d.message);
        } else {
          
          console.log("error happened", d.message);
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
  },
};
