const NotFound = {
  template: `
  <div class='vh-100'>
             
             <div class="div container vh-100">
                <div class="jumbotron mt-5">
                    <h1 class="display-4 fw-bold">404 - Not Found!</h1>
                    <p class="lead">Sorry, the page you are looking for could not be found.</p>
                    <hr class="my-4">
                    <p class="lead">
                        <router-link class="btn btn-primary btn-lg" to="/">Go Home</router-link>
                    </p>
                </div>
            </div>
  </div>     
  `,
  data() {
    return {
      
    };
  },
};
      
      
export default NotFound;