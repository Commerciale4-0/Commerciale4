import React, { Component } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import ReactTags from "react-tag-autocomplete";
import { Row, Col } from "react-bootstrap";

import "./index.css";
import { ATECO_CODES, N_EMPOYEES, REVENUES, COMPANY_TYPES, REGIONS, citiesInRegion, maxsFromMin, minsFromMax } from "../../utils";
import MySelect from "../Custom/MySelect";
// import SearchInput from "../SearchInput";

const MAX_TAGS = 5;

export default class FilterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            radius: 1,
            tags: [],
            suggestions: [],
            cities: [],
            types: [{ value: 0, label: "-- Select --" }, ...COMPANY_TYPES],
            regions: [{ value: 0, label: "-- Select --" }, ...REGIONS],
            minEmployees: N_EMPOYEES,
            maxEmployees: N_EMPOYEES,
            minRevenues: REVENUES,
            maxRevenues: REVENUES,

            selectedRegion: null,
            selectedCity: null,
            selectedType: null,
            selectedEmployeeMin: N_EMPOYEES[0],
            selectedEmployeeMax: N_EMPOYEES[0],
            selectedRevenueMin: REVENUES[0],
            selectedRevenueMax: REVENUES[0],
            selectedCode: null,

            tagsPlaceholder: "Search with #TAGS",
            isEnableRadius: false,
        };

        // this.refKey = React.createRef();
    }

    componentWillReceiveProps = (props) => {
        if (props.initialFilter && props.update) {
            this.setState({
                selectedCity: props.initialFilter.city,
                selectedRegion: props.initialFilter.region,
                selectedCode: props.initialFilter.ateco,
                radius: props.initialFilter.radius,
                selectedType: props.initialFilter.type,
                selectedEmployeeMin: props.initialFilter.employeeMin,
                selectedEmployeeMax: props.initialFilter.employeeMax,
                selectedRevenueMin: props.initialFilter.revenueMin,
                selectedRevenueMax: props.initialFilter.revenueMax,
                tags: props.initialFilter.tags,
            });

            if (props.initialFilter.region) {
                let cities = this.getCitiesInRegion(props.initialFilter.region);
                this.setState({ cities: cities });
                if (props.initialFilter.city && props.initialFilter.city.value) {
                    this.setState({ isEnableRadius: true });
                }
            }
        }
    };

    getCitiesInRegion = (region) => {
        let cities = [{ value: 0, label: "-- Select --" }];
        if (region.value) {
            cities = [{ value: 0, label: "-- Select --" }, ...citiesInRegion(region.value)];
        }

        return cities;
    };

    handleSliderChange = (radius) => {
        this.setState({ radius });
    };

    handleTypeChange = (selectedType) => {
        this.setState({ selectedType });
    };

    handleRegionChange = (selectedRegion) => {
        this.setState({ selectedRegion });
        let cities = this.getCitiesInRegion(selectedRegion);
        this.setState({
            selectedCity: cities[0],
            cities: cities,
            isEnableRadius: false,
        });
    };

    handleCityChange = (selectedCity) => {
        this.setState({ selectedCity });
        this.setState({
            isEnableRadius: selectedCity.value !== 0,
        });
    };

    handleTagDelete = (i) => {
        const tags = this.state.tags.slice(0);
        tags.splice(i, 1);
        this.setState({ tags });
        let elem = document.querySelector(".react-tags__search-input");
        if (elem) {
            elem.style.display = "block";
            elem.focus();
        }
        if (!tags || !tags.length) {
            this.setState({
                tagsPlaceholder: "Search with #TAGS",
            });
            if (elem) {
                elem.style.width = "16ch";
            }
        } else {
            this.setState({
                tagsPlaceholder: `Max:${MAX_TAGS}(Left:${MAX_TAGS - tags.length})`,
            });
        }
    };

    handleTagAddition = (tag) => {
        const { tags } = this.state;
        if (tags.filter((elem) => elem.name === tag.name).length) {
            return;
        }

        if (tags.length === MAX_TAGS - 1) {
            let elem = document.querySelector(".react-tags__search-input");
            if (elem) {
                elem.style.display = "none";
            }
        } else {
            this.setState({
                tagsPlaceholder: `Max:${MAX_TAGS}(Left:${MAX_TAGS - tags.length - 1})`,
            });
        }

        const newTags = [].concat(tags, tag);
        this.setState({ tags: newTags });
    };

    handleEmployeeMinChange = (selectedEmployeeMin) => {
        this.setState({ selectedEmployeeMin });

        let values = maxsFromMin(selectedEmployeeMin.value, N_EMPOYEES);
        this.setState({
            maxEmployees: values,
        });
    };

    handleEmployeeMaxChange = (selectedEmployeeMax) => {
        this.setState({ selectedEmployeeMax });

        let values = minsFromMax(selectedEmployeeMax.value, N_EMPOYEES);
        this.setState({
            minEmployees: values,
        });
    };

    handleRevenueMinChange = (selectedRevenueMin) => {
        this.setState({ selectedRevenueMin });

        let values = maxsFromMin(selectedRevenueMin.value, REVENUES);
        this.setState({
            maxRevenues: values,
        });
    };

    handleRevenueMaxChange = (selectedRevenueMax) => {
        this.setState({ selectedRevenueMax });

        let values = minsFromMax(selectedRevenueMax.value, REVENUES);
        this.setState({
            minRevenues: values,
        });
    };

    handleCodeChange = (selectedCode) => {
        this.setState({ selectedCode });
    };

    handleClickSearch = () => {
        this.props.handleSearch({
            city: this.state.selectedCity,
            region: this.state.selectedRegion,
            radius: this.state.radius,
            ateco: this.state.selectedCode,
            type: this.state.selectedType,
            employeeMin: this.state.selectedEmployeeMin,
            employeeMax: this.state.selectedEmployeeMax,
            revenueMin: this.state.selectedRevenueMin,
            revenueMax: this.state.selectedRevenueMax,
            tags: this.state.tags,
        });
    };

    render() {
        const {
            radius,
            tags,
            suggestions,
            regions,
            cities,
            types,
            minEmployees,
            maxEmployees,
            minRevenues,
            maxRevenues,
            selectedRegion,
            selectedCity,
            selectedType,
            selectedEmployeeMin,
            selectedEmployeeMax,
            selectedRevenueMin,
            selectedRevenueMax,
            selectedCode,
            tagsPlaceholder,
            isEnableRadius,
        } = this.state;

        const { isInDashboard } = this.props;

        return (
            <div className="my-form search-form">
                {/* <div className="search-bar-field">
                    <SearchInput ref={this.refKey} />
                </div> */}
                <Row className="mb-2">
                    <Col className="group-title">
                        <i className="fa fa-map-marker pr-2" /> Area
                    </Col>
                </Row>
                <Row className="px-2 mb-1">
                    <Col sm={isInDashboard ? 12 : 6} xs={12} className="mb-2">
                        <MySelect value={selectedRegion} onChange={this.handleRegionChange} options={regions} placeholder="Region" />
                    </Col>
                    <Col sm={isInDashboard ? 12 : 6} xs={12} className="mb-2">
                        <MySelect value={selectedCity} onChange={this.handleCityChange} options={cities} placeholder="City" />
                    </Col>
                </Row>
                <Row
                    className="px-2"
                    style={{
                        opacity: isEnableRadius ? 1 : 0.5,
                    }}
                >
                    <Col xs={6}>Radius</Col>
                    <Col xs={6}>{radius} km</Col>
                    <Col className="mt-1">
                        <Slider min={0} max={200} value={radius} onChange={isEnableRadius ? this.handleSliderChange : () => {}} />
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col className="mb-2 group-title">
                        <i className="fa fa-info-circle pr-2" /> Company info
                    </Col>
                </Row>
                <Row className="px-2">
                    <Col>
                        <MySelect value={selectedType} onChange={this.handleTypeChange} options={types} placeholder="Type of company" />
                    </Col>
                </Row>
                <Row className="mt-2 px-2">
                    <Col>
                        <div>
                            <ReactTags
                                tags={tags}
                                suggestions={suggestions}
                                placeholderText={tagsPlaceholder}
                                onDelete={this.handleTagDelete.bind(this)}
                                onAddition={this.handleTagAddition.bind(this)}
                                allowNew
                            />
                        </div>
                        <div className="tag-hint">
                            Examples : <label>LASERCUT</label>
                            <label>WELDING</label>
                            <label>CNC</label>
                            {/* <span style={{ float: "right" }}>(Max:7)</span>
                            (Max:5) */}
                        </div>
                    </Col>
                </Row>
                <Row className="mt-2 px-2 align-items-center">
                    <Col className="mb-1" xs={isInDashboard ? 12 : 4}>
                        N° employees
                    </Col>
                    <Col xs={isInDashboard ? 6 : 4}>
                        <MySelect value={selectedEmployeeMin} onChange={this.handleEmployeeMinChange} options={minEmployees} placeholder="Min" />
                    </Col>
                    <Col xs={isInDashboard ? 6 : 4}>
                        <MySelect value={selectedEmployeeMax} onChange={this.handleEmployeeMaxChange} options={maxEmployees} placeholder="Max" />
                    </Col>
                </Row>
                <Row className="mt-2 px-2 align-items-center">
                    <Col className="mb-1" xs={isInDashboard ? 12 : 4}>
                        Revenues
                    </Col>
                    <Col xs={isInDashboard ? 6 : 4}>
                        <MySelect value={selectedRevenueMin} onChange={this.handleRevenueMinChange} options={minRevenues} placeholder="Min" />
                    </Col>
                    <Col xs={isInDashboard ? 6 : 4}>
                        <MySelect value={selectedRevenueMax} onChange={this.handleRevenueMaxChange} options={maxRevenues} placeholder="Max" />
                    </Col>
                </Row>
                <Row className="mt-2 px-2 align-items-center">
                    <Col>
                        <MySelect value={selectedCode} onChange={this.handleCodeChange} options={ATECO_CODES} placeholder="NACE CODE" />
                    </Col>
                </Row>
                <Row className="mt-3 px-2 justify-content-end">
                    <Col sm={isInDashboard ? 12 : 4} xs={12}>
                        <button className="txt-upper w-100" onClick={this.handleClickSearch}>
                            Search
                        </button>
                    </Col>
                </Row>
            </div>
        );
    }
}
