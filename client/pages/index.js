import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

// getInitialProps() executes on the server side on the first load which fetches data once on the server side and pass them to the page components.
// When making axios must provide a domain name in the url, otherwise it will make the axios call inside the container/Pod
// Server side axios not carry cookie back to the browser

LandingPage.getInitialProps = async ({ req }) => {
  // console.log(req.headers);

  if (typeof window === 'undefined') {
    // we are on the server side! requests should be made with domain name
    const url =
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser';

    const { data } = await axios
      .get(url, {
        // passing req.headers to make the request
        headers: req.headers,
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log('server side current user:', data);
    return data;
  } else {
    // we are on the browser! requests can be made without url domain name
    const { data } = await axios.get('/api/users/currentuser').catch((err) => {
      console.log(err.message);
    });
    console.log('client side current user:', data);
    return data;
  }
  return {};
};


export default LandingPage;
