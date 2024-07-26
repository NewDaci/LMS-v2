const AdminDashboard = {
    template: `
   <div class="container-fluid min-vh-100">
    <div class="d-flex mt-3">
      <div>
        <h1> Statistics! </h1>
      </div>
    </div>
        <div class="row mt-1">
            <div class="col-md-3" v-for="stat in stats" :key="stat.title">
                <div class="card text-center">
                    <div class="card-body">
                        <h4 class="card-title text-muted">{{ stat.title }}</h4>
                        <h1 class="card-subtitle mb-2">{{ stat.value }}</h1>
                        <router-link :to="stat.link" class="card-link link-underline-light">View More</router-link>
                    </div>
                </div>
        </div>
    </div>
  </div>     
  `,
    data() {
        return {
            stats: [
                { title: 'Total Number of Books', value: 0, link: '/all-books' },
                { title: 'Total Number of Users', value: 0, link: '/users' },
                { title: 'Total Number of Enrolled Books', value: 0, link: '/enrollments' },
                { title: 'Total Number of Returned Books', value: 0, link: '#' }
            ],
            sections: [],
            books: [],
            ratings: []
        };
    },
    async mounted() {
        const url = "http://localhost:5000/api/admin/dashboard";
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            });

            if (res.ok) {
                const data = await res.json();
                this.stats[0].value = data.num_books;
                this.stats[1].value = data.num_users;
                this.stats[2].value = data.num_enrollments;
                this.stats[3].value = data.num_returned_books;

                this.sections = data.sections;
                this.books = data.books;
                this.ratings = data.ratings;
            } else {
                console.error("Failed to fetch dashboard data");
            }
        } catch (e) {
            console.error("Error while fetching dashboard data", e);
        }
    },
};


export default AdminDashboard;