const Category = {
    template: `
      <div>
        <div class="me-auto d-flex justify-content-between align-items-center mb-2">
          <h1 class="fw-bold text-uppercase text-decoration-underline mt-3">Sections</h1>
        </div>
  
        <div class="min-vh-100">
          <div class="row g-3 mt-3 m-0 col-12">
            <div v-for="(s, index) in sec" :key="s.id" class="col-4">
              <div class="container">
                <div class="card border-5 rounded-4 shadow" style="height: 200px;">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                      <a>
                        <h1 class="fw-bold text-uppercase">{{ s.name }}</h1>
                      </a>
                      <h5>{{ s.description }}</h5>
                      <p>Date added: {{ s.date_created }}</p>
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                      <button class="btn btn-primary me-2" @click="viewBooks(s.id)">View Books</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Modal -->
        <div class="modal fade" id="booksModal" tabindex="-1" aria-labelledby="booksModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="booksModalLabel">Books in Section</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
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
                    <tr v-for="book in books" :key="book.id">
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
                        <button class="btn btn-primary" @click="requestBook(book.id)">Request</button>
                        <div class="toast-container position-fixed bottom-0 end-0 p-3">
                          <div :id="'liveToast-' + book.id" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                              <strong class="me-auto">Book Request</strong>
                              <small>Sent</small>
                              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                              Book has been requested successfully.
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal end -->
      </div>
    `,
    data() {
      return {
        sec: [],
        books: []
      };
    },
    async mounted() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/section", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          this.sec = result;
        } else {
          console.error("Error while fetching");
        }
      } catch (e) {
        console.error("Error while fetching", e);
      }
    },
    methods: {
      async viewBooks(sectionId) {
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(`http://localhost:5000/api/section/${sectionId}`, {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token,
            },
          });
          const result = await response.json();
          if (response.ok) {
            this.books = result; 
            const modal = new bootstrap.Modal(document.getElementById('booksModal'));
            modal.show(); 
          } else {
            console.error("Error while fetching books");
          }
        } catch (e) {
          console.error("Error while fetching books", e);
        }
      },
      async requestBook(bookId) {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error("JWT token not found");
          return;
        }
  
        try {
          const response = await fetch('http://localhost:5000/api/issue-book', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              book_id: bookId,
              req_days: 7
            })
          });
  
          const result = await response.json();
          const toastLiveExample = document.getElementById('liveToast-' + bookId);
          if (toastLiveExample) {
            const toastBody = toastLiveExample.querySelector('.toast-body');
            if (response.ok) {
              toastBody.textContent = result.message || 'Book has been requested successfully.';
              toastLiveExample.classList.remove('text-bg-danger');
              toastLiveExample.classList.add('text-bg-primary');
            } else {
              toastBody.textContent = result.error || 'Failed to request the book.';
              toastLiveExample.classList.remove('text-bg-primary');
              toastLiveExample.classList.add('text-bg-danger');
            }
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
          }
        } catch (e) {
          console.error("Couldn't request the book.", e);
        }
      }
    }
  };
  
  export default Category;
  