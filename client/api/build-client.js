import axios from 'axios';

// axios wrapper for both client and server side
// When making axios must provide a domain name in the url, otherwise it will make the axios call inside the container/Pod
// Server side axios not carry cookie back to the browser, passing req.headers on the server side will carry cookie over

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server side! requests should be made with domain name
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // we are on the browser! requests can be made without url domain name
    return axios.create({
      baseURL: '/',
    });
  }
  return {};
};
