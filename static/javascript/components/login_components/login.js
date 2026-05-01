export default {
  template: `
    <div>
            <div class="h4">
                        <span></span> <h4>Main LOGIN</h4><span></span><span></span><span></span>
            </div>

             <div class="form_side">
                
                <div class="container">

                    <div class="row">
                    <form>
                    <dt  v-if="error!=null"> <label class="text-danger">{{error}} </label> </dt>
                            <p>
                            <dt> <label>Email </label> </dt>
                            <dd><input v-model="cred.email" type="email"  id="user-email" class="input"></dd>
                            </p>
                            <p>
                            <dt> <label>Password </label> </dt>
                            <dd><input v-model="cred.password" type="password" class=" input" id="user-password">
                            </dd>
                            </p>
                            <p><button @click="login"  style ="margin-top: 5px"  class="btn submit btn-info" >Login</button></p>   

                              
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
      },

      error: null,
    };
  },
  methods: {
    async login() {
      console.log("inside login");
      const res = await fetch("/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          
        },
        body: JSON.stringify(this.cred),
      });
      try {
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("auth-token", data.token),
            localStorage.setItem("role", data.role);
          localStorage.setItem("current_user", data.user_id);
          console.log(data);
          this.error = null;
          console.log("sucessfuly log in");
          console.log(this.error);
  
          if (data.role == "admin") {
            this.$router.push({ path: "/admin" });
          } else if (data.role == "user") {
            console.log("toward user home");
            this.$router.push({ path: "/user" });
          } else if (data.role == "creator") {
            this.$router.push({ path: "/user" });
          } else {
            alert("login Role is in invalid");
          }
        } else {
          this.error = data.message;
          console.log(this.error);
          this.cred.password = null;
          this.cred.email = null;
        }
       
        
      } catch (error) {
        // Handle the error here
        alert("You are not authorised");  console.log("this is the error", error)
      }
    },
  },
};
