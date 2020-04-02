import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginPage from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/Landing";
import RegisterPage from "./pages/Register";
import TermsAndConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/Policy";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import CompanyDetail from "./pages/CompanyDetail";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";

export default class App extends Component {
    state = {
        special: false,
        headerTransparent: true,
        headerAutoHide: true,
        loading: false
    };

    componentDidMount = () => {
        if (window.location.pathname.search("/company/") !== -1) {
            this.setState({ headerAutoHide: false });
        }
        if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register" ||
            window.location.pathname === "/forgot-password"
        ) {
            this.setState({ special: true });
        }
    };

    render() {
        const { special, headerTransparent, headerAutoHide } = this.state;

        return (
            <div>
                <BrowserRouter>
                    <Header
                        needSearchBar={special ? false : true}
                        isTransparent={headerTransparent}
                        autoHide={headerAutoHide}
                    />
                    <div className="body">
                        <Switch>
                            <Route exact path="/" component={LandingPage} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route
                                exact
                                path="/register"
                                component={RegisterPage}
                            />
                            <Route
                                path="/forgot-password"
                                component={ForgotPasswordPage}
                            />
                            <Route
                                path="/reset-password/:id"
                                component={ResetPasswordPage}
                            />
                            <Route
                                exact
                                path="/terms"
                                component={TermsAndConditions}
                            />
                            <Route
                                exact
                                path="/policy"
                                component={PrivacyPolicy}
                            />
                            <Route
                                exact
                                path="/dashboard"
                                component={Dashboard}
                            />
                            <Route
                                exact
                                path="/company/:id"
                                component={CompanyDetail}
                            />
                            <Route
                                exact
                                path="/user-edit"
                                component={Profile}
                            />
                            <Route component={Error404} />
                        </Switch>
                    </div>
                    {!special ? <Footer /> : <div />}
                </BrowserRouter>
            </div>
        );
    }
}

// function App() {
// 	let special = false;
// 	let headerTransparent = true;
// 	let headerAutoHide = true;

// 	// if (window.location.pathname === "/") {
// 	//     headerTransparent = true;
// 	// }
// 	if (window.location.pathname.search("/company/") !== -1) {
// 		headerAutoHide = false;
// 	}
// 	if (
// 		window.location.pathname === "/login" ||
// 		window.location.pathname === "/register" ||
// 		window.location.pathname === "/forgot-password"
// 	) {
// 		special = true;
// 	}

// 	let loading = false;
// 	// function storageHandler() {
// 	// 	loading = sessionStorage.getItem("loading");
// 	// 	console.log(loading);
// 	// }

// 	window.onstorage = () => {
// 		// When local storage changes, dump the list to
// 		// the console.
// 		console.log(window.localStorage.getItem("loading"));
// 	};

// 	return (
// 		<BrowserRouter>
// 			<Header
// 				needSearchBar={special ? false : true}
// 				isTransparent={headerTransparent}
// 				autoHide={headerAutoHide}
// 			/>
// 			<div className="body">
// 				<Switch>
// 					<Route exact path="/" component={LandingPage} />
// 					<Route exact path="/login" component={LoginPage} />
// 					<Route exact path="/register" component={RegisterPage} />
// 					<Route
// 						path="/forgot-password"
// 						component={ForgotPasswordPage}
// 					/>
// 					<Route
// 						path="/reset-password/:id"
// 						component={ResetPasswordPage}
// 					/>
// 					<Route exact path="/terms" component={TermsAndConditions} />
// 					<Route exact path="/policy" component={PrivacyPolicy} />
// 					<Route exact path="/dashboard" component={Dashboard} />
// 					<Route
// 						exact
// 						path="/company/:id"
// 						component={CompanyDetail}
// 					/>
// 					<Route exact path="/user-edit" component={Profile} />
// 					<Route component={Except} />
// 				</Switch>
// 			</div>
// 			{!special ? <Footer /> : <div />}
// 			{loading === 1 && <SpinnerView />}
// 		</BrowserRouter>
// 	);
// }
//
// export default App;
