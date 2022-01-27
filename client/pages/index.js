import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h1>Landing Page {currentUser.email}</h1>;
};

// getInitialProps() executes on the server side on the first load which fetches data once on the server side and pass them to the page components.
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
