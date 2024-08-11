const Explore = {
  template: `
      <div class="container-fluid min-vh-100">
        <div class="mt-2">
          <h1 class="fw-bold text-uppercase text-decoration-underline">All Books</h1>
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
                   <!-- view -->
                  <router-link class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + book.id" to="/view">View</router-link>

                  <!-- rate -->
                  <!-- Button trigger modal -->
                    <button type="button" class="btn btn-success" data-bs-toggle="modal" :data-bs-target="'#rateModal' + book.id">
                      Rate
                    </button>

                    <!-- Modal -->
                    <div class="modal fade" :id="'rateModal' + book.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Loved This Book?</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body align-items-center justify-content-center d-flex">
                             <div class="star-rating">
                                <span
                                  v-for="n in 5"
                                  :key="n"
                                  class="star"
                                  :style="{ color: n <= currentRating ? 'gold' : 'lightgray' }"
                                  @click="selectRating(n)"
                                  >&#9733;</span>
                              </div>
                            </div>
                            <div class="modal-footer">
                            <button @click='book_rating(book.id)' class="btn btn-success">Submit</button>
                          </div>
                        </div>
                      </div>
                    </div>
  
                  <!-- Modal -->
                  <div class="modal fade" :id="'exampleModal' + book.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ book.name }}</h1>
                          <button type="button" class="btn btn-secondary me-2 ms-auto" data-bs-dismiss="modal">Close</button>

                          <button type="button" class="btn btn-primary" @click="toast(book.id)">Request this book</button>
                        </div>
                        <div class="modal-body" id="book-content">
                          {{ book.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Modal end -->
  
                  <!-- Toast start -->
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
                  <!-- Toast end -->
  
                  <button :class="book.requested ? 'btn btn-danger' : 'btn btn-warning'" @click="toggleRequest(book)">
                    {{ book.requested ? 'Cancel' : 'Request' }}
                  </button>
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
      currentRating: 0
    };
  },
  mounted() {
    this.get_explore();
  },
  methods: {

    selectRating(rating) {
      this.currentRating = rating;
    },

    async get_explore() {
      this.currentRating = 0;
      const url = "http://localhost:5000/api/book";
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        if (res.ok) {
          const data = await res.json();
          this.datas = data.books.map(book => ({ ...book, requested: false }));
        }
      } catch (e) {
        console.error("Couldn't fetch data from the server.", e);
      }
    },

    async book_rating(book_id) {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://localhost:5000/api/rating', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            book_id: book_id,
            rating: this.currentRating
          })
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          const modal = document.getElementById('rateModal' + book_id);
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          this.get_explore();
        } else {
          alert(result.error || 'Failed to submit rating.');
        }
      } catch (e) {
        console.error("Couldn't submit the rating.", e);
      }
    },

    async toggleRequest(book) {
      if (book.requested) {
        const token = localStorage.getItem('access_token');
        const url = 'http://localhost:5000/api/issue-book';
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              book_id: book.id
            })
          });
          const result = await response.json();
          const toastLiveExample = document.getElementById('liveToast-' + book.id);
          if (toastLiveExample) {
            const toastBody = toastLiveExample.querySelector('.toast-body');
            if (response.ok) {
              toastBody.textContent = result.message;
              toastLiveExample.classList.remove('text-bg-danger');
              toastLiveExample.classList.add('text-bg-warning');
            }
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
          }
        } catch (e) {
          console.error("Couldn't cancel the requested book.", e);
        }
      } else {
        this.toast(book.id);
      }
      book.requested = !book.requested;
    },

    async toast(bookId) {
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
    },
  },
};

export default Explore;
