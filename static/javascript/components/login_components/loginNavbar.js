export default {
  template: `
      <nav class="navbar">
      
        <img src="/static/assets/logo3.png" alt="image">
        <ul>
           <h1 style>GEET MP3 PLAYER</h1>
        </ul>
        <div class="user">
        <span @click="toggleRegister" >{{register.message}}</span>
        </div>
        
      </nav>
  
  
     
      `,
  data() {
    return {
      register: { message: "REGISTER", cond: false },
    };
  },
  methods: {
    toggleRegister(){
        if (this.register.cond==false){
            this.register.message="SIGN IN"
            this.register.cond=true
            this.$router.push({name : "register"})

        }
        else{
            this.register.message="REGISTER"
            this.register.cond=false
            this.$router.push({name : "login"})
            
        }
    }
  },
};
