import React, { Component } from "react";
import "./index.css";

export default class DetailContacts extends Component {
    render() {
        const { company } = this.props;
        return (
            <div className="detail-contacts">
                <h5 className="my-4 text-dark-light text-uppercase text-center">
                    Contacts
                </h5>
                <div className="d-flex justify-content-around">
                    <div>
                        <div className="d-flex">
                            <label className="text-dark-light">
                                Address :{" "}
                            </label>
                            <p>Industry street, LA, USA</p>
                        </div>
                        <div className="d-flex">
                            <label className="text-dark-light">Phone : </label>
                            <p>+1 95955985</p>
                        </div>
                        <div className="d-flex">
                            <label className="text-dark-light">
                                Website :{" "}
                            </label>
                            <p>
                                <a href="/">www.starkind.com</a>
                            </p>
                        </div>
                        <div className="d-flex">
                            <label className="text-dark-light">Email : </label>
                            <p>{company.email}</p>
                        </div>
                        <div className="d-flex">
                            <label className="text-dark-light">
                                2nd Email :{" "}
                            </label>
                            <p>asdscacs@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
