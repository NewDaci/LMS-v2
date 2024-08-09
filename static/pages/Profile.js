import fetchHTTP from "../utils.js";

const Profile = {
  template: `
<div class="container mt-3 d-flex flex-column min-vh-100">
    <div class="container">
        <h1 class="fw-bold text-decoration-underline">Basic Details</h1>
        <h3 class="fw-bold mt-3">ID : {{ user.id }}</h3>
        <h3 class="fw-bold">Name : {{ user.name }}</h3>
        <h3 class="fw-bold">Email : {{ user.email }}</h3>
        <h3 class="fw-bold">Role : {{ user.role }}</h3>
    </div>

    <div v-if="$store.state.currentUserRole === 'user'" class="container mt-4">
        <h1 class="fw-bold text-decoration-underline">Issued Books</h1>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Book ID</th>
                    <th scope="col">Book Name</th>
                    <th scope="col">Author</th>
                    <th scope="col">Issue Date</th>
                    <th scope="col">Return Date</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(enroll, index) in books" :key="enroll.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ enroll.bookid }}</td>
                    <td>{{ enroll.name }}</td>
                    <td>{{ enroll.author_name }}</td>
                    <td>{{ enroll.issue_date }}</td>
                    <td>{{ enroll.return_date }}</td>
                    <td>
                        <div class="d-flex">
                            <router-link class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + enroll.id" to="/view">Read</router-link>
                            <!-- Modal -->
                            <div class="modal fade" :id="'exampleModal' + enroll.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="exampleModalLabel">{{ enroll.name }}</h1>
                                            <button type="button" class="btn btn-secondary me-2 ms-auto" data-bs-dismiss="modal">Close</button>
                                        </div>
                                        <div class="modal-body" id="book-content">{{ enroll.content }}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- Modal end -->

                            <!-- Return book modals -->
                            <div class="modal fade" :id="'feedback' + enroll.bookid" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">How was the book?</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            Drop ur feedback on this book.
                                            <textarea v-model="feedback" cols="40" rows="10"></textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <button @click="returnbook(enroll.id, enroll.bookid)" class="btn btn-success">Submit</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" :id="'return' + enroll.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Completed this book?</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="mb-3">
                                                <label for="recipient-name" class="col-form-label">Finished Reading this Book? Mark it as completed?</label>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                                            :data-bs-target="'#feedback' + enroll.bookid" data-bs-whatever="@mdo" @click="setReadValue('No')">No</button>

                                        <button type="button" class="btn btn-success" data-bs-toggle="modal"
                                            :data-bs-target="'#feedback' + enroll.bookid " data-bs-whatever="@mdo" @click="setReadValue('Yes')">Yes</button>
                                    </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-danger ms-2" data-bs-toggle="modal" :data-bs-target="'#return' + enroll.id">Return</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <h3>Total No. of Books Enrolled : {{ total_books }}</h3>
    </div>

    <div class="d-flex my-5">
        <button class="btn btn-success me-2 ms-3" data-bs-toggle="modal" data-bs-target="#updateModal">Update Details</button>
        <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="updateModalLabel">Update Details</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="updateProfile">
                        <div class="mb-3">
                          <label for="recipient-name" class="col-form-label">Change Name:</label>
                          <input type="text" class="form-control" v-model="updatedUser.name">
                        </div>
                        <div class="mb-3">
                          <label for="recipient-email" class="col-form-label">Change Email:</label>
                          <input type="text" class="form-control" v-model="updatedUser.email">
                          <div v-if="!isEmailValid" class="text-danger">Invalid email format</div>
                        </div>
                        <div class="mb-3">
                          <label for="recipient-password" class="col-form-label">Change Password:</label>
                          <input type="password" class="form-control" v-model="updatedUser.password">
                          <div v-if="!isPasswordValid" class="text-danger">Password must be greater than 2 characters</div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" class="btn btn-success">Update</button>
                        </div>
                      </form>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete Account</button>
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Remove Account</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete your account?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button @click="deleteacc" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <button @click='userBookReport(user.id)' class="btn btn-secondary ms-2">Download Report</button>
          <span v-if='isWaiting' class="ms-2">Waiting for download...</span>
    </div>
</div>
`,
  data() {
    return {
      user: "",
      books: [],
      isWaiting: false,
      total_books: 0,
      updatedUser: {
        name: "",
        email: "",
        password: "",
      },
      feedback: "",
      readValue: "",
    };
  },

  computed: {
    isEmailValid() {
      return this.validateEmail(this.updatedUser.email);
    },
    isPasswordValid() {
      return this.updatedUser.password.length > 2;
    },
  },

  mounted() {
    this.fetchProfile();
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    async userBookReport(id) {
      this.isWaiting = true;
      const res = await fetch(`/download-user-report/${id}`)
      const data = await res.json();
      if (res.ok) {
          const taskId = data["task-id"];
          const invt = setInterval(async () => {
              const csv_res = await fetch(`/get-report/${taskId}`)
              if (csv_res.ok) {
                  this.isWaiting = false
                  clearInterval(invt)
                  window.location.href = `/get-report/${taskId}`
                  alert("Report Downloaded!")

              }
          }, 1000)
      }
  },

    async fetchProfile() {
      this.feedback="";
      const token = localStorage.getItem("access_token");
      if (token) {
        const url = "http://localhost:5000/api/profile";
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            this.user = data.user;
            this.books = data.enrolls;
            this.total_books = data.total_books;
            this.updatedUser.name = data.user.name;
            this.updatedUser.email = data.user.email;
          } else {
            console.log("Error fetching profile");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    },
    async updateProfile() {
      const token = localStorage.getItem("access_token");
      if (token) {
        const url = "http://localhost:5000/api/profile/update";
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(this.updatedUser),
          });
          if (res.ok) {
            const data = await res.json();
            alert(data.message);
            const modal = document.getElementById('updateModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            this.fetchProfile();
            this.$store.dispatch("fetchUser");
          } else {
            console.log(res.error);
            alert("Error updating profile!");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    },

    setReadValue(value) {
      this.readValue = value;
    },

    async returnbook(enroll_id, book_id) {
      const token = localStorage.getItem("access_token");
      if (token) {
        const url = "http://localhost:5000/api/return";
        try {
          const res = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer" + " " + token,
            },
            body: JSON.stringify({
              enroll_id: enroll_id,
              feedback: this.feedback,
              read_val: this.readValue,
              book_id: book_id,
            })
          });
          if (res.ok) {
            const data = await res.json();
            alert(data.msg);
            const modal = document.getElementById('feedback'+book_id);
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            this.fetchProfile();
          } else {
            alert(res.error);
          }
        } catch (e) {
          console.error("Error while RETURING book", e)
        }
      }
    },

    async deleteacc() {
      const data = await fetchHTTP("DELETE", "/api/profile/delete")
      const modal = document.getElementById('deleteModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      this.$store.commit("logout");
      this.$router.push("/login");
    },
  },
};


export default Profile;