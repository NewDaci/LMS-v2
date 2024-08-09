
const Download = {
  template: `
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card p-4 bg-light" style="width: 100%; max-width: 500px;">
      <h2 class="card-title text-center mb-4">Purchase Book</h2>
      <form>
        <div class="mb-3">
          <p class="mb-1">Please Select Pricing:</p>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="one_month" name="pricing" value="500">
            <label class="form-check-label" for="one_month">₹ 500 For 1 month</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="three_months" name="pricing" value="1000">
            <label class="form-check-label" for="three_months">₹ 1000 For 3 months</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="six_months" name="pricing" value="2000">
            <label class="form-check-label" for="six_months">₹ 2000 For 6 months</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="lifetime" name="pricing" value="5000">
            <label class="form-check-label" for="lifetime">₹ 5000 For Lifetime</label>
          </div>
        </div>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" placeholder="Enter your username">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" placeholder="Enter your email">
        </div>
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-primary" @click="downPDF(content, name)">Purchase</button>
        </div>
      </form>
    </div>
  </div>
  `,
  data() {
    return {};
  },
  props: ['content', 'name'],
  methods: {
    downPDF(content, name) {
      var doc = new jsPDF();
      doc.text(content, 10, 10);
      doc.save(name + '.pdf');
      alert("Thank you for your purchase!");
      this.$router.push("/mybooks");
    }
  }
};

export default Download;
