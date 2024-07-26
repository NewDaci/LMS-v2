const Navbar = {
  template: `
  <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">CityLibrary</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav me-auto">
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'user'" class="nav-item">
              <router-link class="nav-link" aria-current="page" to="/dashboard">Home</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'user'" class="nav-item">
              <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'user'" class="nav-item">
              <router-link class="nav-link" to="/category">Category</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'user'" class="nav-item">
              <router-link class="nav-link" to="/mybooks">My Books</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'librarian'" class="nav-item">
              <router-link class="nav-link" to="/admin_dashboard">Dashboard</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'librarian'" class="nav-item">
              <router-link class="nav-link" to="/allbooks">All Books</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'librarian'" class="nav-item">
              <router-link class="nav-link" to="/adminsection">Section</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'librarian'" class="nav-item">
              <router-link class="nav-link" to="/allusers">All Users</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'librarian'" class="nav-item">
              <router-link class="nav-link" to="/enrolls">Enrollments</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn && $store.state.currentUserRole === 'librarian'" class="nav-item">
              <router-link class="nav-link" to="/requests">Requests</router-link>
            </li>
          </ul>
          <form class="d-flex" @submit.prevent="search" role="search">
            <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
          <ul class="navbar-nav ms-auto">
          <li v-if="$store.state.isLoggedIn" class="nav-item">
                <router-link class="nav-link active" to="/profile">Welcome <span v-if="$store.state.currentUserRole === 'librarian'" >Admin~</span> {{ $store.state.currentUser }}!</router-link>
            </li>
            <li v-if="$store.state.isLoggedIn" class="nav-item">
              <a class="nav-link" role="button" @click="logout">Logout</a>
            </li>
            <li v-if="!$store.state.isLoggedIn" class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li v-if="!$store.state.isLoggedIn" class="nav-item">
              <router-link class="nav-link" to="/signup">Sign Up</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    async search() {
      const token = localStorage.getItem("access_token");
      const url = "http://localhost:5000/api/search";
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + " " + token,
          },
          body: JSON.stringify({
            search: this.searchQuery,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          this.$store.commit("setSearchResults", data);
          this.$router.replace('/search').catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              console.error(err);
            }
          });
        } else {
          const errorData = await res.json();
          alert(errorData.msg);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    logout() {
      this.$store.commit('logout');
      this.$router.push("/login");
    }
  },
};

export default Navbar;
