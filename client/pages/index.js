import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>;
};

// if _app.js has .getInitialProps(), this.getInitialProps won't be running by default
// add condition in _app.js .getInitialProps() in order to run page component .getInitialProps()
LandingPage.getInitialProps = async (context) => {
  console.log('landing page!');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
