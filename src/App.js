import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
	return (
		<div>
			<Header />
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/register" component={RegisterPage} />
				</Switch>
			</BrowserRouter>
			<Footer />
		</div>
	);
}

export default App;
