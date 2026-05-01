export default {
  template: ` 
    <div>
    <div class="h4">
                <span></span> <h4> REGISTER</h4><span></span><span></span><span></span>
    </div>

     <div class="form_side">
        
        <div class="container">

            <div class="row">
            <form>
            <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                    
                    <p>
                    <dt> <label>Name </label> </dt>
                    <dd><input v-model="cred.name"   class="input" required></dd>
                    </p>

                    <label for="gender">Gender</label>
                            <select v-model="cred.gender"   class="form" required >
                                <option value="">select</option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                
                            </select>

                    <p>
                    <p>
                    <dt> <label>Contact </label> </dt>
                    <dd><input v-model="cred.contact"   class="input" required></dd>
                    </p>
                    <dt> <label>Become a Creator &nbsp&nbsp &nbsp&nbsp</label> 
                   <input v-model="creator" type="checkbox"   class="input" ></dt>
                    </p> 

                    <dt> <label>Email </label> </dt>
                    <dd><input v-model="cred.email" type="email"   class="input" required></dd>
                    </p>
                    <p>
                    <dt> <label>Password </label> </dt>
                    <dd><input v-model="cred.password" type="password" class=" input" required>
                    </dd>
                    </p>
                    <p><button @click="register" style ="margin-top: 5px"  class="btn submit btn-info" >Login</button></p>   
              </form>
            </div>
            <div class="image_side">
                
                <img src="/static/assets/logo3.png" alt="">
            </div>

        </div>


    </div>

</div>

`,
  data() {
    return {
      cred: {
        email: null,
        password: null,
        name: null,
        contact: null,
        gender: null,

        roles: [],
      },
      creator: false,
      error: null,
    };
  },
  methods: {
    async register() {
      if (!this.creator) {
        console.log("this is role checkbox input:", this.creator);
        console.log(
          "this is cred.role and its type",
          this.cred.roles,
          typeof this.cred.roles
        );
        this.cred.roles.push("user");
      } else {
        this.cred.roles.push("creator");
      }
      console.log("this is payload", this.cred);
      const res = await fetch("/user-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

         
        },
        body: JSON.stringify(this.cred),
      });

      try {
        const data = await res.json();
        if (res.ok) {
          console.log(data);
  
          this.$router.push({ name: "login" });
        } else {
          this.error = data.message;
          console.log(res);
          self = this;
          // Object.keys(this.cred).forEach(function (key, index) {
          //   self.cred[key] = "";
          // });
          this.cred.name = null;
          this.cred.email = null;
          this.cred.password = null;
          this.cred.gender = null;
          this.cred.contact = null;
          this.cred.roles = [];
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
  },
};
