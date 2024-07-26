const Requests = {
    template: `
      <div class="container-fluid vh-100">
        <div class="mt-2">
          <h1 class="fw-bold text-uppercase text-decoration-underline">Requests</h1>
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th scope="col">Request ID</th>
                <th scope="col">User ID</th>
                <th scope="col">User Name</th>
                <th scope="col">Book ID</th>
                <th scope="col">Book Name</th>
                <th scope="col">Days Requested</th>
                <th scope="col">Issue Date</th>
                <th scope="col">Return Date</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="request in all_requests" :key="request.id">
                <th scope="row">{{request.id}}</th>
                <td>{{request.user_id}}</td>
                <td>{{request.user_name}}</td>
                <td>{{request.book_id}}</td>
                <td>{{request.book_name}}</td>
                <td>{{request.req_days}}</td>
                <td>{{request.issue_date}}</td>
                <td>{{request.return_date}}</td>
                <td>
                    <button @click="approve(request.id)" class="btn btn-primary">Approve</button>
                    <button @click="reject(request.id)" class="btn btn-danger">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>    
  `,
    data() {
        return {
            all_requests: []
        };
    },
    mounted() {
        this.fetchRequest();
    },
    methods:{
        async fetchRequest(){
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:5000/api/admin/requests", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                });
                const result = await response.json()
                if (response.ok) {
                    this.all_requests = result;
                } else {
                    console.error("Error while fetching")
                }
            } catch (e) {
                console.error("Error while fetching", e);
            }
        },

        async approve(request_id){
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:5000/api/admin/requests", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token,
                    },
                    body: JSON.stringify({
                        req_id : request_id
                    })
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
        async reject(request_id){
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:5000/api/admin/requests", {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token,
                    },
                    body: JSON.stringify({
                        req_id : request_id
                    })
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
        }
    },
};


export default Requests;