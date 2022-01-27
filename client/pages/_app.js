// This is default page layout
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

// const LandingPage = ({ currentUser }) => {
//   return <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>;
// };

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <h1>Header!</h1>
      <Component {...pageProps} />
    </div>
  );
};

// getInitialProps() executes on the server side on the first load which fetches data once on the server side and pass them to the page components.
AppComponent.getInitialProps = async (appContext) => {
  // console.log(appContext);
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // also run any page component.getInitialProps()
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  // console.log(pageProps);
  // console.log(data);

  return data;
};

export default AppComponent;
