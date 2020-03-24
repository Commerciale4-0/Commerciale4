import React, { Component } from "react";
import "./index.css";
import * as Validate from "../../utils/Validate";
import { Alert } from "react-bootstrap";
import { requestAPI } from "../../utils/api";

export default class ResetPasswordPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSuccess: false,
            alertText: null
        };

        this.inputPassword = React.createRef();
        this.inputConfirm = React.createRef();
    }

    handleClickSave(e) {
        let valid = Validate.checkPassword(this.inputPassword.current.value);
        Validate.applyToInput(this.inputPassword.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setState({
                alertText: "Password" + valid.msg
            });
            return;
        }

        valid = Validate.checkConfirmPassword(
            this.inputPassword.current.value,
            this.inputConfirm.current.value
        );

        Validate.applyToInput(this.inputConfirm.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setState({
                alertText: valid.msg
            });
            return;
        }

        const query = new URLSearchParams(window.location.search);
        let _id = query.get("id");

        requestAPI("/user/reset-password", "POST", {
            password: this.inputPassword.current.value,
            userId: _id
        }).then(res => {
            console.log(res);
            this.setState({
                isSuccess: true,
                alertText: "Password has just been reseted "
            });
            setTimeout(function() {
                window.location.href = "/";
            }, 1000);
        });
    }

    render() {
        const { isSuccess, alertText } = this.state;
        const successDiv = (
            <div>
                <Alert variant="success">{alertText}</Alert>
            </div>
        );
        const failDiv = (
            <div>
                {alertText ? (
                    <Alert variant="danger">{alertText}</Alert>
                ) : (
                    <div></div>
                )}
                <div>
                    <div className="text-center">
                        <i className="fa fa-lock" />
                    </div>
                    <div className="title text-center">Reset your password</div>
                    <div className="text">
                        You can create your password here.
                    </div>
                    <div className="my-3 d-flex justify-content-center">
                        <input
                            type="password"
                            placeholder="New password"
                            ref={this.inputPassword}
                        />
                    </div>
                    <div className="my-3 d-flex justify-content-center">
                        <input
                            type="password"
                            placeholder="Confirm password"
                            ref={this.inputConfirm}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button onClick={this.handleClickSave.bind(this)}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
        console.log(alertText);
        return (
            <div className="reset-password">
                {isSuccess ? successDiv : failDiv}
            </div>
        );
    }
}
