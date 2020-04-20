import React, { Component } from "react";
import "./index.css";
import { stringWithUnitFromNumber } from "../../utils";
import { LangConsumer } from "../../utils/LanguageContext";
import { STRINGS } from "../../utils/strings";
import CompanyReadMore from "../CompanyReadMore";

export default class CompanyCell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showReadMore: false,
        };

        this.spanDistance = React.createRef();
        this.spanISO = React.createRef();
        this.spanAddress = React.createRef();
    }

    componentDidMount = () => {
        let distanceWidth = this.spanDistance.current.offsetWidth + 2;
        if (this.spanDistance.current.offsetWidth > this.spanISO.current.offsetWidth) {
            this.spanISO.current.style.width = distanceWidth + "px";
        }
        if (this.spanISO.current.offsetWidth > this.spanDistance.current.offsetWidth) {
            distanceWidth = this.spanISO.current.offsetWidth + 2;
            this.spanDistance.current.style.width = distanceWidth + "px";
        }
        this.spanAddress.current.style.width = `calc(100% - ${distanceWidth}px)`;
    };

    handleClickReadMore = () => {};

    handleClickClose = () => {
        this.setState({ showReadMore: false });
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
                    <div className="d-flex">
                        <span className="address" ref={this.spanAddress}>
                            <i className="fa fa-map-marker" />
                            {company.companyAddress && company.companyAddress.length ? company.companyAddress : company.city + "," + company.region}
                        </span>
                        <span ref={this.spanDistance} className="distance">
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
                        {company.id ? (
                            <button className="text-uppercase" onClick={handleClickProfile}>
                                {STRINGS.profile}
                            </button>
                        ) : (
                            <button className="text-uppercase read-more" onClick={() => this.setState({ showReadMore: true })}>
                                {STRINGS.readMore}
                            </button>
                        )}
                    </div>
                </div>
                {this.state.showReadMore && <CompanyReadMore company={company} onClose={this.handleClickClose} />}
            </div>
        );
    }
}
