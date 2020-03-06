import React, { Component } from "react";
import Slider from "react-rangeslider";
import Select from "react-select";
import "react-rangeslider/lib/index.css";
import ReactTags from "react-tag-autocomplete";
import { Container, Row, Col } from "react-bootstrap";

import "./index.css";
import {
  ATECO_CODES,
  N_EMPOYEES,
  REVENUES,
  COMPANY_TYPES,
  REGIONS,
  citiesInRegion,
  maxsFromMin,
  minsFromMax
} from "../../utils";

export default class SimpleSearch extends Component {
  state = {
    radius: 1,
    tags: [],
    suggestions: [],
    cities: [],
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
    selectedCode: null
  };

  handleSliderChange = radius => {
    this.setState({ radius });
  };

  handleTypeChange = selectedType => {
    this.setState({ selectedType });
  };

  handleRegionChange = selectedRegion => {
    this.setState({ selectedRegion });
    let cities = citiesInRegion(selectedRegion.value);
    if (cities && cities.length) {
      this.setState({
        selectedCity: cities[0]
      });
    }
    this.setState({
      cities: cities
    });
  };

  handleCityChange = selectedCity => {
    this.setState({ selectedCity });
  };

  handleTagDelete = i => {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  };

  handleTagAddition = tag => {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  };

  handleEmployeeMinChange = selectedEmployeeMin => {
    this.setState({ selectedEmployeeMin });

    let values = maxsFromMin(selectedEmployeeMin.value, N_EMPOYEES);
    this.setState({
      maxEmployees: values
    });
  };

  handleEmployeeMaxChange = selectedEmployeeMax => {
    this.setState({ selectedEmployeeMax });

    let values = minsFromMax(selectedEmployeeMax.value, N_EMPOYEES);
    this.setState({
      minEmployees: values
    });
  };

  handleRevenueMinChange = selectedRevenueMin => {
    this.setState({ selectedRevenueMin });

    let values = maxsFromMin(selectedRevenueMin.value, REVENUES);
    this.setState({
      maxRevenues: values
    });
  };

  handleRevenueMaxChange = selectedRevenueMax => {
    this.setState({ selectedRevenueMax });

    let values = minsFromMax(selectedRevenueMax.value, REVENUES);
    this.setState({
      minRevenues: values
    });
  };

  handleCodeChange = selectedCode => {
    this.setState({ selectedCode });
  };

  render() {
    const {
      radius,
      tags,
      suggestions,
      cities,
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
      selectedCode
    } = this.state;

    return (
      <Container className="search-form">
        <Row className="mb-2">
          <Col className="txt-upper font-weight-bold">
            <i className="fa fa-map-marker pr-2" /> Area
          </Col>
        </Row>
        <Row className="px-3 mb-1">
          <Col sm={6} xs={12} className="mb-2">
            <Select
              value={selectedRegion}
              onChange={this.handleRegionChange}
              options={REGIONS}
              placeholder="Region"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
          <Col sm={6} xs={12} className="mb-2">
            <Select
              value={selectedCity}
              onChange={this.handleCityChange}
              options={cities}
              placeholder="City"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
        </Row>
        <Row className="px-3">
          <Col xs={6}>Radius</Col>
          <Col xs={6}>{radius} km</Col>
          <Col className="mt-1">
            <Slider
              min={0}
              max={200}
              value={radius}
              onChange={this.handleSliderChange}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="mb-2 txt-upper font-weight-bold">
            <i className="fa fa-info-circle pr-2" /> Company info
          </Col>
        </Row>
        <Row className="px-3">
          <Col>
            <Select
              value={selectedType}
              onChange={this.handleTypeChange}
              options={COMPANY_TYPES}
              placeholder="Type of company"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
        </Row>
        <Row className="mt-2 px-3">
          <Col>
            <ReactTags
              tags={tags}
              suggestions={suggestions}
              onDelete={this.handleTagDelete.bind(this)}
              onAddition={this.handleTagAddition.bind(this)}
              allowNew
            />
          </Col>
        </Row>
        <Row className="mt-3 px-3 align-items-center">
          <Col sm={3} xs={12} className="mb-1">
            N employees
          </Col>
          <Col>
            <Select
              value={selectedEmployeeMin}
              onChange={this.handleEmployeeMinChange}
              options={minEmployees}
              placeholder="Min"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
          <Col>
            <Select
              value={selectedEmployeeMax}
              onChange={this.handleEmployeeMaxChange}
              options={maxEmployees}
              placeholder="Max"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
        </Row>
        <Row className="mt-3 px-3 align-items-center">
          <Col sm={3} xs={12} className="mb-1">
            Revenues
          </Col>
          <Col>
            <Select
              value={selectedRevenueMin}
              onChange={this.handleRevenueMinChange}
              options={minRevenues}
              placeholder="Min"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
          <Col>
            <Select
              value={selectedRevenueMax}
              onChange={this.handleRevenueMaxChange}
              options={maxRevenues}
              placeholder="Max"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
        </Row>
        <Row className="my-3 px-3 align-items-center">
          <Col sm={3} xs={12} className="mb-1">
            ATECO CODE
          </Col>
          <Col>
            <Select
              value={selectedCode}
              onChange={this.handleCodeChange}
              options={ATECO_CODES}
              placeholder="ATECO CODE"
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "var(--colorPrimary)"
                }
              })}
            />
          </Col>
        </Row>
        <Row className="px-3 justify-content-end">
          <Col sm={3} xs={12}>
            <button className="txt-upper w-100">Search</button>
          </Col>
        </Row>
      </Container>
    );
  }
}
