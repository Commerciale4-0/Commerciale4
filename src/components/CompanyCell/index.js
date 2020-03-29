import React, { Component } from "react";
import "./index.css";

export default class CompanyCell extends Component {
    constructor(props) {
        super(props);

        this.spanDistance = React.createRef();
        this.spanISO = React.createRef();
    }

    componentDidMount = () => {
        if (
            this.spanDistance.current.offsetWidth >
            this.spanISO.current.offsetWidth
        ) {
            this.spanISO.current.style.width =
                this.spanDistance.current.offsetWidth + "px";
        }
        if (
            this.spanISO.current.offsetWidth >
            this.spanDistance.current.offsetWidth
        ) {
            this.spanDistance.current.style.width =
                this.spanISO.current.offsetWidth + "px";
        }
    };

    render() {
        const { company, viewMode, handleClickProfile } = this.props;

        return (
            <div className={`company-cell row ${viewMode ? "list" : "grid"}`}>
                <div className={`logo col-xl-2 col-3`}>
                    <img src="images/logo.png" alt="" />
                </div>
                <div className="col-9 title">{company.officialName}</div>
                <div
                    className={`${
                        viewMode ? "col-xl-10 col-md-9" : "col-md-12"
                    } col-12 content`}
                >
                    <h5>{company.officialName}</h5>
                    <div className="d-flex justify-content-between">
                        <span>
                            <i className="fa fa-map-marker" />
                            {company.city}, {company.region}
                        </span>
                        <span ref={this.spanDistance}>
                            <i className="fa fa-map-signs" />
                            {company.distance
                                ? `${company.distance} km`
                                : "---"}
                        </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        {/* <div className="col-xl-10 col-12 px-0 py-1">
							<div className="row px-0"> */}
                        <span>
                            <i className="fa fa-line-chart" />
                            {company.revenues}
                        </span>
                        <span>
                            <i className="fa fa-users" />
                            {company.employees}
                        </span>
                        <span ref={this.spanISO}>ISO: 9001</span>
                        {/* </div>
						</div> */}
                    </div>
                    <hr />
                    <div className="d-flex">
                        <i className="fa fa-id-card-o pt-1" />
                        <div className="pl-1">{company.description}</div>
                    </div>
                    <hr />
                    <div>
                        <span>
                            <i className="fa fa-tags" />
                        </span>
                    </div>
                    <div className="d-flex justify-content-end pt-1">
                        <button
                            className="text-uppercase text-bold"
                            onClick={handleClickProfile}
                        >
                            profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
