export default {
  template: `
      <div class="form_side">
    
            <div class="h4">
                <span></span> <h4>UPDATE ALBUM</h4><span></span><span></span><span></span>
            </div>
            <div class="container">
    
                <div class="row">
                    <form  @submit.prevent="submit"  >
                    <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                            <p>
                            <dt> <label>Add Album Title </label></dt>
                            <dd><input v-model="album.title"  class="input"  required ></dd>
                            </p>
                            <p>
                            <dt> <label>Add Album Author </label></dt>
                            <dd><input v-model="album.author" class="input" required ></dd>
                            </p>
                            <p>
                            <p>
                            <dt> <label>Add Album Cover  </label></dt>
                            <dd><input class="form-control"  type="file" @change="imagefilechange"  ></dd>
                            </p>
                            <p><button type="submit" class="submit btn-info" >Add Album</button>
                            </p>
                    </form>
                </div>
            </div>
        </div>
    `,
  props: ["album"],
  data() {
    return {
      data: {
        imagefile: {
          dataurl: "",
          filename: "",
        },
      },
      error: null,
    };
  },

  methods: {
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
      console.log(this.album);
      formData.append("image", this.data.imagefile.dataurl); // Append audio data URL as string
      formData.append("imagename", this.data.imagefile.filename);
      formData.append("title", this.album.title);
      formData.append("author", this.album.author);
      console.log("http://localhost:8080/api/album" + this.album.id);

      const res = await fetch(
        "http://localhost:8080/api/album/" + this.album.id,
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
          alert("file got updated");

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
  },
};
