import React from 'react';
import ReactDOM from 'react-dom';
// import { createBrowserHistory } from 'history';
import Loadable from 'react-loadable';
// prettier-ignore
import {
  BrowserRouter,
  withRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';
// import { Button } from 'mt-strap';
// import Button from 'mt-strap/lib/es/Button/Button';
// import '../static/sass/style.scss';
// import Home from './containers/Home';

// const Loading = () => {
//   return <span>Loading...</span>;
// };

// const Contact = Loadable({
//   loader: () => import('./containers/Contact'),
//   loading: Loading
// });

// const Listing = Loadable({
//   loader: () => import('./containers/Listing'),
//   loading: Loading
// });

class App extends React.Component {
  render() {
    // console.log(typeof process.env.REACT_APP_PATH_URL);
    return (
      <React.Fragment>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/listing">Listing</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        {/*<Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/listing" component={Listing} />
        </Switch>*/}
      </React.Fragment>
    );
  }
}
// prettier-ignore
ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
