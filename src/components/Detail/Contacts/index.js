import React, { Component } from "react";
import "./index.css";

export default class DetailContacts extends Component {
    render() {
        const { profile } = this.props;
        return (
            <div className="detail-contacts">
                <div className="top-info">
                    <div className="pb-2">
                        <span className="pr-3">
                            <b>ISO</b>
                        </span>
                        {profile &&
                            profile.user.iso.map((item, index) => (
                                <span key={index} className="pr-3" style={{ textDecoration: "underline" }}>
                                    {item}
                                </span>
                            ))}
                    </div>
                    <div className="d-flex mb-2">
                        <i className="fa fa-tags font-18 pr-4 mt-1" />
                        <div>
                            {profile &&
                                profile.user.tags &&
                                profile.user.tags.map((tag, index) => (
                                    <span className="tag" key={index}>
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
                <hr />
                <h5 className="mt-5 mb-3 text-dark-light text-uppercase">Contacts</h5>
                <div className="contact-info">
                    <div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">Address : </label>
                            <span className="info" className="info">
                                {profile && profile.user.companyAddress}
                            </span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">Phone : </label>
                            <span className="info">{profile && profile.user.companyPhone}</span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">Website : </label>
                            <span className="info">
                                <a href={profile && profile.user.website} className="text-primary" target="blank">
                                    {profile && profile.user.website}
                                </a>
                            </span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">Email : </label>
                            <span className="info">{profile && profile.user.companyEmail}</span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">2nd Email : </label>
                            <span className="info">{profile && profile.user.company2ndEmail}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
