import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Landing from "./Landing";
import Register from './Register';
import Login from './Login';
import './App.css';
import React from "react";
import Navbar from '../components/Navbar';
import { connect } from "react-redux";
import { selectToken, selectRole,selectCheckout } from "../reducers";

class App extends React.Component {
  render() {
    return (
    <BrowserRouter>
    <React.Fragment>
    <Navbar />
      <Switch>
      <Route exact path="/" component={Landing}/>
       {/* TokenLess route */}
       <Route exact path="/login">
            {this.props.token ? (this.props.checkout ? <Redirect to="/checkout/123" /> : <Redirect to="/product" /> ) : <Login/>}
          </Route>
          <Route exact path="/signup">
            {this.props.token ? <Redirect to="/product" /> : <Register/>}
          </Route>
      </Switch>
    </React.Fragment>
    </BrowserRouter>
  );
}
}

const mapStateToProps = (state, ownprops) => ({
  role: selectRole(state),
  token: selectToken(state),
  checkout:selectCheckout(state)
})


export default connect(mapStateToProps)(App);