import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  // console.log(tickets);

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <h5>Showing New/Unreserved Tickets</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// if _app.js has .getInitialProps(), this.getInitialProps won't be running by default
// add condition in _app.js .getInitialProps() in order to run page component .getInitialProps()
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // get all tickets
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
