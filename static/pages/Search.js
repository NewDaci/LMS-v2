
const Search = {
  template: `
    <div class="container min-vh-100">

    <div class="mt-4 mb-3">
      <h1>Search related to "{{ searchResults.search_query }}"</h1>
    </div>

    <!-- Grid system for vertical alignment -->
    <div class="row">
      <!-- Books section -->
      <div class="col-md-3">
        <h2 class="text-decoration-underline">Books</h2>
        <ul class="list-unstyled">
          <li v-for="book in searchResults.book_searched" :key="book.id">
            <h4>
              <a data-bs-toggle="modal" :data-bs-target="'#exampleModal' + book.id" class="link">{{ book.name }}</a>
            </h4>
            <ul>
              <li>Written by - {{ book.author_name }}</li>
              <li>Language - {{ book.language }}</li>
              <li>Ratings - <span v-for="star in book.rating">⭐</span></li>
            </ul>

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
          </li>
        </ul>
      </div>

      <!-- Sections section -->
      <div class="col-md-3">
        <h2 class="text-decoration-underline">Sections</h2>
        <ul class="list-unstyled">
          <li v-for="section in searchResults.section_searched" :key="section.id">
            <h4><a @click="viewBooks(section.id)" class="link">{{ section.name }}</a></h4>
          </li>
        </ul>

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
                        <button class="btn btn-primary" @click="toast(book.id)">Request</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Authors section -->
      <div class="col-md-3">
        <h2 class="text-decoration-underline">Authors</h2>
        <ul class="list-unstyled">
          <li v-for="author in searchResults.author_searched" :key="author.id">
            <h4><a @click="authorBooks(author.author_name)" class="link">{{ author.author_name }}</a></h4>
          </li>
        </ul>

        <!-- Modal -->
        <div class="modal fade" id="authorModal" tabindex="-1" aria-labelledby="booksModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="booksModalLabel">Books by Author</h1>
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
                        <button class="btn btn-primary" @click="toast(book.id)">Request</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
       <!-- Languages section -->
      <div class="col-md-3">
        <h2 class="text-decoration-underline">Languages</h2>
        <ul class="list-unstyled">
          <li v-for="language in searchResults.language_searched" :key="language.id">
            <h4><a @click="viewBooksByLanguage(language.language)" class="link">{{ language.name }}</a></h4>
          </li>
        </ul>

        <!-- Modal -->
        <div class="modal fade" id="languageModal" tabindex="-1" aria-labelledby="languageModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="languageModalLabel">Books by Language</h1>
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
                        <button class="btn btn-primary" @click="toast(book.id)">Request</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
      books: [],
    };
  },

  computed: {
    searchResults() {
      return this.$store.state.searchResults;
    },
  },

  methods: {
    async viewBooksByLanguage(language){
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:5000/api/section/language/${language}`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          this.books = result;
          const modal = new bootstrap.Modal(document.getElementById('languageModal'));
          modal.show();
        } else {
          console.error("Error while fetching books");
        }
      } catch (e) {
        console.error("Error while fetching books", e);
      }
    },
    async authorBooks(author) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:5000/api/section/${author}`, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          this.books = result;
          const modal = new bootstrap.Modal(document.getElementById('authorModal'));
          modal.show();
        } else {
          console.error("Error while fetching books");
        }
      } catch (e) {
        console.error("Error while fetching books", e);
      }
    },

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
        if (response.ok) {
          alert(result.message)
        } else {
          alert(result.error)
        }
      } catch (e) {
        console.error("Couldn't request the book.", e);
      }
    },
  },
};


export default Search;