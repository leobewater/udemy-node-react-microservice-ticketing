// This is default page layout
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

// getInitialProps() executes on the server side on the first load which fetches data once on the server side and pass them to the page components.
AppComponent.getInitialProps = async (appContext) => {
  // console.log(appContext);

  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // also run any page/child component.getInitialProps() 
  // and passing client and data.currentUser to the child component
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  // console.log(pageProps);
  // console.log(data);

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
