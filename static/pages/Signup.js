const Signup = {
  template: `
    <section class="vh-100">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-lg-12 col-xl-11" style="width: 75%;">
            <div class="card text-black" style="border-radius: 25px;">
              <div class="card-body p-md-5" style="width: 125%;">
                <div class="row justify-content-center">
                  <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                    <div :class="['alert', msgClass]" v-if="message" role="alert">
                      {{ message }}
                    </div>

                    <form class="mx-1 mx-md-4" @submit.prevent="submitInfo">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div data-mdb-input-init class="form-outline flex-fill mb-0 position-relative">
                          <input type="text" id="form3Example1c" class="form-control" v-model="username" />
                          <label class="form-label" for="form3Example1c">Username</label>
                          <small v-if="usernameError" class="text-danger">{{ usernameError }}</small>
                          <i v-if="!usernameError && username" class="bi bi-check text-success position-absolute end-0 top-0 mt-3 me-3"></i>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div data-mdb-input-init class="form-outline flex-fill mb-0 position-relative">
                          <input type="email" id="form3Example3c" class="form-control" v-model="email" />
                          <label class="form-label" for="form3Example3c">Email</label>
                          <small v-if="emailError" class="text-danger">{{ emailError }}</small>
                          <i v-if="!emailError && email" class="bi bi-check text-success position-absolute end-0 top-0 mt-3 me-3"></i>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div data-mdb-input-init class="form-outline flex-fill mb-0 position-relative">
                          <input type="password" id="form3Example4c" class="form-control" v-model="password" />
                          <label class="form-label" for="form3Example4c">Password</label>
                          <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
                          <i v-if="!passwordError && password.length >= 3" class="bi bi-check text-success position-absolute end-0 top-0 mt-3 me-3"></i>
                        </div>
                      </div>
                      
                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button 
                          type="submit" 
                          data-mdb-button-init 
                          data-mdb-ripple-init 
                          class="btn btn-primary btn-lg" 
                          :disabled="!isFormValid">
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="static/img/logo_lib.jpeg" class="img-fluid" style="height: 100%; overflow: hidden;" alt="Sample image">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      username: "",
      email: "",
      password: "",
      message: "",
      msgClass: "",
    };
  },
  computed: {
    usernameError() {
      return this.username ? '' : '(Username is required)';
    },
    emailError() {
      return this.email && this.validateEmail(this.email) ? '' : '(Invalid email format)';
    },
    passwordError() {
      return this.password.length >= 3 ? '' : '(Password must be at least 3 characters long)';
    },
    isFormValid() {
      return !this.usernameError && !this.emailError && !this.passwordError;
    }
  },
  methods: {
    async submitInfo() {
      const url = "http://localhost:5000/api/register"
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          }),
          credentials: "same-origin",
        });

        if (res.ok) {
          const data = await res.json();
          this.msgClass = 'alert-success';
          this.message = data.message;
          setTimeout(() => {
            this.$router.push("/login");
          }, 1500);
        } else {
          const errorData = await res.json();
          this.msgClass = 'alert-danger';
          this.message = errorData.message;
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        this.msgClass = 'alert-danger';
        this.message = "An error occurred during signup.";
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  },
};

export default Signup;
