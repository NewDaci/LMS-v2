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

         
         <div class="mt-5">
            <canvas id="enrollmentsChart" class="my-2" style="width: 100%; width: 600px; height: 250px;"></canvas>
            <canvas id="sectionsChart" class="mb-2" style="width: 100%; width: 750px; height: 200px;"></canvas>
            <canvas id="ratingsChart" class="mb-2" style="width: 100%; width: 700px; height: 200px;"></canvas>
        </div>
  </div>     
  `,
    data() {
        return {
            stats: [
                { title: 'Total Number of Books', value: 0, link: '/allbooks' },
                { title: 'Total Number of Users', value: 0, link: '/allusers' },
                { title: 'Total Number of Enrolled Books', value: 0, link: '/enrolls' },
                { title: 'Total Number of Returned Books', value: 0, link: '#' }
            ],
            sections: [],
            books: [],
            ratings: []
        };
    },
    mounted() {
        this.fetchAdminDashboard();
    },

    methods: {

        async fetchAdminDashboard() {
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
                    this.renderCharts();

                } else {
                    console.error("Failed to fetch dashboard data");
                }
            } catch (e) {
                console.error("Error while fetching dashboard data", e);
            }
        },
        renderCharts() {
            const whiteBackgroundPlugin = {
                id: 'whiteBackground',
                beforeDraw: (chart) => {
                    const ctx = chart.canvas.getContext('2d');
                    ctx.save();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, chart.width, chart.height);
                    ctx.restore();
                }
            };

            // Enrollments Chart
            const enrollmentsCtx = document.getElementById('enrollmentsChart').getContext('2d');
            new Chart(enrollmentsCtx, {
                type: 'bar',
                data: {
                    labels: this.books.map(book => book.name),
                    datasets: [{
                        label: 'Books vs Enrollments',
                        data: this.books.map(book => book.enrollments),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(54, 162, 135)',
                            'rgb(54, 162, 35)',
                            'rgb(255, 205, 86)'
                        ],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { beginAtZero: true },
                        y: { beginAtZero: true }
                    }
                },
                plugins: [whiteBackgroundPlugin]
            });

            // Sections Chart
            const sectionsCtx = document.getElementById('sectionsChart').getContext('2d');
            new Chart(sectionsCtx, {
                type: 'bar',
                data: {
                    labels: this.sections.map(sec => sec.name),
                    datasets: [{
                        label: 'Books per Section',
                        data: this.sections.map(sec => sec.book_count),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                        ],
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { beginAtZero: true },
                        y: { beginAtZero: true }
                    }
                },
                plugins: [whiteBackgroundPlugin]

            });

            // Ratings Chart
            const ratingsCtx = document.getElementById('ratingsChart').getContext('2d');
            new Chart(ratingsCtx, {
                type: 'bar',
                data: {
                    labels: this.ratings.map(rate => rate.name),
                    datasets: [{
                        label: 'Ratings',
                        data: this.ratings.map(rate => rate.rating),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                        ],
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { beginAtZero: true },
                        y: { beginAtZero: true }
                    }
                },
                plugins: [whiteBackgroundPlugin]

            });

        },
    },
};


export default AdminDashboard;