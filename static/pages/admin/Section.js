const Section = {
  template: `
  <div class="container-fluid">
    <div class="me-auto d-flex justify-content-between align-items-center mb-3">
      <h1 class="fw-bold text-uppercase text-decoration-underline">Sections</h1>
      <a data-bs-toggle="modal" data-bs-target="#addModal" class="btn btn-warning">Add New Section</a>
       <!-- addbook start here -->

                <!-- new section -->
              <!-- section Modal -->
              <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                <div class="modal-dialog ">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="addModalLabel">New Section</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="addsection">
                        <div class="mb-3">
                          <label for="sec-name" class="col-form-label">Section Name:</label>
                          <input type="text" class="form-control" v-model="newsec.name">
                        </div>
                        <div class="mb-3">
                          <label for="description" class="col-form-label">Description:</label>
                          <textarea class="form-control" cols="10" rows="5" v-model="newsec.description"></textarea>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" class="btn btn-warning">Create</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <!-- addbook Modal end -->
                <!-- Modal end -->

                <!-- addbook end here -->
    </div>

    <div class="min-vh-100">
        <div class="row g-3 mt-3 m-0 col-12">
          <div v-for=" (s,count) in sec" class="col-4">
            <div class="card border-5 rounded-4 shadow" style="min-height: 200px;">
              <div class="card-body d-flex">
                <div class="col-6">
                  <a>
                    <h1 class="fw-bold text-uppercase">{{ s.name }}</h1>
                  </a>
                  <h5>{{ s.description }}</h5>
                  <p>No. of Books in this section : <span class="fw-bold">{{ count }}</span></p>
                  <p>Date added: {{ s.date_created }}</p>
                </div>
                <div class="col-6 d-flex justify-content-end align-items-center">

                <a data-bs-toggle="modal" :data-bs-target="'#addModal' + s.id" class="btn btn-primary me-2">Add Book</a>

                  <!-- addbook start here -->

                <!-- add -->
              <!-- add Modal -->
              <div class="modal fade" :id="'addModal' + s.id" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="addModalLabel">Add Book to {{ s.name }}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="addBook(s.id)">
                      <div class="mb-3">
                          <label for="book-isbn" class="col-form-label">ISBN No.:</label>
                          <input type="number" class="form-control" v-model="newbook.isbn">
                        </div>
                        <div class="mb-3">
                          <label for="book-name" class="col-form-label">Book Name:</label>
                          <input type="text" class="form-control" v-model="newbook.name">
                        </div>
                        <div class="mb-3">
                          <label for="book-author" class="col-form-label">Author:</label>
                          <input type="text" class="form-control" v-model="newbook.author_name">
                        </div>
                        <div class="mb-3">
                          <label for="book-section" class="col-form-label">Section:</label>
                          <input type="text" class="form-control" v-model="s.name" disabled>
                        </div>
                        <div class="mb-3">
                          <label for="book-language" class="col-form-label">Language:</label>
                          <input type="text" class="form-control" v-model="newbook.language">
                        </div>
                        <div class="mb-3">
                          <label for="book-content" class="col-form-label">Content:</label>
                          <textarea class="form-control" cols="12" rows="10" v-model="newbook.content"></textarea>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" class="btn btn-primary">Add</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <!-- addbook Modal end -->
                <!-- Modal end -->

                <!-- addbook end here -->




              <button class="btn btn-success me-2" data-bs-toggle="modal" :data-bs-target="'#updateModal' + s.id">Update</button>
                <!-- Modal -->
                <!-- Update -->
              <!-- Update Modal -->
              <div class="modal fade" :id="'updateModal' + s.id" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="updateModalLabel">Update Section</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="updateBook(s.id)">
                        <div class="mb-3">
                          <label for="sec-name" class="col-form-label">Section Name:</label>
                          <input type="text" class="form-control" v-model="s.name">
                        </div>
                        <div class="mb-3">
                          <label for="description" class="col-form-label">Description:</label>
                          <textarea class="form-control" cols="10" rows="10" v-model="s.description"></textarea>
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
              <!-- Update Modal end -->

                  <!-- Modal confirmation -->
                  <button class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="'#deleteModal'+s.id">Delete</button>
                    <div class="modal fade" :id="'deleteModal'+s.id" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="deleteModalLabel">Are you Sure want to delete this section?</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                  This will also remove book asign to this section?
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button @click="deletebook(s.id)" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        </div>
                        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      sec: [],

      newsec: {
        "name": "as",
        "description": "sa",
      },

      newbook: {
        "isbn": "23",
        "name": "as",
        "author_name": "sa",
        "language": "Hindi",
        "section_name": "",
        "content": "sd",
      },
    };
  },
  mounted() {
    this.fetchSection();
  },
  methods:{

    async fetchSection(){
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/admin/section", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json()
        if (response.ok) {
          this.sec = result;
        } else {
          console.error("Error while fetching")
        }
      } catch (e) {
        console.error("Error while fetching", e);
      }
    },

    async addsection() {
      const token = localStorage.getItem("access_token");
      const section = this.newsec;
      const url = `http://localhost:5000/api/admin/sec`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify(section),
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully Added Section.");
          const modal = document.getElementById('addModal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchSection();

        } else {
          alert(result.error_message || "Failed to Add the section.");
        }
      } catch (e) {
        console.error("Error while Adding the section.", e);
      }
    },

    async addBook(s_id) {
      const token = localStorage.getItem("access_token");
      const book = this.newbook;
      book.section_name = this.sec.find(sec => sec.id === s_id).name; 
      const url = `http://localhost:5000/api/book`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify(book),
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully Added book.");
          const modal = document.getElementById('addModal'+s_id);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchSection();

        } else {
          alert(result.error_message || "Failed to Add the book.");
        }
      } catch (e) {
        console.error("Error while Adding the book.", e);
      }
    },

    async deletebook(sec_id) {

      const token = localStorage.getItem("access_token");
      const url = `http://localhost:5000/api/admin/sec/${sec_id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully DELETED the section.");
          const modal = document.getElementById('deleteModal' + sec_id);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchSection();

        } else {
          alert(result.error_message || "Failed to delete section.");
        }
      } catch (e) {
        console.error("Error while deleting the section.", e);
      }
    },

    async updateBook(sec_id) {
      const token = localStorage.getItem("access_token");
      const section = this.sec.find(sec => sec.id === sec_id);
      const url = `http://localhost:5000/api/admin/sec/${sec_id}`;
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify(section),
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully updated section.");
          const modal = document.getElementById('updateModal' + sec_id);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchSection();

        } else {
          alert(result.error_message || "Failed to update section.");
        }
      } catch (e) {
        console.error("Error while updating the section.", e);
      }
    },
  },
};


export default Section;