const NewTicket = () => {
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form>
        <div class="mb-3">
          <label for="Title" class="form-label">
            Title
          </label>
          <input
            type="text"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label for="Price" class="form-label">
            Price
          </label>
          <input
            type="text"
            class="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
