const Dashboard = {
  template: `
  <div class="container-fluid">
    <!-- Latest Books Section -->
    <div class="row mt-3">
      <div class="col-md-12">
        <h1 class="fw-bold text-uppercase">Latest</h1>
      </div>
      <div v-for="data in latest" :key="data.id" class="col-md-2 mb-3">
        <div class="card border-3 rounded-2 shadow" style="width: 100%;">
          <img :src="'static/img/book' + (data.id > 11 ? 2 : data.id) + '.jpeg'" class="card-img-top book-image" alt="book image">
          <div class="card-body" style="height: 170px; overflow: hidden;">
            <h5 class="card-title fw-bold" style="text-align: center;">{{ truncateText(data.name) }}</h5>
            <p class="card-text" style="text-align: center;">{{ data.author_name }}</p>
            <router-link class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + data.id" to="/view">View</router-link>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModal' + data.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ data.name }}</h1>
                    <button type="button" class="btn btn-secondary me-2 ms-auto" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="toast(data.id)">Request this book</button>
                  </div>
                  <div class="modal-body" id="book-content">
                    {{ data.content }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal end -->

            <!-- Toast start -->
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
              <div :id="'liveToast-' + data.id" class="toast text-bg-primary" role="alert" aria-live="assertive" aria-atomic="true">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Trending Books Section -->
    <div class="row mt-3">
      <div class="col-md-12">
        <h1 class="fw-bold text-uppercase">Trending</h1>
      </div>
      <div v-for="data in trend" :key="data.id" class="col-md-2 mb-3">
        <div class="card border-3 rounded-2 shadow" style="width: 100%;">
          <img :src="'static/img/book' + (data.id > 11 ? 4 : data.id) + '.jpeg'" class="card-img-top book-image" alt="book image">
          <div class="card-body" style="height: 170px; overflow: hidden;">
            <h5 class="card-title fw-bold" style="text-align: center;">{{ truncateText(data.name) }}</h5>
            <p class="card-text" style="text-align: center;">{{ data.author_name }}</p>
            <router-link class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + data.id" to="/view">View</router-link>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModal' + data.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ data.name }}</h1>
                    <button type="button" class="btn btn-secondary me-2 ms-auto" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="toast(data.id)">Request this book</button>
                  </div>
                  <div class="modal-body" id="book-content">
                    {{ data.content }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal end -->

            <!-- Toast start -->
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
              <div :id="'liveToast-' + data.id" class="toast text-bg-primary" role="alert" aria-live="assertive" aria-atomic="true">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Bookshelf Section -->
    <div class="row mt-3">
      <div class="col-md-12">
        <h1 class="fw-bold text-uppercase">On Bookshelf</h1>
      </div>
      <div v-for="data in books" :key="data.id" class="col-md-2 mb-3">
        <div class="card border-3 rounded-2 shadow" style="width: 100%;">
          <img :src="'static/img/book' + (data.id > 11 ? 4 : data.id) + '.jpeg'" class="card-img-top book-image" alt="book image">
          <div class="card-body" style="height: 170px; overflow: hidden;">
            <h5 class="card-title fw-bold" style="text-align: center;">{{ truncateText(data.name) }}</h5>
            <p class="card-text" style="text-align: center;">{{ data.author_name }}</p>
            <router-link class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal' + data.id" to="/view">View</router-link>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModal' + data.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">{{ data.name }}</h1>
                    <button type="button" class="btn btn-secondary me-2 ms-auto" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="toast(data.id)">Request this book</button>
                  </div>
                  <div class="modal-body" id="book-content">
                    {{ data.content }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal end -->

           <!-- Toast start -->
          <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div :id="'liveToast-' + data.id" class="toast text-bg-primary" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header">
                <strong class="me-auto">Book Request</strong>
                <small>Sent</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div class="toast-body">
              </div>
            </div>
          </div>
          <!-- Toast end -->
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      books: [],
      latest: [],
      trend: [],
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:5000/api/book", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });
      const data = await response.json()
      if (response.ok) {
        this.books = data.books;
        this.latest = data.latest;
        this.trend = data.trend;
      } else {
        console.error("Error while fetching")
      }
    } catch (e) {
      console.error("Couldn't fetch data from the server.", e);
    }
  },
  methods: {
    truncateText(text) {
      return text.length > 28 ? text.substring(0, 28) + "..." : text;
    },

    async toast(bookId) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("JWT token not found");
        alert("You are not logged IN..");
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

export default Dashboard;
