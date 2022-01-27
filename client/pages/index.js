const LandingPage = ({ color }) => {
  console.log("im in the component", color);
  return <h1>Landing Page</h1>;
};

// fetch data once on the server side and pass them to the page components
LandingPage.getInitialProps = () => {
  console.log('Im on the server!');

  return { color: 'red' };
};

export default LandingPage;
