export default {
  template: `
    

<div class="navdiv" >
    <nav v-if="this.role=='admin'">
      <ul>
          <li><router-link  to="/admin/">Home</router-link></li>
          <li><router-link  to="/admin/users">Users</router-link> </li>
          <li><router-link  to="/admin/music">Music</router-link></li>
      
      </ul>
      <div class="search">
        
            <i class="bi bi-search"></i>
            <input v-model="searchtext"  placeholder="search music" @change="this.search">
            
       
      </div>
      <div style="display: flex; justify-content: space-between;">

        
        
        
        <div class="logout"  style="padding-top: 5px; " @click='logout'@mouseover="hover = true" 
        @mouseout="hover = false"  :style="{cursor: hover ? 'pointer' : 'default'}" > Logout</div>
        
        <div class="user" style="margin-left: 10px;">
            <p>U</p>   
        </div>
        
      </div>
      

    </nav>

    <nav v-if="this.role=='user'||this.role=='creator'">
    <ul>
        <li><router-link  to="/user/">Home</router-link></li>
        <li><router-link  to="/user/createplaylist">Create New Playlist</router-link> </li>
        <li v-if="this.role=='user'" @click="becomeCreator"
        @mouseover="hover = true"  
        @mouseout="hover = false"  :style="{cursor: hover ? 'pointer' : 'default', color: hover ? '#fff' : '#4c5262'}">
        Become a Creator</li>
        <li v-if="this.role=='creator'" @click="creatorPage"
        @mouseover="hover = true"  
        @mouseout="hover = false"  :style="{cursor: hover ? 'pointer' : 'default', color: hover ? '#fff' : '#4c5262'}">
        <a>Lets Create Something</a>
        </li>
    
    </ul>
    <div class="search">
        
            <i class="bi bi-search"></i>
            <input v-model="searchtextuser"  placeholder="search music" @change="this.searchuser">
            
       
      </div>
    <div style="display: flex; justify-content: space-between;">

      
      
      
      <div class="logout"  style="padding-top: 5px; " @click="this.logout"@mouseover="hover = true" 
      @mouseout="hover = false"  :style="{cursor: hover ? 'pointer' : 'default'}" > Logout</div>
      
      <div class="user" style="margin-left: 10px;">
          <p>U</p>   
      </div>
      
    </div>
    

  </nav>
</div>

    `,
  data() {
    return {
      register: null,
      page: null,
      role: null,
      hover: false,
      hovern: null,
      searchtext: null,
      searchtextuser:null
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("role");
      localStorage.removeItem("current_user");

      this.$router.push({ path: "/" });
      this.role = null;
    },

    async becomeCreator(){
      const formData=new FormData()
      formData.append("id", localStorage.getItem("current_user"))
      const res=await fetch("http://127.0.0.1:8080/creatormaker",{
        method: "POST",
        body: formData

      })
      const data= await res.json()
      if(res.ok){
        alert("you have become a creator")
        localStorage.setItem("current_user","creator")
        alert("Please Login again to see the changes")
        this.logout()
        
      }
      else{
        console.log("couldn't become a creator", data.message)
      }
    },
    
    creatorPage(){
      this.$router.push({ name: "creatorPage"});
    },
    search(){
      this.$router.push({name:"adminSearchResult",params:{text: this.searchtext}})
    },
    searchuser(){
      this.$router.push({name:"userResult",params:{text: this.searchtextuser}})
    }
  },

  created: function () {
    console.log(localStorage.getItem("role"), "from navbar");
    this.role = localStorage.getItem("role");
  },
};
