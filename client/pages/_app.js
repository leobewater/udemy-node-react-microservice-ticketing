// load css for all pages
import 'bootstrap/dist/css/bootstrap.css';

// wrapper for component
const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
