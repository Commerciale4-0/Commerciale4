import React, { Component } from "react";
import "./index.css";
import { stringWithUnitFromNumber } from "../../utils";
import { LangConsumer } from "../../utils/LanguageContext";
import { STRINGS } from "../../utils/strings";

export default class CompanyCell extends Component {
    constructor(props) {
        super(props);

        this.spanDistance = React.createRef();
        this.spanISO = React.createRef();
    }

    componentDidMount = () => {
        if (this.spanDistance.current.offsetWidth > this.spanISO.current.offsetWidth) {
            this.spanISO.current.style.width = this.spanDistance.current.offsetWidth + "px";
        }
        if (this.spanISO.current.offsetWidth > this.spanDistance.current.offsetWidth) {
            this.spanDistance.current.style.width = this.spanISO.current.offsetWidth + "px";
        }
    };

    getInstructonText = (intro) => {
        if (!intro) {
            return "";
        }

        let limit = this.props.viewMode ? 180 : 90;
        if (intro.length < limit) {
            return intro;
        }
        return intro.substr(0, limit) + "...";
    };

    render() {
        const { company, viewMode, handleClickProfile } = this.props;

        return (
            <div className={`company-cell row ${viewMode ? "list" : "grid"}`}>
                <div className={`logo col-xl-2 col-3`}>
                    <img src={company.logo ? process.env.REACT_APP_AWS_PREFIX + company.logo : "images/no-logo.jpg"} alt="" />
                </div>
                <div className="col-9 title pl-2">{company.officialName}</div>
                <div className={`${viewMode ? "col-xl-10 col-md-9" : "col-md-12"} col-12 content`}>
                    <h5>{company.officialName}</h5>
                    <div className="d-flex justify-content-between">
                        <span>
                            <i className="fa fa-map-marker" />
                            {company.city}, {company.region}
                        </span>
                        <span ref={this.spanDistance}>
                            <i className="fa fa-map-signs" />
                            {company.distance ? `${company.distance} km` : "---"}
                        </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        {/* <div className="col-xl-10 col-12 px-0 py-1">
							<div className="row px-0"> */}
                        <span>
                            <i className="fa fa-line-chart" />
                            {stringWithUnitFromNumber(company.revenues)}
                        </span>
                        <span>
                            <i className="fa fa-users" />
                            {stringWithUnitFromNumber(company.employees)}
                        </span>
                        <span ref={this.spanISO}>
                            {STRINGS.iso}: {company.iso && company.iso[0]}
                        </span>
                        {/* </div>
						</div> */}
                    </div>
                    <hr />
                    <div className="d-flex">
                        <i className="fa fa-id-card-o pt-1" />
                        <div className="intro">
                            <LangConsumer>
                                {(value) =>
                                    value.lang === "en"
                                        ? company.introduction
                                            ? company.introduction
                                            : company.introductionIt
                                        : company.introductionIt
                                        ? company.introductionIt
                                        : company.introduction
                                }
                            </LangConsumer>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex">
                        <span>
                            <i className="fa fa-tags" />
                        </span>

                        <div className="tags">
                            <LangConsumer>
                                {(value) =>
                                    value.lang === "en"
                                        ? company.tags && company.tags.map((tag, index) => <span key={index}>{tag}</span>)
                                        : company.tagsIt && company.tagsIt.map((tagIt, index) => <span key={index}>{tagIt}</span>)
                                }
                            </LangConsumer>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-2">
                        <button className="text-uppercase text-bold" onClick={handleClickProfile}>
                            {STRINGS.profile}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
