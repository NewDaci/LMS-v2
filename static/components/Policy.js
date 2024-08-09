const Policy = {
  template: `
  <div class='vh-100'>
             
             
<div class="min-vh-100 ms-5">
    <div class="mt-4 mb-3">
        <h1 class="fw-bold text-decoration-underline fst-italic mb-5 bg-info">CityLibrary POLICIES*</h1>
    </div>

    <ul>
        <ul>
            <div class="align-items-center">
                <li class="mb-5">
                    <h3 class="bg-warning">Borrowing Policy:</h3>
                    <ol>
                        <h5> Eligibility:
                            Only registered members of the library are eligible to issue books.
                            Membership is open to all type of Students, General Users upon successful registration.
                        </h5>
                    </ol>
                </li>

                <li class="mb-5">
                    <h3 class="bg-warning">Issuing Periods:</h3>
                    <ol>
                        <h5>
                            Books: One week
                        </h5>
                    </ol>

                    <ol>
                        <h5>
                            Limits:
                            Each User may have a maximum of 15 Books enrolled at any given time.
                            There may be restrictions on the number of books from specific collections.
                        </h5>
                    </ol>
                </li>
                <li class="mb-5">
                    <h3 class="bg-warning">Requesting Rules:</h3>
                    <ol>
                        <h5>
                            Request: Can't request for more than 5 books at once.
                        </h5>
                    </ol>
                    <ol>
                        <h5>
                            Rejection: Continuously requesting for the same book and returning will be rejected. And can
                            lead to deletion of memebership permanently!
                        </h5>
                    </ol>
                    <ol>
                        <h5>
                            Rejection: Librarian may reject book for bad users.
                        </h5>
                    </ol>

                </li>
                <li class="mb-5">
                    <h3 class="bg-warning">Re-Issue Rules:</h3>
                    <ol>
                        <h5>
                            User can request for re-issue of book once their returing date has passed.
                        </h5>
                    </ol>
                    <ol>
                        <h5>
                            Re-Issue Rejection: Librarian may reject the request for re-issue if returing date has
                            exceeded for too long (1month).
                        </h5>
                    </ol>
                </li>
                    <li class="mb-5 text-decoration-underline bg-danger">
                        <h3>Not complying to any of the rules or policy can lead to REMOVAL of MEMBERSHIP or Deletion of
                            Account permanently.</h3>
                    </li>
            </div>
        </ul>
    </ul>

</div>

             
  </div>     
  `,
  data() {
    return {
      
    };
  },
};
      
      
export default Policy;