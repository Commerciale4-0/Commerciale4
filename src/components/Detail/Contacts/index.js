import React, { Component } from "react";
import "./index.css";
import { LangConsumer } from "../../../utils/LanguageContext";
import { STRINGS } from "../../../utils/strings";

export default class DetailContacts extends Component {
    render() {
        const { profile } = this.props;
        return (
            <div className="detail-contacts">
                <div className="top-info">
                    <div className="pb-2">
                        <span className="pr-3">
                            <b>{STRINGS.iso}</b>
                        </span>

                        {profile &&
                            profile.user.iso &&
                            profile.user.iso.map((item, index) => (
                                <span key={index} className="pr-3" style={{ textDecoration: "underline" }}>
                                    {item}
                                </span>
                            ))}
                    </div>
                    <div className="d-flex mb-2">
                        <i className="fa fa-tags font-18 pr-4 mt-2" />
                        <div>
                            <LangConsumer>
                                {(value) =>
                                    value.lang === "en"
                                        ? profile &&
                                          profile.user.tags &&
                                          profile.user.tags.map((tag, index) => (
                                              <span className="tag" key={index}>
                                                  {tag}
                                              </span>
                                          ))
                                        : profile &&
                                          profile.user.tagsIt &&
                                          profile.user.tagsIt.map((tagIt, index) => (
                                              <span className="tag" key={index}>
                                                  {tagIt}
                                              </span>
                                          ))
                                }
                            </LangConsumer>
                        </div>
                    </div>
                </div>
                <hr />
                <h5 className="pt-4 text-dark-light text-uppercase text-center">{STRINGS.contacts}</h5>
                <div className="contact-info">
                    <div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">{STRINGS.address} : </label>
                            <span className="info">{profile && profile.user.companyAddress}</span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">{STRINGS.phone} : </label>
                            <span className="info">{profile && profile.user.companyPhone}</span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">{STRINGS.website} : </label>
                            <span className="info">
                                <a href={profile && profile.user.website} className="text-primary" target="blank">
                                    {profile && profile.user.website}
                                </a>
                            </span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">{STRINGS.email} : </label>
                            <span className="info">{profile && profile.user.companyEmail}</span>
                        </div>
                        <div className="d-flex align-items-center py-2">
                            <label className="text-dark-light">{STRINGS.secondEmail} : </label>
                            <span className="info">{profile && profile.user.company2ndEmail}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
