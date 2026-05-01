export default {
  template: `<div class="form_side">
                            
    <div class="h4">
        <span></span> <h4>General Users</h4><span></span><span></span><span></span>
    </div>
    
    <div class="container" style="display: block;">
        
        <div class="rowtable" style="height: 250px;">
           
            <table class="table table-dark" >
                <thead >
                  <tr >
                    

                  
                    <th  style="background: #111727;" scope="col">ID</th>
                    <th  style="background: #111727;" scope="col">NAME</th>
                    <th  style="background: #111727;" scope="col">EMAIL</th>
                    <th  style="background: #111727;" scope="col">CONTACT</th>
                    <th  style="background: #111727;" scope="col">DATE Of JOINING</th>
                    <th  style="background: #111727;" scope="col">Flagged</th>
                    <th  style="background: #111727;" scope="col">&nbspDELETE</th>

                  </tr>
                </thead>
         <tbody>
            
            <tr  v-for="user in this.users" >
              
              <td style="background: #111727;">{{user.id}}</td>
              <td style="background: #111727;" >{{user.name}}</td>
              <td style="background: #111727;" >{{user.email}}</td>
              <td style="background: #111727;" >{{user.contact}}</td>
              <td style="background: #111727;" >{{user.doj}}</td>
              <td style="background: #111727;" ><button  class="btn btn-sm" :class="{ 'btn-outline-info': user.flagged ==false, 'btn-outline-danger': user.flagged !=false}" @click="userFlagged(user.id,user.flagged,flag)"  >{{user.flagged}}</button></td>
              <td style="background: #111727;" ><button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)" >Delete</button></td>    
            </tr>
            
                 
                  
                </tbody>
              </table>   
              
        </div>
        
        <div class="h4">
            <span></span> <h4>Creators</h4><span></span><span></span><span></span>
        </div>    
        <div class="rowtable" style="height: 250px;">
           
            <table class="table table-dark" >
                <thead >
                  <tr >
                    

                   
                    <th  style="background: #111727;" scope="col">ID</th>
                    <th  style="background: #111727;" scope="col">NAME</th>
                    <th  style="background: #111727;" scope="col">EMAIL</th>
                    <th  style="background: #111727;" scope="col">CONTACT</th>
                    <th  style="background: #111727;" scope="col">DATE Of JOINING</th>
                    <th  style="background: #111727;" scope="col">Flagged</th>
                    <th  style="background: #111727;" scope="col">Active</th>
                    <th  style="background: #111727;" scope="col">&nbspDELETE</th>
                  </tr>
                </thead>
         <tbody>
            
            <tr  v-for="user in this.creators" >
              
              <td style="background: #111727;">{{user.id}}</td>
              <td style="background: #111727;" ><a href="#" class="links" >{{user.name}}</a></td>
              <td style="background: #111727;" >{{user.email}}</td>
              <td style="background: #111727;" >{{user.contact}}</td>
              <td style="background: #111727;" >{{user.doj}}</td>
              <td style="background: #111727;" ><button  class="btn btn-sm" :class="{ 'btn-outline-info': user.flagged ==false, 'btn-outline-danger': user.flagged !=false}" @click="userFlagged(user.id,user.flagged,'flag')"  >{{user.flagged}}</button></td>
              <td style="background: #111727;" ><button  class="btn btn-sm" :class="{ 'btn-outline-info': user.active !=false, 'btn-outline-danger': user.active ==false}" @click="userFlagged(user.id,user.active,'active')"  >{{user.active}}</button></td>
              <td style="background: #111727;" ><a href="#"  class="btn btn-sm btn-outline-danger"  @click="deleteUser(user.id)">Delete</a></td>    
            </tr>
            
                </tbody>
              </table>   
              
        </div>

        
              
        </div>

</div>`,
  data() {
    return {
      creators: [],
      users: [],
    };
  },
  methods: {
    async getusers() {
      try {
        const res = await fetch("http://localhost:8080/api/getuser/creator", {
          method: "GET",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.creators = data;
        } else {
          console.log(
            "something error happeend when retrieving albums from backend:",
            data.message
          );
        }
        const res2 = await fetch("http://localhost:8080/api/getuser/user", {
          method: "GET",
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        });
        const data2 = await res2.json();
        if (res2.ok) {
          this.users = data2;
        } else {
          console.log(
            "something error happeend when retrieving albums from backend:",
            data2.message
          );
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },

    async userFlagged(id, val, check) {
      const formdata = new FormData();
      formdata.append("check", check);
      formdata.append("flag", val);
      const res = await fetch("http://localhost:8080/api/getuser/" + id, {
        method: "PUT",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
        body: formdata,
      });
      try {
          const data = await res.json();
          if (res.ok) {
            this.getusers();
            console.log("flagged status changed");
          } else {
            console.log(data.message);
          }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
    async deleteUser(id) {
      const res = await fetch("http://localhost:8080/api/getuser/" + id, {
        method: "DELETE",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      try {
        const data = await res.json();
        // Process the data here

        if (res.ok) {
          alert("User has been deleted");
          this.getusers();

          console.log("User deleted successfully");
        } else {
          alert(data.message);
        }
      } catch (error) {
        // Handle the error here
        alert("You are not authorised to delete");
      }
    },
  },

  mounted: function () {
    this.getusers();
  },
};
