
const AllBooks = {
  template: `
    <div class="container-fluid min-vh-100">
      <div class="mt-2">
        <div class="me-auto d-flex justify-content-between align-items-center mb-3">
        
        <h1 class="fw-bold text-uppercase text-decoration-underline">All Books</h1>
        <a data-bs-toggle="modal" data-bs-target="#addModal" class="btn btn-warning">Add New Book</a>

        <!-- addbook start here -->

                <!-- Update -->
              <!-- Update Modal -->
              <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="addModalLabel">Add Book</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="addBook">
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
                          <input type="text" class="form-control" v-model="newbook['sections.name']">
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
                          <button type="submit" class="btn btn-warning">Add</button>
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
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">ISBN No</th>
              <th scope="col">Book Name</th>
              <th scope="col">Author</th>
              <th scope="col">Section</th>
              <th scope="col">Language</th>
              <th scope="col">Date Added</th>
              <th scope="col">Rating</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in datas" :key="book.id">
              <th scope="row">{{ book.id }}</th>
              <td>{{ book.isbn }}</td>
              <td>{{ book.name }}</td>
              <td>{{ book.author_name }}</td>
              <td>{{ book['sections.name'] }}</td>
              <td>{{ book.language }}</td>
              <td>{{ book.date_added }}</td>
              <td>
                <span v-for="star in book.rating">⭐</span>
              </td>
              <td>

                <!-- View -->

                <router-link class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + book.id" to="/view">View</router-link>

                <!-- Modal -->
                <div class="modal fade" :id="'exampleModal' + book.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ book.name }}</h1>
                        <button type="button" class="btn btn-secondary me-2 ms-auto" data-bs-dismiss="modal">Close</button>
                      </div>
                      <div class="modal-body" id="book-content">
                        {{ book.content }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Modal end -->
                <!-- View end here -->

              <!-- Update start here -->

              <button class="btn btn-success" data-bs-toggle="modal" :data-bs-target="'#updateModal' + book.id">Update</button>

                <!-- Modal -->
                <!-- Update -->
              <!-- Update Modal -->
              <div class="modal fade" :id="'updateModal' + book.id" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="updateModalLabel">Update Book</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="updateBook(book.id)">
                      <div class="mb-3">
                          <label for="book-isbn" class="col-form-label">ISBN No.:</label>
                          <input type="number" class="form-control" v-model="book.isbn">
                        </div>
                        <div class="mb-3">
                          <label for="book-name" class="col-form-label">Book Name:</label>
                          <input type="text" class="form-control" v-model="book.name">
                        </div>
                        <div class="mb-3">
                          <label for="book-author" class="col-form-label">Author:</label>
                          <input type="text" class="form-control" v-model="book.author_name">
                        </div>
                        <div class="mb-3">
                          <label for="book-section" class="col-form-label">Section:</label>
                          <input type="text" class="form-control" v-model="book['sections.name']">
                        </div>
                        <div class="mb-3">
                          <label for="book-language" class="col-form-label">Language:</label>
                          <input type="text" class="form-control" v-model="book.language">
                        </div>
                        <div class="mb-3">
                          <label for="book-content" class="col-form-label">Content:</label>
                          <textarea class="form-control" cols="12" rows="10" v-model="book.content"></textarea>
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
                <!-- Modal end -->

                <!-- Update end here -->
                 <button class="btn btn-danger" data-bs-toggle="modal" :data-bs-target="'#deleteModal'+book.id">Delete</button>
                    <div class="modal fade" :id="'deleteModal'+book.id" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="deleteModalLabel">Delete Book</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Are you sure you want to DELETE this book?
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button @click="deletebook(book.id)" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        </div>
                        </div>
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
      newbook: {
        "isbn": "23",
        "name": "as",
        "author_name": "sa",
        "language": "Hindi",
        "sections.name": "General",
        "content": "sd",
      },
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/book", {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token,
            },
          });
          const result = await response.json()
          if (response.ok) {
            this.datas = result.books;
          } else {
            console.error("Error while fetching")
          }
        } else {
          alert("LogIn as Admin to Proceed.")
        }
      } catch (e) {
        console.error("Error while fetching", e);
      }
    },
    async updateBook(bookId) {
      const token = localStorage.getItem("access_token");
      const book = this.datas.find(book => book.id === bookId);
      const url = `http://localhost:5000/api/book/${bookId}`;
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify(book),
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully updated the book.");
          const modal = document.getElementById('updateModal' + bookId);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchBooks();

        } else {
          alert(result.error_message || "Failed to update the book.");
        }
      } catch (e) {
        console.error("Error while updating the book.", e);
      }
    },

    async deletebook(book_id) {

      const token = localStorage.getItem("access_token");
      const url = `http://localhost:5000/api/book/${book_id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Successfully DELETED the book.");
          const modal = document.getElementById('deleteModal' + book_id);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchBooks();

        } else {
          alert(result.error_message || "Failed to delete the book.");
        }
      } catch (e) {
        console.error("Error while deleting the book.", e);
      }
    },

    async addBook() {
      const token = localStorage.getItem("access_token");
      const book = this.newbook;
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
          const modal = document.getElementById('addModal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.fetchBooks();

        } else {
          alert(result.error_message || "Failed to Add the book.");
        }
      } catch (e) {
        console.error("Error while Adding the book.", e);
      }
    },
  },
};

export default AllBooks;
