import React, { Component } from "react";
import "./index.css";
import { Row, Col, Alert } from "react-bootstrap";

import {
    ATECO_CODES,
    CITIES,
    validateNormal,
    validateVAT,
    validateEmail,
    validatePassword
} from "../../utils";

import * as Validate from "../../utils/Validate";

import MySelect from "../Custom/MySelect";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            atecoCodes: ATECO_CODES.slice(1),
            selectedCity: null,
            selectedCode: null,
            checkValidCity: false,
            checkValidCode: false,
            alertData: null
        };

        this.inputName = React.createRef();
        this.inputVAT = React.createRef();
        this.inputPEC = React.createRef();
        this.inputEmail = React.createRef();
        this.inputPassword = React.createRef();
        this.inputConfirm = React.createRef();
    }

    validateToInput = (input, code) => {
        if (code === Validate.VALID) {
            input.style.border = 0;
        } else {
            input.style.border = "1px solid red";
        }
    };

    setAlertData = (success, text) => {
        this.setState({
            alertData: {
                variant: success ? "success" : "danger",
                text: text
            }
        });
    };

    validateStepOne = () => {
        let valid = Validate.checkEmpty(this.inputName.current.value);
        this.validateToInput(this.inputName.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "Offical name" + valid.msg);
            return false;
        }

        if (!this.state.selectedCity) {
            this.setState({
                checkValidCity: true
            });
            this.setAlertData(0, "Please select a city");
            return false;
        }

        valid = Validate.checkVAT(this.inputVAT.current.value);
        this.validateToInput(this.inputVAT.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "VAT number" + valid.msg);
            return false;
        }

        if (!this.state.selectedCode) {
            this.setState({
                checkValidCode: true
            });
            this.setAlertData(0, "Please select an ATECO CODE");
            return false;
        }

        valid = Validate.checkEmpty(this.inputPEC.current.value);
        this.validateToInput(this.inputPEC.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "PEC" + valid.msg);
            return false;
        }

        return true;
    };

    validateStepTwo = () => {
        let valid = Validate.checkEmail(this.inputEmail.current.value);
        this.validateToInput(this.inputEmail.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "Email address" + valid.msg);
            return false;
        }

        valid = Validate.checkPassword(this.inputPassword.current.value);
        this.validateToInput(this.inputPassword.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "Password" + valid.msg);
            return false;
        }

        valid = Validate.checkConfirmPassword(
            this.inputPassword.current.value,
            this.inputConfirm.current.value
        );
        this.validateToInput(this.inputConfirm.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, valid.msg);
            return false;
        }

        this.setAlertData(1, "Registered successfully!");
        return true;
    };

    handleCityChange = selectedCity => {
        this.setState({ selectedCity });
    };

    handleCodeChange = selectedCode => {
        this.setState({ selectedCode });
    };

    handleClickNext = e => {
        e.preventDefault();
        this.setState({
            alertData: null
        });

        if (this.validateStepOne()) {
            this.setState({
                step: 2
            });

            this.inputEmail.current.style.border = 0;
            this.inputPassword.current.style.border = 0;
            this.inputConfirm.current.style.border = 0;
        }
    };

    handleClickBack = e => {
        e.preventDefault();
        this.setState({
            alertData: null,
            checkValidCity: false,
            checkValidCode: false
        });

        this.setState({
            step: 1
        });
    };

    handleClickDone = e => {
        e.preventDefault();
        if (this.validateStepTwo()) {
            window.location.href = "/";
        }
    };

    handleChangeInput = e => {
        if (e.target.value.trim().length) {
            e.target.style.border = 0;
        }
    };

    render() {
        const {
            step,
            atecoCodes,
            selectedCity,
            selectedCode,
            checkValidCity,
            checkValidCode,
            alertData
        } = this.state;

        const stepOne = (
            <div style={{ display: step === 2 ? "none" : "block" }}>
                <span className="title text-center">Step 1/2</span>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            type="text"
                            name="officialName"
                            placeholder="Official Name"
                            ref={this.inputName}
                            onChange={this.handleChangeInput.bind(this)}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <MySelect
                            value={selectedCity}
                            onChange={this.handleCityChange}
                            options={CITIES}
                            placeholder="City"
                            checkValid={checkValidCity}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            type="text"
                            name="vatNumber"
                            placeholder="VAT number"
                            ref={this.inputVAT}
                            onChange={this.handleChangeInput.bind(this)}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <MySelect
                            value={selectedCode}
                            onChange={this.handleCodeChange}
                            options={atecoCodes}
                            placeholder="ATECO CODE"
                            checkValid={checkValidCode}
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={{ span: 6, offset: 3 }}>
                        <input
                            type="text"
                            name="vatNumber"
                            placeholder="PEC"
                            ref={this.inputPEC}
                            onChange={this.handleChangeInput.bind(this)}
                        />
                    </Col>
                    <Col md={3} className="info-hint">
                        <i className="fa fa-info-circle pr-1" />
                        This inbox will be use only to certify the attendibility
                        of the user
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col sm={3} xs={12}>
                        <button
                            className="txt-upper w-100"
                            onClick={this.handleClickNext}
                        >
                            Next step
                        </button>
                    </Col>
                </Row>
            </div>
        );

        const stepTwo = (
            <div style={{ display: step === 1 ? "none" : "block" }}>
                <button className="back" onClick={this.handleClickBack}>
                    <i className="fa fa-angle-left" />
                </button>
                <span className="title text-center">Step 2/2</span>
                <Row className="mb-3">
                    <Col md={{ span: 6, offset: 3 }}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email address"
                            ref={this.inputEmail}
                        />
                    </Col>
                    <Col md={3} className="info-hint">
                        <i className="fa fa-info-circle pr-1" />
                        This inbox will be use to receive informations related
                        to the service
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            ref={this.inputPassword}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            ref={this.inputConfirm}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            id="rememberme"
                            type="checkbox"
                            name="remember-me"
                            className="input-checkbox"
                        />
                        <label className="label-checkbox" htmlFor="rememberme">
                            In order to continue, confirm to accept the Privacy
                            policy and Terms and conditions
                        </label>
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={5}>
                        <button
                            className="txt-upper w-100"
                            onClick={this.handleClickDone}
                        >
                            Complete registration
                        </button>
                    </Col>
                </Row>
                <div className="text-center mb-3">
                    After "Complete registration", you will receive a
                    confirmation message in your PEC inbox
                </div>
            </div>
        );

        return (
            <form className="my-form register-form">
                {alertData ? (
                    <Alert variant={alertData.variant}>{alertData.text}</Alert>
                ) : (
                    <div></div>
                )}

                {stepOne}
                {stepTwo}
            </form>
        );
    }
}
