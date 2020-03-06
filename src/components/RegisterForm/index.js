import React, { Component } from "react";
import "./index.css";
import Select from "react-select";
import { Row, Col } from "react-bootstrap";

import { ATECO_CODES, CITIES } from "../../utils";

export default class RegisterForm extends Component {
    state = {
        step: 1,
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
        const { step, selectedCity, selectedCode } = this.state;

        const stepOne = (
            <div>
                <span className="title text-center">Step 1</span>
                <div>
                    <span className="label">Official name</span>
                    <input type="text" name="officialName" />
                </div>
                <div className="mt-3">
                    <span className="label">City</span>
                    <Select
                        value={selectedCity}
                        onChange={this.handleCityChange}
                        options={CITIES}
                        placeholder="Select a City"
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "var(--colorPrimary)"
                            }
                        })}
                    />
                </div>
                <div className="mt-3">
                    <span className="label">Vat number</span>
                    <input type="text" name="vatNumber" />
                </div>
                <div className="mt-3">
                    <span className="label">Ateco code</span>
                    <Select
                        value={selectedCode}
                        onChange={this.handleCodeChange}
                        options={ATECO_CODES}
                        placeholder="Select a code"
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "var(--colorPrimary)"
                            }
                        })}
                    />
                </div>
                <div className="mt-3">
                    <span className="label">pec</span>
                    <input type="text" name="vatNumber" />
                </div>
                <Row className="mt-3 justify-content-end">
                    <Col sm={4} xs={12}>
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
                <span className="title text-center">Step 2</span>
                <div>
                    <span className="label">Email</span>
                    <input type="text" name="email" />
                </div>
                <div className="mt-3">
                    <span className="label">Password</span>
                    <input type="password" name="password" />
                </div>
                <div className="mt-3">
                    <span className="label">Confirm</span>
                    <input type="password" />
                </div>
                <div className="mt-3">
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
                </div>
                <div className="mt-3 d-flex">
                    <button className="txt-upper w-100">
                        Complete registration
                    </button>
                </div>
                <div className="mt-3 d-flex">
                    <label style={{ fontSize: 13 }}>
                        After "Complete registration", you will receive a
                        confirmation message in your PEC inbox
                    </label>
                </div>
            </div>
        );

        return <form className="form">{step === 1 ? stepOne : stepTwo}</form>;
    }
}
