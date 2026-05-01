export default {
  template: `
  <div class="form_side_track">

        <div class="h4_track">
            <span></span> <h4>ADD TRACK</h4><span></span><span></span><span></span>
        </div>
        <div class="container_track">

            <div class="row_track">
            <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                <form  @submit.prevent="submit"  style="display: flex; justify-content: space-between;">
                        <div>
                        <p>
                        <dt> <label>Add Track Name </label></dt>
                        <dd><input v-model="data.name"  class="input"  required ></dd>
                        </p>
                        <p>
                        <dt> <label>Add singer Name </label></dt>
                        <dd><input v-model="data.singer" class="input" required ></dd>
                        </p>
                        <p>
                        <dt> <label>Add Music Producer </label></dt>
                        <dd><input v-model="data.music" class="input" required ></dd>
                        </p>
                        <p>
                        <dt> <label>Lyricist's Name </label></dt>
                        <dd><input v-model="data.lyricist"  class="input" required></dd>
                        </p>
                        <label >Add a album</label>
                        <select v-model="data.album_id" name="album" class="form-control" >
                          <option v-for="album in albums" :key="album.id"  :value="album.id">
                            {{album.title}}
                           </option>
                        </select>

                    </div>
        
                    <div>
                        <p>
                        <dt> <label>Add Track Lyrics </label></dt>
                        <dd><textarea v-model="data.lyrics" id="lyrics" name="lyrics" placeholder="Add track lyrics" rows="5">NOT AVAILABLE</textarea></dd>
                        </p>
                        <p>
                        <dt> <label>Track's Image required </label></dt>
                        <dd><input class="form-control"  type="file" @change="imagefilechange" required></dd>
                        </p>
       
                        <p>
                        <dt> <label>MP3 File</label></dt>
                        <dd><input class="form-control"  type="file"  @change="mp3filechange"  required ></dd>
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

  data() {
    return {
      data: {
        name: "",
        singer: "",
        music: "",
        lyrics: "",
        lyricist: "",
        album_id: null,
        imagefile: {
          dataurl: "",
          filename: "",
        },
        mp3file: {
          dataurl: "",
          filename: "",
        },
        isimage: false,
        ismp3: false
      },
      error: null,
      albums: [],
    };
  },
  methods: {
    mp3filechange(event) {
      const file = event.target.files[0];
      this.data.mp3file.filename = file.name;
      if (!file.name.endsWith(".mp3")) {
        this.error = "Enter MP3 file only";
        console.log(this.error);
        this.data.name = "";
        this.data.singer = "";
        this.data.music = "";
        this.data.lyrics = "";
        this.data.lyricist = "";
        this.data.album_id = null;
        this.data.name = "";
        this.data.name = "";
        this.isimage=true
        
      } else {
        if (file) {
          // Create a FileReader instance
          const reader = new FileReader();

          // Set up the onload callback function
          reader.onload = () => {
            // When the file is read successfully, set the audioDataUrl to the result
            this.data.mp3file.dataurl = reader.result;
          };

          // Read the file as a Data URL
          reader.readAsDataURL(file);
        }
      }
    },

    imagefilechange(event) {
      const file = event.target.files[0];
      this.data.imagefile.filename = file.name;
      this.data.imagefile.filename = file.name;
      const extension = file.name.split(".").pop().toLowerCase();
      const isImage = ["jpeg", "jpg", "png"].includes(extension);
      if (!isImage) {
        this.error = "Enter MP3 file only";
        console.log(this.error);
        this.data.name = "";
        this.data.singer = "";
        this.data.music = "";
        this.data.lyrics = "";
        this.data.lyricist = "";
        this.data.album_id = null;
        this.data.name = "";
        this.data.name = "";
      } else {
        if (file) {
          // Create a FileReader instance
          const reader = new FileReader();

          // Set up the onload callback function
          reader.onload = () => {
            // When the file is read successfully, set the audioDataUrl to the result
            this.data.imagefile.dataurl = reader.result;
          };

          // Read the file as a Data URL
          reader.readAsDataURL(file);
        }
      }
    },

    async submit() {
      const formData = new FormData();

      formData.append("audioDataUrl", this.data.mp3file.dataurl); // Append audio data URL as string
      formData.append("audioname", this.data.mp3file.filename);

      formData.append("image", this.data.imagefile.dataurl); // Append audio data URL as string
      formData.append("imagename", this.data.imagefile.filename);
      formData.append("name", this.data.name);
      formData.append("singer", this.data.singer);
      formData.append("music", this.data.music);
      formData.append("lyrics", this.data.lyrics);
      formData.append("lyricist", this.data.lyricist);
      formData.append("album_id", this.data.album_id);
      formData.append("owner_id", localStorage.getItem("current_user"));

      const res = await fetch("http://localhost:8080/api/track", {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
        body: formData,
      });
      try {
        const data = await res.json();
        console.log("this is the data response", data);
        if (res.ok) {
          alert(data.message);
          if (localStorage.getItem("role") == "admin") {
            this.$router.push({ path: "/admin" });
          } else {
            this.$router.push({ path: "/creatorpage" });
          }
        } else {
          this.error = data.message;
          console.log(this.error);
          this.data.name = "";
          this.data.singer = "";
          this.data.music = "";
          this.data.lyrics = "";
          this.data.lyricist = "";
          this.data.album_id = null;
          this.data.name = "";
          this.data.name = "";
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised", error);
        console.log("this is the error", error);
      }
    },

    async getalbums() {
      const res = await fetch(
        "http://localhost:8080/api/useralbum/" +
          localStorage.getItem("current_user"),
        {
          ////here do something with api such as making if parameter i.e. userid is passed then make a special get request for that useronly
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
        alert("You are not authorised");
        console.log("this is the error", error);
      }
    },
  },

  created: function () {
    console.log("this is the message on created");
    this.getalbums();
  },
};

// export default {
//   template: `
//
//     `,
//   data() {
//     return {
//       track: {
//         // name: null,
//         // singer: null,
//         // lyricist: null,
//         // music: null,
//         // album: null,
//         // lyrics: null,
//         // image: null,
//         mp3file: null,
//       },
//     };
//   },

//   mounted: function () {
//     console.log("mounted");
//   },
// };
