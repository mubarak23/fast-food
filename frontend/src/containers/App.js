import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Landing from "./Landing";
import Register from './Register';
import Login from './Login';
import './App.css';
import React from "react";
import Navbar from '../components/Navbar';
import { connect } from "react-redux";
import Product from '../containers/Product'
import AddProduct from "../components/Product/add"
import SingleProduct from "../components/Product"
import Shipping from '../components/Cart/single';
import PlaceOrder from '../components/Cart/order'
import SingleOrder from '../components/Order/index'
import Profile from "./Profile"
import Cart from "./Cart"
import Order from "./Order"
import NotFound  from '../components/NotFound';
import { selectToken, selectRole,selectCheckout } from "../reducers";
import { ADMIN } from "../constants"

class App extends React.Component {
  render() {
    return (
    <BrowserRouter>
    <React.Fragment>
    <Navbar />
      <Switch>
      <Route exact path="/" component={Landing}/>
      <Route exact path="/product" component={Product}/>
      <Route exact path="/product/add" >
          {this.props.token && this.props.role === ADMIN ? <AddProduct /> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/product/:id" component={SingleProduct}/>
      <Route exact path="/checkout" component={Cart}/>
       {/* TokenLess route */}
       <Route exact path="/login">
            {this.props.token ? (this.props.checkout ? <Redirect to="/checkout/123" /> : <Redirect to="/product" /> ) : <Login/>}
          </Route>
          <Route exact path="/signup">
            {this.props.token ? <Redirect to="/product" /> : <Register/>}
          </Route>
          <Route exact path="/checkout/:id" component={Shipping}/>
          <Route exact path="/placeorder" component={PlaceOrder}/>
          <Route exact path="/order/:id" component={SingleOrder}/>
          <Route exact path="/orders" component={Order}/>

          {this.props.token && <Route exact path="/profile" component={Profile}/>}
          <Route component={NotFound} />
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