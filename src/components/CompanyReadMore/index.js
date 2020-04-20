import React, { Component } from "react";
import "./index.css";
import { STRINGS } from "../../utils/strings";

export default class CompanyReadMore extends Component {
    render() {
        const { company, onClose } = this.props;
        let lang = sessionStorage.getItem("lang");
        lang = lang ? lang : "en";
        return (
            <div className="company-read-more">
                <div className="-content">
                    <button className="secondary round no-min" onClick={onClose}>
                        <i className="fa fa-close pr-0" />
                    </button>
                    <h4 style={{ paddingRight: 32 }}>{company.officialName}</h4>
                    <div className="py-2 font-16" style={{ fontWeight: 500 }}>
                        <i className="fa fa-map-marker pr-2" /> {company.companyAddress}
                    </div>
                    <div className="py-2 font-15">
                        <b>{STRINGS.ateco}:</b> {company.ateco}
                    </div>
                    <div className="py-2 font-15">
                        {lang === "en"
                            ? company.introduction
                                ? company.introduction
                                : company.introductionIt
                            : company.introductionIt
                            ? company.introductionIt
                            : company.introduction}
                    </div>
                </div>
            </div>
        );
    }
}
