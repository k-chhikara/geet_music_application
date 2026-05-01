export default {
  template: `
    <div class="form_side_track">
  
          <div class="h4_track">
              <span></span> <h4>UPDATE TRACK</h4><span></span><span></span><span></span>
          </div>
          <div class="container_track">
  
              <div class="row_track">
              <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                  <form  @submit.prevent="submit"  style="display: flex; justify-content: space-between;">
                          <div>
                          <p>
                          <dt> <label>Add Track Name </label></dt>
                          <dd><input v-model="track.name"  class="input"  required ></dd>
                          </p>
                          <p>
                          <dt> <label>Add singer Name </label></dt>
                          <dd><input v-model="track.singer" class="input" required ></dd>
                          </p>
                          <p>
                          <dt> <label>Add Music Producer </label></dt>
                          <dd><input v-model="track.music" class="input" required ></dd>
                          </p>
                          <p>
                          <dt> <label>Lyricist's Name </label></dt>
                          <dd><input v-model="track.lyricist"  class="input" required></dd>
                          </p>
                          <label >Add a album</label>
                          <select v-model="track.album_id" name="album" class="form-control" >
                            <option v-for="album in albums" :key="album.id"  :value="album.id">
                              {{album.title}}
                             </option>
                          </select>
  
                      </div>
          
                      <div>
                          <p>
                          <dt> <label>Add Track Lyrics </label></dt>
                          <dd><textarea v-model="track.lyrics" id="lyrics" name="lyrics" placeholder="Add track lyrics" rows="5">NOT AVAILABLE</textarea></dd>
                          </p>
                          <p>
                          <dt> <label>Track's Image required </label></dt>
                          <dd><input class="form-control"  type="file" @change="imagefilechange" ></dd>
                          </p>
         
                          <p>
                          <dt> <label>MP3 File</label></dt>
                          <dd><input class="form-control"  type="file"  @change="mp3filechange"   ></dd>
                          </p>
                          <p><button type="submit" class="submit_track btn-info" >add Track</button>
                          </p>
  
                      </div>
                      <div></div>
  
                  </form>
  
              </div>
  
          </div>
      </div>
  `,
  props: ["track"],

  data() {
    return {
      data: {
        imagefile: {
          dataurl: "",
          filename: "",
        },
        mp3file: {
          dataurl: "",
          filename: "",
        },
      },
      error: null,
      albums: [],
    };
  },
  methods: {
    mp3filechange(event) {
      const file = event.target.files[0];
      this.data.mp3file.filename = file.name;
      
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.data.mp3file.dataurl = reader.result;
          console.log(this.data.mp3file.dataurl);
        };
        reader.readAsDataURL(file);
      }
    },

    imagefilechange(event) {
      const file = event.target.files[0];
      this.data.imagefile.filename = file.name;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.data.imagefile.dataurl = reader.result;
          console.log(this.data.imagefile.dataurl);
        };
        reader.readAsDataURL(file);
      }
    },

    async submit() {
      const formData = new FormData();

      formData.append("audioDataUrl", this.data.mp3file.dataurl); // Append audio data URL as string
      formData.append("audioname", this.data.mp3file.filename);

      formData.append("image", this.data.imagefile.dataurl); // Append audio data URL as string
      formData.append("imagename", this.data.imagefile.filename);
      formData.append("name", this.track.name);
      formData.append("singer", this.track.singer);
      formData.append("music", this.track.music);
      formData.append("lyrics", this.track.lyrics);
      formData.append("lyricist", this.track.lyricist);
      formData.append("album_id", this.track.album_id);
      formData.append("owner_id", localStorage.getItem("current_user"));

      const res = await fetch(
        "http://localhost:8080/api/track/" + this.track.id,
        {
          method: "PUT",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
          body: formData,
        }
      );
      try {
        const data = await res.json();

        if (res.ok) {
          alert("track is updated");

          if (localStorage.getItem("role") == "admin") {
            this.$router.push({ path: "/admin/music" });
          } else {
            this.$router.push({ path: "/creatorpage" });
          }
        } else {
          this.error = "something went wrong";
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },

    async getalbums() {
      const res = await fetch(
        "http://localhost:8080/api/useralbum/" +
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
  },

  created: function () {
    console.log("this is the message on created");
    this.getalbums();
  },
};
