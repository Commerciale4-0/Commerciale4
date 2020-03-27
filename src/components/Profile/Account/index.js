import React, { Component } from "react";
import "./index.css";

export default class ProfileAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 0
        };
    }
    handleClickChangeEmail = e => {};
    handleClickChangePassword = e => {};
    handleClickDelete = e => {};

    render() {
        const { selectedTab } = this.state;

        const actionsPanel = (
            <div>
                <div>
                    <h6 className="text-uppercase p-3">Change password</h6>
                    <div className="info-row">
                        <input type="password" placeholder="Old password" />
                    </div>
                    <div className="info-row">
                        <input type="password" placeholder="New password" />
                    </div>
                    <div className="info-row">
                        <input type="password" placeholder="Confirm password" />
                    </div>
                    <div className="info-row my-4">
                        <button
                            style={{
                                minWidth: 180
                            }}
                            onClick={this.handleClickChangePassword}
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
                <hr />
                <div>
                    <h6 className="text-uppercase p-3">Change Account email</h6>
                    <div className="info-row">
                        <input placeholder="New email" />
                    </div>
                    <div className="info-row">
                        <input placeholder="Confirm email" />
                    </div>
                    <div className="info-row">
                        <input type="password" placeholder="Insert password" />
                    </div>
                    <div className="info-row my-4">
                        <button
                            style={{
                                minWidth: 180
                            }}
                            onClick={this.handleClickChangeEmail}
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
                <hr />
                <div>
                    <h6 className="text-uppercase p-3">Delete Profile</h6>
                    <div className="info-row px-5 text-secondary pb-3">
                        Clicking the DELETE button, your profile won't be
                        displayed anymore. Commerciale4.0, as interms and
                        condition, will be saving the informations for internal
                        use.
                    </div>
                    <div className="info-row">
                        <button
                            style={{
                                minWidth: 180,
                                background: "#d33"
                            }}
                            onClick={this.handleClickDelete}
                        >
                            DELETE PROFILE
                        </button>
                    </div>
                </div>
            </div>
        );

        const infoPanel = (
            <div className="my-4">
                <h6 className="text-center mb-4">
                    The displayed info are not editable
                </h6>
                <div className="info-row">
                    <span>Official name:</span>
                    <input disabled />
                </div>
                <div className="info-row">
                    <span>City:</span>
                    <input disabled />
                </div>
                <div className="info-row">
                    <span>VAT number:</span>
                    <input disabled />
                </div>
                <div className="info-row">
                    <span>NACE code:</span>
                    <input disabled />
                </div>
                <div className="info-row">
                    <span>PEC:</span>
                    <input disabled />
                </div>
            </div>
        );
        return (
            <div className="account-view">
                <div className="tab-header">
                    <button
                        className={`tab-item ${
                            selectedTab === 0 ? "active" : ""
                        }`}
                        onClick={() =>
                            this.setState({
                                selectedTab: 0
                            })
                        }
                    >
                        Actions
                    </button>
                    <button
                        className={`tab-item ${
                            selectedTab === 1 ? "active" : ""
                        }`}
                        onClick={() =>
                            this.setState({
                                selectedTab: 1
                            })
                        }
                    >
                        Info
                    </button>
                </div>
                <div className="tab-body">
                    {selectedTab === 0 ? actionsPanel : infoPanel}
                </div>
            </div>
        );
    }
}
