import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
import Except from "./pages/Except";
import { LangProvider } from "./utils/LanguageContext";
import { STRINGS } from "./utils/strings";

class App extends Component {
    state = {
        headerTransparent: false,
        headerAutoHide: true,
        selectedLang: sessionStorage.getItem("lang"),
        needSearchBar: true,
        needFooter: true,
    };

    componentWillMount = () => {
        if (window.location.pathname === "/") {
            this.setState({ headerTransparent: true });
        }
        if (window.location.pathname.search("/company/") !== -1) {
            this.setState({ headerAutoHide: false, needFooter: false });
        }
        if (window.location.pathname === "/user-edit") {
            this.setState({ needFooter: false });
        }
        if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register" ||
            window.location.pathname === "/forgot-password"
        ) {
            this.setState({ needSearchBar: false, needFooter: false, headerTransparent: true });
        }

        this.setLocalization();
    };

    setLocalization() {
        let lang = sessionStorage.getItem("lang");
        if (!lang) {
            sessionStorage.setItem("lang", "en");
        }
        STRINGS.setLanguage(lang ? lang : "en");
    }
    selectLang = (lang) => {
        this.setState({
            selectedLang: lang,
        });
        sessionStorage.setItem("lang", lang);
        this.setLocalization();
    };

    render() {
        const { headerTransparent, headerAutoHide, selectedLang, needSearchBar, needFooter } = this.state;

        return (
            <div>
                <LangProvider value={{ lang: selectedLang }}>
                    <Router>
                        <Header
                            needSearchBar={needSearchBar}
                            isTransparent={headerTransparent}
                            autoHide={headerAutoHide}
                            onSelectedLang={this.selectLang}
                        />
                        <div className="body">
                            <Switch>
                                <Route exact path="/" component={LandingPage} />
                                <Route exact path="/login" component={LoginPage} />
                                <Route exact path="/register" component={RegisterPage} />
                                <Route path="/forgot-password" component={ForgotPasswordPage} />
                                <Route path="/reset-password/:id" component={ResetPasswordPage} />
                                <Route exact path="/terms" component={TermsAndConditions} />
                                <Route exact path="/policy" component={PrivacyPolicy} />
                                <Route exact path="/dashboard" component={Dashboard} />
                                <Route exact path="/company/:id" component={CompanyDetail} />
                                <Route exact path="/user-edit" component={Profile} />
                                {/* <Route component={Except} /> */}
                            </Switch>
                        </div>
                        {needFooter && <Footer />}
                    </Router>
                </LangProvider>
            </div>
        );
    }
}
export default App;
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
