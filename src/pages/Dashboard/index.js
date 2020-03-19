import React, { Component } from "react";
import "./index.css";
import { Row, Col, Spinner } from "react-bootstrap";
import SearchForm from "../../components/SearchForm";
import { requestAPI, geocodeByAddress } from "../../utils/api";
import CompanyCell from "../../components/CompanyCell";
import { Dropdown } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";
import Pagination from "react-js-pagination";
import { distanceFromCoords, numberFromStringWithUnit } from "../../utils";

const orders = [
    { id: 0, title: "Relevance", icon: "sort-amount-desc" },
    { id: 1, title: "↑ Revenues", icon: null },
    { id: 2, title: "↓ Revenues", icon: null },
    { id: 3, title: "↑ Employees", icon: null },
    { id: 4, title: "↓ Employees", icon: null },
    { id: 5, title: "↑ Nearest", icon: null },
    { id: 6, title: "↓ Farthest", icon: null }
];

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalCompanies: [],
            filteredCompanies: [],
            companiesToShow: [],
            selectedOrder: orders[0],
            isExpandedSidebar: false,
            activePage: 1,
            filter: null,
            isLoading: false,
            viewMode: 0,
            itemsCountPerPage: 30
        };

        this.fileterPanel = React.createRef(); // Create a ref object
    }

    getCurrentLocation = () => {
        let userData = JSON.parse(sessionStorage.getItem("userData"));
        if (userData && userData.latitude && userData.longitude) {
            this.setState({
                myLocation: {
                    latitude: userData.latitude,
                    longitude: userData.longitude
                }
            });
            return;
        }

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
                    this.setState({
                        filteredCompanies: companies
                    });
                    this.setCompaniesToShow(
                        companies,
                        this.state.selectedOrder,
                        this.state.activePage,
                        this.state.itemsCountPerPage
                    );
                }

                this.setState({ isLoading: false });
            }
        });
    };

    setCompaniesToShow = (companies, order, page, countPerPage) => {
        let result = null;
        if (order.id === 1) {
            result = companies.sort(function(a, b) {
                let numberA = numberFromStringWithUnit(a.revenues);
                let numberB = numberFromStringWithUnit(b.revenues);
                return numberA - numberB;
            });
        } else if (order.id === 2) {
            result = companies.sort(function(a, b) {
                let numberA = numberFromStringWithUnit(a.revenues);
                let numberB = numberFromStringWithUnit(b.revenues);
                return numberB - numberA;
            });
        } else if (order.id === 3) {
            result = companies.sort(function(a, b) {
                let numberA = numberFromStringWithUnit(a.employees);
                let numberB = numberFromStringWithUnit(b.employees);
                return numberA - numberB;
            });
        } else if (order.id === 4) {
            result = companies.sort(function(a, b) {
                let numberA = numberFromStringWithUnit(a.employees);
                let numberB = numberFromStringWithUnit(b.employees);
                return numberB - numberA;
            });
        } else if (order.id === 5) {
            result = companies.sort(function(a, b) {
                if (a.distance && b.distance) {
                    return a.distance - b.distance;
                } else {
                    return 0;
                }
            });
        } else if (order.id === 6) {
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

        result = result.slice((page - 1) * countPerPage, page * countPerPage);

        this.setState({
            companiesToShow: result
        });
    };

    handleClickOrder = item => {
        this.setCompaniesToShow(
            this.state.filteredCompanies,
            item,
            1,
            this.state.itemsCountPerPage
        );
        this.setState({
            selectedOrder: item,
            activePage: 1
        });
    };

    handleClickFilter = () => {
        window.scrollTo(0, 0);
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
            pageNumber,
            this.state.itemsCountPerPage
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

    handleClickList = () => {
        this.setCompaniesToShow(
            this.state.filteredCompanies,
            this.state.selectedOrder,
            1,
            15
        );

        this.setState({
            viewMode: 1,
            itemsCountPerPage: 15
        });
    };

    handleClickGrid = () => {
        this.setCompaniesToShow(
            this.state.filteredCompanies,
            this.state.selectedOrder,
            1,
            30
        );
        this.setState({
            viewMode: 0,
            itemsCountPerPage: 30
        });
    };

    applyFilter = async (filter, companies = null) => {
        this.setState({ isLoading: true });
        this.setState({ filter: filter });

        this.setState({
            isExpandedSidebar: false
        });

        let temp = companies ? companies : this.state.totalCompanies;

        if (filter.key && filter.key.trim().length) {
            temp = temp.filter(elem =>
                elem.officialName
                    .toLowerCase()
                    .includes(filter.key.toLowerCase())
            );
        }

        if (filter.ateco && filter.ateco.value) {
            temp = temp.filter(elem => elem.atecoCode === filter.ateco.label);
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

        this.setCompaniesToShow(
            temp,
            this.state.selectedOrder,
            1,
            this.state.itemsCountPerPage
        );
        this.setState({ isLoading: false });
    };

    getCompaniesInRadius = async (companies, city, region, radius) => {
        if (!region || !region.value) {
            return companies;
        }

        let items = [];
        if (!city || !city.value) {
            for (let i in companies) {
                if (companies[i].region === region.label) {
                    items.push(companies[i]);
                }
            }
            return items;
        }

        let latitude = 0.0;
        let longitude = 0.0;
        await geocodeByAddress(city.label, region.label)
            .then(res => {
                latitude = res.lat;
                longitude = res.lng;
            })
            .catch(err => {
                console.log("Did not get coordiantes for the address");
                return companies;
            });

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
            updateSearchForm,
            viewMode,
            itemsCountPerPage
        } = this.state;

        const dropdown = (
            <Dropdown>
                <Dropdown.Toggle>
                    {selectedOrder.icon ? (
                        <i className={`fa fa-${selectedOrder.icon} pr-2`} />
                    ) : (
                        <div></div>
                    )}
                    {selectedOrder.title}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {orders.map(item => (
                        <Dropdown.Item
                            key={item.id}
                            onClick={() => this.handleClickOrder(item)}
                        >
                            {item.title}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );

        const filterBarXS = (
            <div className="filter-bar-xs">
                {dropdown}
                <button className="btn-filter" onClick={this.handleClickFilter}>
                    <i className="fa fa-filter pr-2" />
                    Filter
                </button>
            </div>
        );
        const filterBarMD = (
            <div className="filter-bar">
                <span className="result-md">
                    {`${companiesToShow.length} / ${filteredCompanies.length} results`}
                </span>
                <div className="d-flex">
                    {dropdown}
                    <button
                        className={`btn-view ${!viewMode ? "active" : ""}`}
                        onClick={this.handleClickGrid}
                    >
                        <i className="fa fa-th-large" />
                    </button>
                    <button
                        className={`btn-view ${viewMode ? "active" : ""}`}
                        onClick={this.handleClickList}
                    >
                        <i className="fa fa-th-list" />
                    </button>
                </div>
            </div>
        );

        return (
            <div className="dashboard" ref={this.fileterPanel}>
                <Row>
                    <Col
                        sm={4}
                        xl={3}
                        xs={12}
                        className={`left-panel ${
                            isExpandedSidebar ? "xs" : ""
                        }`}
                    >
                        <button
                            onClick={() =>
                                this.setState({
                                    isExpandedSidebar: false
                                })
                            }
                        >
                            <i className="fa fa-close" />
                        </button>
                        <div>
                            <SearchForm
                                isInDashboard
                                handleSearch={this.handleClickSearch}
                                initialFilter={filter}
                                update={updateSearchForm}
                            />
                        </div>
                    </Col>
                    <Col
                        sm={8}
                        xl={9}
                        xs={12}
                        className={`right-panel ${
                            isExpandedSidebar ? "xs" : ""
                        }`}
                    >
                        <div>
                            {filterBarMD}
                            {filterBarXS}
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
                                    <div className="row company-list">
                                        {companiesToShow.map(
                                            (company, index) => (
                                                <div
                                                    key={index}
                                                    className={`grid-cell ${
                                                        viewMode
                                                            ? "col-12"
                                                            : "col-sm-6 col-12"
                                                    } `}
                                                >
                                                    <CompanyCell
                                                        company={company}
                                                        viewMode={viewMode}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center pt-2">
                                        <Pagination
                                            activePage={activePage}
                                            itemsCountPerPage={
                                                itemsCountPerPage
                                            }
                                            totalItemsCount={
                                                filteredCompanies.length
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
                {/* <Sidebar
					isExpanded={isExpandedSidebar}
					handleCollapse={this.handleCollpaseFilter}
					contentWidth={100}
					background="white"
				>
					<SearchForm
						isInDashboard
						handleSearch={this.handleClickSearch}
						initialFilter={filter}
						update={updateSearchForm}
					/>
				</Sidebar> */}
            </div>
        );
    }
}
