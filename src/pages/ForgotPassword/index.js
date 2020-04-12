import React, { Component } from "react";
import "./index.css";
import * as Validate from "../../utils/Validate";
import { Alert } from "react-bootstrap";
import { requestAPI } from "../../utils/api";
import { STRINGS } from "../../utils/strings";

export default class ForgotPasswordPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alertData: null,
        };

        this.refEmail = React.createRef();
    }

    handleClickDone(e) {
        let valid = Validate.checkEmail(this.refEmail.current.value);
        Validate.applyToInput(this.refEmail.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setState({
                alertData: {
                    variant: "danger",
                    text: STRINGS.emailAddress + valid.msg,
                },
            });
            return false;
        }

        requestAPI("/user/forgot-password", "POST", {
            email: this.refEmail.current.value,
        }).then((res) => {
            if (res.status !== 1) {
                this.setState({
                    alertData: { variant: "danger", text: res.message },
                });
            } else {
                this.setState({
                    alertData: { variant: "success", text: res.message },
                });
            }
        });
    }

    render() {
        return (
            <div className="forgot-password">
                {this.state.alertData ? <Alert variant={this.state.alertData.variant}>{this.state.alertData.text}</Alert> : <div></div>}
                <div className="text-center">
                    <i className="fa fa-lock" />
                </div>
                <div className="title text-center">{STRINGS.forgotPassword}</div>
                <div className="text">{STRINGS.forgotPasswordMsg}</div>
                <div className="my-3 d-flex justify-content-center">
                    <input type="text" name="email" placeholder="Email" ref={this.refEmail} />
                </div>
                <div className="d-flex justify-content-center">
                    <button onClick={this.handleClickDone.bind(this)}>{STRINGS.sendEmail}</button>
                </div>
            </div>
        );
    }
}
