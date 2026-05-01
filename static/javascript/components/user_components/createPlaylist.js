export default {
  template: `

<div class="form_side">
    
    <div class="container">
        
        <div class="row">
            <form class="form_side"  @submit.prevent="submit" >


            <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                <div class="row">

                    <label>Name of the Playlist : <input v-model="playlist_name" type="text"  required/></label>
    
                </div>
                
                           
                
                <button type="submit" class="submit_home" > Create Playlist</button>
            </form> 
        </div>
    </div>
</div>
    `,
  data() {
    return {
      playlist_name: null,
      error: null,
    };
  },
  methods: {
    async submit() {
      const formData = new FormData();

      formData.append("name", this.playlist_name); // Append audio data URL as string
      formData.append("current_user", localStorage.getItem("current_user"));
      console.log(formData);
      const res = await fetch("http://localhost:8080/api/playlist", {
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
            this.$router.push({ path: "/user" });
          } else {
            this.error = data.message;
            console.log(this.error);
            this.playlist_name = null;
          }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
  },
};
