export default {
  template: `
    <div class="form_side">
  
          <div class="h4">
              <span></span> <h4>ADD ALBUM</h4><span></span><span></span><span></span>
          </div>
          <div class="container">
  
              <div class="row">
                  <form  @submit.prevent="submit"  >
                  <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                          <p>
                          <dt> <label>Add Album Title </label></dt>
                          <dd><input v-model="data.title"  class="input"  required ></dd>
                          </p>
                          <p>
                          <dt> <label>Add Album Author </label></dt>
                          <dd><input v-model="data.author" class="input" required ></dd>
                          </p>
                          <p>
                          <p>
                          <dt> <label>Add Album Cover  </label></dt>
                          <dd><input class="form-control"  type="file" @change="imagefilechange" required ></dd>
                          </p>
                          <p><button type="submit" class="submit btn-info" >Add Album</button>
                          </p>
                  </form>
              </div>
          </div>
      </div>
  `,

  data() {
    return {
      data: {
        author: "",
        title: "",
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

      formData.append("image", this.data.imagefile.dataurl); // Append audio data URL as string
      formData.append("imagename", this.data.imagefile.filename);
      formData.append("title", this.data.title);
      formData.append("author", this.data.author);
      formData.append("owner_id", localStorage.getItem("current_user"));

      const res = await fetch("http://localhost:8080/api/album", {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },

        body: formData,
      });
      try {
        const data = await res.json();
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
          this.data.title = null;
          this.data.author = null;
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
  },
};
