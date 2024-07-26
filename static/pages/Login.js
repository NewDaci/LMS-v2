const Login = {
  template: `
  <section class="vh-100">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-12 col-xl-11" style="width: 75%;">
          <div class="card text-black" style="border-radius: 25px;">
            <div class="card-body p-md-5" style="width: 125%;">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>
                  <div :class="['alert', error ? 'alert-danger' : 'alert-success']" v-if="errorMessage" role="alert">
                    {{ errorMessage }}
                  </div>

                  <form class="mx-1 mx-md-4" @submit.prevent="submitInfo">
                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div data-mdb-input-init class="form-outline flex-fill mb-0">
                        <input type="email" id="form3Example3c" class="form-control" v-model="email" />
                        <label class="form-label" for="form3Example3c">Email ID</label>
                      </div>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                      <div data-mdb-input-init class="form-outline flex-fill mb-0">
                        <input type="password" id="form3Example4c" class="form-control" v-model="password" />
                        <label class="form-label" for="form3Example4c">Password</label>
                      </div>
                    </div>

                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg">Login</button>
                    </div>
                  </form>

                </div>
                <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                  <img src="static/img/login_img.jpg" class="img-fluid" style="height: 500px; width: 330px;" alt="Sample image">
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
      email: "",
      password: "",
      errorMessage: "",
      error: false,
    };
  },
  methods: {
    async submitInfo() {
      const url = "http://localhost:5000/api/login";
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
          credentials: "same-origin",
        });

        if (res.ok) {
          const data = await res.json();
          this.error = false;
          this.errorMessage = data.message;
          localStorage.setItem("access_token", data.access_token);
          this.$store.dispatch("fetchUser");

          // Redirect based on user role
          if (data.role === 'librarian') {
            setTimeout(() => {
              this.$router.push("/admin_dashboard");
            }, 1000);
          }else {
            setTimeout(() => {
              this.$router.push("/dashboard");
            }, 1000);
          }
        } else {
          const errordata = await res.json();
          this.error = true;
          this.errorMessage = errordata.message;
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        this.error = true;
        this.errorMessage = "An error occurred during login.";
      }
    },
  },
};

export default Login;
