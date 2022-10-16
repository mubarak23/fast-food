import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import { BrowserRouter, Route,Redirect, Switch } from 'react-router-dom';
import Landing from "./Landing";
import './App.css';
import React from "react";

function App() {
  return (
    <BrowserRouter>
    <React.Fragment>
      <Switch>
      <Route exact path="/" component={Landing}/>
      </Switch>
    </React.Fragment>
    </BrowserRouter>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
