const Home = {
    template: `
      <div class="d-flex" style="height: 900px;">
        <div class="jumbotron text-center my-auto mx-auto">
          <div class="container">
            <h1 class="display-4 fw-bold">Welcome to City Library!</h1>
            <p class="lead">Your gateway to a world of knowledge and information. Explore our vast collection of books, journals, and digital resources.</p>
            <hr class="my-4">
            <p>Our library offers a serene and conducive environment for reading, research, and learning. Join us and become part of our vibrant community.</p>
            <p>Whether you are a student, a researcher, or simply a book lover, we have something for everyone.</p>
            <p class="lead">
              <router-link class="btn btn-secondary btn-lg" to="/dashboard" role="button">Explore Catalog</router-link>
            </p>
          </div>
        </div>
      </div>
    `,
};

export default Home;
