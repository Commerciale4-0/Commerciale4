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
import TermsAndConditions from "./pages/TermsPage";
import PrivacyPolicy from "./pages/PolicyPage";
import Dashboard from "./pages/DashboardPage";

function App() {
    let footerNeeded = false;
    if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register"
    ) {
        footerNeeded = true;
    }
    return (
        <BrowserRouter>
            <Header />
            <div className="body">
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/terms" component={TermsAndConditions} />
                    <Route exact path="/policy" component={PrivacyPolicy} />
                    <Route exact path="/dashboard" component={Dashboard} />
                </Switch>
            </div>
            {!footerNeeded ? <Footer /> : ""}
        </BrowserRouter>
    );
}

export default App;
