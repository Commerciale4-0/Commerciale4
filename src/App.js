import React from "react";
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

function App() {
    let footerNeeded = false;
    if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register" ||
        window.location.pathname === "/forgot-password"
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
                    <Route
                        path="/forgot-password"
                        component={ForgotPasswordPage}
                    />
                    <Route
                        path="/reset-password"
                        component={ResetPasswordPage}
                    />
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
