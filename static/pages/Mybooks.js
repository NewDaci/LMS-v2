
const Mybooks = {
  template: `
  <div class='vh-100'>
    <div class="container mt-4">
    <h1 class="fw-bold text-uppercase text-decoration-underline">My Books</h1>
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
        <tr v-for="(enroll, index) in validBooks" :key="enroll.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ enroll.id }}</td>
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
                        <div class="modal-body" id="book-content">
                          {{ enroll.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Modal end -->


          <!-- here comes the return modals -->

          <!--This will trigger the feedback modal (2nd modal)  -->
                    <div class="modal fade" :id="'feedback' + enroll.id" tabindex="-1"
                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">How was the book?</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                        <div class="modal-body">
                                            Drop ur feedback on this book.
                                            <textarea v-model="feedback" cols="40" rows="10"></textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <button @click="returnbook(enroll.enroll_id, enroll.id)" class="btn btn-success">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--  return book BOOTSTRAP MODAL (1st modal) -->
                    <div class="modal fade" :id="'return' + enroll.id" tabindex="-1"
                        aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Completed this book?</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label for="recipient-name" class="col-form-label">Finished Reading this Book?
                                            Mark it as completed?</label>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                                            :data-bs-target="'#feedback' + enroll.id" data-bs-whatever="@mdo" @click="setReadValue('No')">No</button>

                                        <button type="button" class="btn btn-success" data-bs-toggle="modal"
                                            :data-bs-target="'#feedback' + enroll.id " data-bs-whatever="@mdo" @click="setReadValue('Yes')">Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-danger ms-2" data-bs-toggle="modal"
                        :data-bs-target="'#return' + enroll.id" data-bs-whatever="@mdo">Return</button>


          <!-- here it ends the return modals -->
            </div>
          </td>
        </tr>
      </tbody>
    </table> 
  </div>     

     <div v-if="revokedBooks.length > 0" class="container mt-4">
      <h1 class="fw-bold text-uppercase text-decoration-underline">Revoked Books</h1>
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
          <tr v-for="(enroll, index) in revokedBooks" :key="enroll.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ enroll.id }}</td>
            <td>{{ enroll.name }}</td>
            <td>{{ enroll.author_name }}</td>
            <td>{{ enroll.issue_date }}</td>
            <td>{{ enroll.return_date }}</td>
            <td>
              <button class="btn btn-warning" @click="reissue(enroll.enroll_id)">Re-Issue</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

     <div v-if="completedBooks.length > 0" class="container mt-4">
      <h1 class="fw-bold text-uppercase text-decoration-underline">Completed Books</h1>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Book ID</th>
            <th scope="col">Book Name</th>
            <th scope="col">Author</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in completedBooks" :key="book.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ book.id }}</td>
            <td>{{ book.name }}</td>
            <td>{{ book.author_name }}</td>
            <td>
              <a @click="downPDF(book.content, book.name)" class="btn btn-success">Download</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>     
  </div>     
  `,
  data() {
    return {
      validBooks: [],
      revokedBooks: [],
      completedBooks: [],
      currDate: '',
      feedback: "",
      readValue: "",
    };
  },
  mounted() {
    this.fetchMyBooks();
  },

  methods: {
    setReadValue(value) {
      this.readValue = value;
    },

    async fetchMyBooks() {
      this.feedback = "";
      const token = localStorage.getItem("access_token");
      if (token) {
        const url = "http://localhost:5000/api/my-book";
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              "Authorization": "Bearer" + " " + token,
            },
          });
          if (res.ok) {
            const data = await res.json();
            this.validBooks = data.valid_books;
            this.revokedBooks = data.revoked_books;
            this.completedBooks = data.completed_books;
            this.currDate = data.curr_date;
          } else {
            // 
          }
        } catch (e) {
          console.error("error while fetching", e)
        }
      }
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
            const modal = document.getElementById('feedback' + book_id);
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            this.fetchMyBooks();
          } else {
            alert(res.error);
          }
        } catch (e) {
          console.error("Error while RETURING book", e)
        }
      }
    },

    async reissue(enroll_id) {
      const token = localStorage.getItem("access_token");
      if (token) {
        const url = "http://localhost:5000/api/re-issue";
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer" + " " + token,
            },
            body: JSON.stringify({
              enroll_id: enroll_id
            })
          });
          if (res.ok) {
            const data = await res.json();
            alert(data.msg);
            this.fetchMyBooks();
          } else {
            alert(res.error);
          }
        } catch (e) {
          console.error("Error while re-issuing book", e)
        }
      }
    },

    downPDF(content, name) {
      var doc = new jsPDF()

      doc.text(content, 10, 10)
      doc.save(name+'.pdf')
    },
  },
};


export default Mybooks;