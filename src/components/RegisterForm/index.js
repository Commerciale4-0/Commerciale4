import React, { Component } from "react";
import "./index.css";
import { Row, Col } from "react-bootstrap";

import { ATECO_CODES, CITIES } from "../../utils";
import MySelect from "../Custom/MySelect";

export default class RegisterForm extends Component {
    state = {
        step: 1,
        atecoCodes: ATECO_CODES.slice(1),
        selectedCity: null,
        selectedCode: null
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
            step: 2
        });
    };

    handleClickBack = e => {
        e.preventDefault();

        this.setState({
            step: 1
        });
    };

    render() {
        const { step, atecoCodes, selectedCity, selectedCode } = this.state;

        const stepOne = (
            <div>
                <span className="title text-center">Step 1/2</span>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            type="text"
                            name="officialName"
                            placeholder="Official Name"
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
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input
                            type="text"
                            name="vatNumber"
                            placeholder="VAT number"
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
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={{ span: 6, offset: 3 }}>
                        <input type="text" name="vatNumber" placeholder="PEC" />
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
            <div>
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
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col md={6}>
                        <input type="password" placeholder="Confirm" />
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
                        <button className="txt-upper w-100">
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
                {step === 1 ? stepOne : stepTwo}
            </form>
        );
    }
}
