const Enrolls = {
    template: `
      <div class="container-fluid min-vh-100">
        <div class="mt-2">
           
        <div class="me-auto d-flex justify-content-between align-items-center mb-3">
            <h1 class="fw-bold text-uppercase text-decoration-underline">Enrollments</h1>
            <a @click='autorevoke' class="btn btn-danger">Auto Revoke</a>
        </div>
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th scope="col">Enrollment ID</th>
                <th scope="col">User ID</th>
                <th scope="col">User Name</th>
                <th scope="col">Book ID</th>
                <th scope="col">Book Name</th>
                <th scope="col">Issued Date</th>
                <th scope="col">Returning Date</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="enroll in enrolls" :key="enroll.id">
                <th scope="row">{{enroll.id}}</th>
                <td>{{enroll.user_id}}</td>
                <td>{{enroll.user_name}}</td>
                <td>{{enroll.book_id}}</td>
                <td>{{enroll.book_name}}</td>
                <td>{{enroll.issue_date}}</td>
                <td>{{enroll.return_date}}</td>
                <td>
                    <button @click="revoke(enroll.id)" class="btn btn-danger">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>    
  `,
    data() {
        return {
            enrolls: []
        };
    },
    mounted() {
        this.fetchRequest();
    },
    methods:{
        async fetchRequest(){
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:5000/api/admin/revoke", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                });
                const result = await response.json()
                if (response.ok) {
                    this.enrolls = result;
                } else {
                    console.error("Error while fetching")
                }
            } catch (e) {
                console.error("Error while fetching", e);
            }
        },

        async revoke(enroll_id){
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(`http://localhost:5000/api/admin/revoke/${enroll_id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token,
                    },
                });
                const result = await response.json()
                if (response.ok) {
                    alert(result.msg)
                    this.fetchRequest();
                } else {
                    console.error("Error while fetching")
                }
            } catch (e) {
                console.error("Error while fetching", e);
            }
        },

        async autorevoke(){
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(`http://localhost:5000/api/admin/auto-revoke`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token,
                    },
                });
                const result = await response.json()
                if (response.ok) {
                    alert(result.msg)
                    this.fetchRequest();
                } else {
                    console.error("Error while fetching")
                }
            } catch (e) {
                console.error("Error while fetching", e);
            }
        },
    },
};


export default Enrolls;