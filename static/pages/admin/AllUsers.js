const AllUsers = {
  template: `
    <div class="container-fluid vh-100">
      <div class="mt-2">
        <div class="me-auto d-flex justify-content-between align-items-center mb-3">
        
        <h1 class="fw-bold text-uppercase text-decoration-underline">All Users</h1>
    </div>
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in datas" :key="user.id">
              <th scope="row">{{ user.id }}</th>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#booksModal' + user.id" @click="details(user.id)">Details</button>

                <!-- Modal -->
        <div class="modal fade" :id="'booksModal' + user.id" tabindex="-1" aria-labelledby="booksModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="booksModalLabel">Books Issued by {{ user.name }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th scope="col">Book ID</th>
                      <th scope="col">Book Name</th>
                      <th scope="col">Author</th>
                      <th scope="col">Issue Date</th>
                      <th scope="col">Return Date</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="enroll in enrolls" :key="enroll.id">
                      <th scope="row">{{ enroll.book_id }}</th>
                      <td>{{ enroll.book_name }}</td>
                      <td>{{ enroll.author }}</td>
                      <td>{{ enroll.issue_date }}</td>
                      <td>{{ enroll.return_date }}</td>
                      <td>
                        <button class="btn btn-danger" @click="revoke(enroll.id, user.id)">Revoke</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal end -->




          <!-- Modal confirmation -->
                    <div class="modal fade" :id="'exampleModal' + user.id" tabindex="-1" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Delete This User</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Are you Sure want to Delete This User?
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Close</button>
                                    <button @click="deleteUser(user.id)" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                <router-link class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + user.id" to="/view">Delete User</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  data() {
    return {
      datas: [],
      enrolls: [],
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {

    async fetchUser() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/admin/user", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json()
        if (response.ok) {
          this.datas = result;
        } else {
          console.error("Error while fetching")
        }
      } catch (e) {
        console.error("Error while fetching", e);
      }
    },

    async details(user_id) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:5000/api/admin/enroll/${user_id}`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          this.enrolls = result;
        } else {
          console.error("Error while fetching books");
        }
      } catch (e) {
        console.error("Error while fetching books", e);
      }
    },

    async revoke(enroll_id, user_id) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:5000/api/admin/revoke/${enroll_id}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json()
        if (response.ok) {
          alert(result.msg)
          const modal = document.getElementById("booksModal"+user_id)
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchUser();
        } else {
          console.error("Error while fetching")
        }
      } catch (e) {
        console.error("Error while fetching", e);
      }
    },

    async deleteUser(user_id) {
      const token = localStorage.getItem("access_token");
      const url = `http://localhost:5000/api/admin/user/${user_id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully DELETED User from Database.");
          const modal = document.getElementById('exampleModal' + user_id);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchUser();

        } else {
          alert(result.error_message || "Failed to delete user.");
        }
      } catch (e) {
        console.error("Error while deleting User.", e);
      }
    },

  },
};

export default AllUsers;
