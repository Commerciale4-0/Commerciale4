import React, { Component } from "react";
import "./index.css";
import { Row, Col, Spinner } from "react-bootstrap";
import SearchForm from "../../components/SearchForm";
import { requestAPI, geocodeByAddress } from "../../utils/api";
import CompanyCell from "../../components/CompanyCell";
import { Dropdown } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Pagination from "react-js-pagination";
import { distanceFromCoords } from "../../utils";

const orders = [
    { id: 0, title: "Relevance", icon: "sort-amount-desc" },
    { id: 1, title: "Ascending", icon: "sort-alpha-asc" },
    { id: 2, title: "Descending", icon: "sort-alpha-desc" },
    { id: 3, title: "Nearest", icon: "sort-amount-desc" },
    { id: 4, title: "Farthest", icon: "sort-amount-asc" }
];

const itemsCountPerPage = 5;
const pageRangeDisplayed = 5;

export default class Dashboard extends Component {
    state = {
        totalCompanies: [],
        filteredCompanies: [],
        companiesToShow: [],
        selectedOrder: orders[0],
        isExpandedSidebar: false,
        activePage: 1,
        filter: null,
        isLoading: false
    };

    getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        }
    };

    showPosition = position => {
        this.setState({
            myLocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        });
    };

    componentDidMount = () => {
        this.setState({ isLoading: true });

        let filter = JSON.parse(sessionStorage.getItem("filter"));

        this.getCurrentLocation();
        requestAPI("/user/all-users", "GET").then(res => {
            if (res.status === 1) {
                let companies = this.companiesWithDistance(res.data);
                this.setState({
                    totalCompanies: companies
                });

                if (filter) {
                    this.setState({
                        updateSearchForm: true
                    });

                    this.applyFilter(filter, companies);
                } else {
                    this.setState({ filteredCompanies: companies });
                    this.setCompaniesToShow(
                        companies,
                        this.state.selectedOrder,
                        this.state.activePage
                    );
                }

                this.setState({ isLoading: false });
            }
        });
    };

    setCompaniesToShow = (companies, order, page) => {
        let result = null;
        if (order.id === 1) {
            result = companies.sort(function(a, b) {
                if (a.officialName < b.officialName) {
                    return -1;
                }
                if (a.officialName > b.officialName) {
                    return 1;
                }
                return 0;
            });
        } else if (order.id === 2) {
            result = companies.sort(function(a, b) {
                if (a.officialName > b.officialName) {
                    return -1;
                }
                if (a.officialName < b.officialName) {
                    return 1;
                }
                return 0;
            });
        } else if (order.id === 3) {
            result = companies.sort(function(a, b) {
                if (a.distance && b.distance) {
                    return a.distance - b.distance;
                } else {
                    return 0;
                }
            });
        } else if (order.id === 4) {
            result = companies.sort(function(a, b) {
                if (a.distance && b.distance) {
                    return b.distance - a.distance;
                } else {
                    return 0;
                }
            });
        } else {
            result = companies;
        }

        result = result.slice(
            (page - 1) * itemsCountPerPage,
            page * itemsCountPerPage
        );

        this.setState({
            companiesToShow: result
        });
    };

    handleClickOrder = item => {
        this.setCompaniesToShow(this.state.filteredCompanies, item, 1);
        this.setState({
            selectedOrder: item,
            activePage: 1
        });
    };

    handleClickFilter = () => {
        this.setState({
            isExpandedSidebar: !this.state.isExpandedSidebar
        });
    };

    handleCollpaseFilter = () => {
        this.setState({
            isExpandedSidebar: false
        });
    };

    handleChangePage(pageNumber) {
        this.setCompaniesToShow(
            this.state.filteredCompanies,
            this.state.selectedOrder,
            pageNumber
        );
        this.setState({ activePage: pageNumber });
    }

    handleClickSearch = async filter => {
        sessionStorage.setItem("filter", JSON.stringify(filter));
        this.setState({
            updateSearchForm: false
        });
        this.applyFilter(filter);
    };

    applyFilter = async (filter, companies = null) => {
        this.setState({ isLoading: true });
        this.setState({ filter: filter });

        this.setState({
            isExpandedSidebar: !this.state.isExpandedSidebar
        });

        let temp = companies ? companies : this.state.totalCompanies;
        if (filter.ateco && filter.ateco.value) {
            temp = temp.filter(elem => elem.atecoCode === filter.ateco);
        }

        temp = await this.getCompaniesInRadius(
            temp,
            filter.city,
            filter.region,
            filter.radius
        );

        this.setState({
            filteredCompanies: temp,
            activePage: 1
        });

        this.setCompaniesToShow(temp, this.state.selectedOrder, 1);
        this.setState({ isLoading: false });
    };

    getCompaniesInRadius = async (companies, city, region, radius) => {
        if (!radius || !city) {
            return companies;
        }

        let latitude = 0.0;
        let longitude = 0.0;
        if (city && region) {
            await geocodeByAddress(city.label, region.label)
                .then(res => {
                    latitude = res.lat;
                    longitude = res.lng;
                })
                .catch(err => {
                    console.log("Did not get coordiantes for the address");
                    return companies;
                });
        }

        let items = [];
        for (let i in companies) {
            if (!companies[i].latitude || !companies[i].longitude) {
                items.push(companies[i]);
                continue;
            }
            let distance = distanceFromCoords(
                latitude,
                longitude,
                companies[i].latitude,
                companies[i].longitude
            );
            if (distance <= radius) {
                items.push(companies[i]);
            }
        }
        return items;
    };

    companiesWithDistance = companies => {
        const { myLocation } = this.state;
        console.log("Current locatin", this.state.myLocation);
        if (!myLocation) {
            return companies;
        }

        let modifiedCompanies = [];
        for (let i in companies) {
            let distance = distanceFromCoords(
                myLocation.latitude,
                myLocation.longitude,
                companies[i].latitude,
                companies[i].longitude
            );

            modifiedCompanies.push({
                ...companies[i],
                distance: distance.toFixed(2)
            });
        }
        return modifiedCompanies;
    };

    render() {
        const {
            filteredCompanies,
            companiesToShow,
            selectedOrder,
            isExpandedSidebar,
            activePage,
            isLoading,
            filter,
            updateSearchForm
        } = this.state;

        return (
            <div className="dashboard">
                <Row>
                    <Col sm={4} xl={3} className="left-panel">
                        <div>
                            <SearchForm
                                isInDashboard
                                handleSearch={this.handleClickSearch}
                                initialFilter={filter}
                                update={updateSearchForm}
                            />
                        </div>
                    </Col>
                    <Col sm={8} xl={9} xs={12} className="right-panel">
                        <div>
                            <div className="d-flex justify-content-between">
                                <button
                                    className="secondary btn-filter"
                                    onClick={this.handleClickFilter}
                                >
                                    <i className="fa fa-filter pr-2" />
                                    Filter
                                </button>
                                <span className="result-md">
                                    {`${companiesToShow.length} / ${filteredCompanies.length} results`}
                                </span>
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <i
                                            className={`fa fa-${selectedOrder.icon} pr-2`}
                                        />
                                        {selectedOrder.title}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {orders.map(item => (
                                            <Dropdown.Item
                                                key={item.id}
                                                onClick={() =>
                                                    this.handleClickOrder(item)
                                                }
                                            >
                                                {item.title}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="result-xs">
                                {`${companiesToShow.length} / ${filteredCompanies.length} results`}
                            </div>
                            <hr className="my-2" />
                            {isLoading ? (
                                <div className="d-flex justify-content-center">
                                    <Spinner animation="border" />
                                </div>
                            ) : filteredCompanies &&
                              filteredCompanies.length ? (
                                <div>
                                    <div className="d-flex justify-content-center">
                                        <Pagination
                                            activePage={activePage}
                                            itemsCountPerPage={
                                                itemsCountPerPage
                                            }
                                            totalItemsCount={
                                                filteredCompanies.length
                                            }
                                            pageRangeDisplayed={
                                                pageRangeDisplayed
                                            }
                                            onChange={this.handleChangePage.bind(
                                                this
                                            )}
                                        />
                                    </div>

                                    {companiesToShow.map((company, index) => (
                                        <CompanyCell
                                            key={index}
                                            company={company}
                                        />
                                    ))}
                                    <div className="d-flex justify-content-center">
                                        <Pagination
                                            activePage={activePage}
                                            itemsCountPerPage={
                                                itemsCountPerPage
                                            }
                                            totalItemsCount={
                                                filteredCompanies.length
                                            }
                                            pageRangeDisplayed={
                                                pageRangeDisplayed
                                            }
                                            onChange={this.handleChangePage.bind(
                                                this
                                            )}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">No Results</div>
                            )}
                        </div>
                    </Col>
                </Row>
                <Sidebar
                    isExpanded={isExpandedSidebar}
                    handleCollapse={this.handleCollpaseFilter}
                    contentWidth={75}
                    background="white"
                    isCloseButton
                >
                    <SearchForm
                        isInDashboard
                        handleSearch={this.handleClickSearch}
                    />
                </Sidebar>
            </div>
        );
    }
}
