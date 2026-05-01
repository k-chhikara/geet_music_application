export default {
  template: `
  
  <div class="form_side">
                            
  <div class="container">
      
      <div class="row" style="margin-right: 5%;">
         
          <table class="table table-dark" >
              <thead >
                <tr >
                  <th  style="background: #111727;" scope="col"> S.no</th>
                  <th  style="background: #111727;" scope="col">Name</th>
                 
                  <th  style="background: #111727;" scope="col">Music</th>
                  <th  style="background: #111727;" scope="col">Director</th>
                  <th  style="background: #111727;" scope="col">Published</th>
                  
                </tr>
              </thead>
              <tbody>
                  
                <tr v-for="track in tracks"  v-if="track.album_id==id">
                  <th  style="background: #111727;" scope="row">1</th>
                  <td style="background: #111727;"><router-link :to="{name : 'trackSinglePage', params:{id: track.id}}" class="links" >{{track.name}}</router-link></td>
                  <td style="background: #111727;" >{{track.singer}}</td>
                  <td style="background: #111727;" >{{track.music}}</td>
                  <td style="background: #111727;" >{{track.published.substring(0,10) }}</td>
                  
                </tr>
                
                
                
              </tbody>
            </table>                         
          
          

      </div>
</div>
  </div>

  
  `,
  props: ["id"],
  data() {
    return {
      tracks: [],
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
  },
  created: function () {
    this.getTracks();
  },
};
