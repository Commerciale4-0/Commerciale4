import React, { Component } from "react";
import "./index.css";
import FilterForm from "../../components/FilterForm";
import { requestAPI, geocodeByAddress } from "../../utils/api";
import CompanyCell from "../../components/CompanyCell";
import { Dropdown } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";
import Pagination from "react-js-pagination";
import { distanceFromCoords, numberFromStringWithUnit, LOGGED_USER } from "../../utils";
import SpinnerView from "../../components/SpinnerView";

const orders = [
	{ id: 0, title: "Relevance", icon: "sort-amount-desc" },
	{ id: 1, title: "↑ Revenues", icon: null },
	{ id: 2, title: "↓ Revenues", icon: null },
	{ id: 3, title: "↑ Employees", icon: null },
	{ id: 4, title: "↓ Employees", icon: null },
	{ id: 5, title: "↑ Nearest", icon: null },
	{ id: 6, title: "↓ Farthest", icon: null },
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
			isProcessing: false,
			viewMode: 0,
			itemsCountPerPage: 30,
			failCount: 0,
			filterBarXSScrollPos: window.pageYOffset,
			filterBarXSVisible: true,
		};

		this.fileterPanel = React.createRef(); // Create a ref object
	}

	componentDidMount = () => {
		if (window.innerWidth <= 576) {
			this.setState({
				itemsCountPerPage: 15,
			});
			window.addEventListener("scroll", this.handleWindowScroll);
		}
		this.setState({ isProcessing: true });

		this.getCurrentLocation();

		this.pullAllCompanies();
	};

	componentWillUnmount() {
		if (window.innerWidth <= 576) {
			window.removeEventListener("scroll", this.handleWindowScroll);
		}
	}

	handleWindowScroll = () => {
		const { filterBarXSScrollPos } = this.state;

		const currentScrollPos = window.pageYOffset;
		const filterBarXSVisible = filterBarXSScrollPos > currentScrollPos;

		this.setState({
			filterBarXSScrollPos: currentScrollPos,
			filterBarXSVisible,
			updateFilterForm: false,
		});
	};

	getCurrentLocation = () => {
		let loggedUser = JSON.parse(sessionStorage.getItem(LOGGED_USER));
		if (loggedUser && loggedUser.latitude && loggedUser.longitude) {
			this.setState({
				myLocation: {
					latitude: loggedUser.latitude,
					longitude: loggedUser.longitude,
				},
			});
			return;
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.showPosition);
		}
	};

	showPosition = (position) => {
		this.setState({
			myLocation: {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			},
		});
	};

	pullAllCompanies = async () => {
		const { failCount } = this.state;
		try {
			await requestAPI("/user", "POST", { id: "all" }).then((res) => {
				if (res.status === 1) {
					let companies = this.companiesWithDistance(res.data);
					this.setState({
						totalCompanies: companies,
					});

					let filter = JSON.parse(sessionStorage.getItem("filter"));
					if (filter) {
						this.setState({
							updateFilterForm: true,
						});

						this.applyFilter(filter, companies);
					} else {
						this.setState({
							filteredCompanies: companies,
						});
						this.setCompaniesToShow(companies, this.state.selectedOrder, this.state.activePage, this.state.itemsCountPerPage);
					}

					this.setState({ isProcessing: false });
				} else {
					this.setState({ failCount: failCount + 1 });
					console.log("failCount", failCount + 1);
					if (failCount < 3) {
						this.pullAllCompanies();
					} else {
						alert("Connection failed.");
					}
				}
			});
		} catch (e) {
			this.setState({ failCount: failCount + 1 });
			console.log("catch failCount", failCount + 1);
			if (failCount < 3) {
				this.pullAllCompanies();
			} else {
				alert("Connection failed.");
			}
		}
	};

	setCompaniesToShow = (companies, order, page, countPerPage) => {
		let result = null;
		if (order.id === 1) {
			result = companies.sort(function (a, b) {
				let numberA = numberFromStringWithUnit(a.revenues);
				let numberB = numberFromStringWithUnit(b.revenues);
				return numberA - numberB;
			});
		} else if (order.id === 2) {
			result = companies.sort(function (a, b) {
				let numberA = numberFromStringWithUnit(a.revenues);
				let numberB = numberFromStringWithUnit(b.revenues);
				return numberB - numberA;
			});
		} else if (order.id === 3) {
			result = companies.sort(function (a, b) {
				let numberA = numberFromStringWithUnit(a.employees);
				let numberB = numberFromStringWithUnit(b.employees);
				return numberA - numberB;
			});
		} else if (order.id === 4) {
			result = companies.sort(function (a, b) {
				let numberA = numberFromStringWithUnit(a.employees);
				let numberB = numberFromStringWithUnit(b.employees);
				return numberB - numberA;
			});
		} else if (order.id === 5) {
			result = companies.sort(function (a, b) {
				if (a.distance && b.distance) {
					return a.distance - b.distance;
				} else {
					return 0;
				}
			});
		} else if (order.id === 6) {
			result = companies.sort(function (a, b) {
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
			companiesToShow: result,
		});
	};

	handleClickOrder = (item) => {
		this.setCompaniesToShow(this.state.filteredCompanies, item, 1, this.state.itemsCountPerPage);
		this.setState({
			selectedOrder: item,
			activePage: 1,
		});
	};

	handleClickFilter = () => {
		window.scrollTo(0, 0);
		this.setState({
			isExpandedSidebar: !this.state.isExpandedSidebar,
		});
	};

	handleCollpaseFilter = () => {
		this.setState({
			isExpandedSidebar: false,
		});
	};

	handleClickPrev = (e) => {
		let pageNumber = this.state.activePage > 1 ? this.state.activePage - 1 : 1;
		this.setCompaniesToShow(this.state.filteredCompanies, this.state.selectedOrder, pageNumber, this.state.itemsCountPerPage);
		this.setState({ activePage: pageNumber });
	};
	handleClickNext = (e) => {
		const { activePage, filteredCompanies, itemsCountPerPage } = this.state;
		if (!filteredCompanies || !filteredCompanies.length) {
			return;
		}

		let temp = (activePage * itemsCountPerPage) / (filteredCompanies.length + 1);

		let pageNumber = temp < 1 ? activePage + 1 : activePage;

		this.setCompaniesToShow(this.state.filteredCompanies, this.state.selectedOrder, pageNumber, this.state.itemsCountPerPage);
		this.setState({ activePage: pageNumber });
	};

	handleChangePage(pageNumber) {
		this.setCompaniesToShow(this.state.filteredCompanies, this.state.selectedOrder, pageNumber, this.state.itemsCountPerPage);
		this.setState({ activePage: pageNumber });
	}

	handleClickSearch = async (filter) => {
		// sessionStorage.setItem("filter", JSON.stringify(filter));
		this.setState({
			updateFilterForm: false,
		});
		this.applyFilter(filter);
	};

	handleClickList = () => {
		this.setCompaniesToShow(this.state.filteredCompanies, this.state.selectedOrder, 1, 15);

		this.setState({
			viewMode: 1,
			itemsCountPerPage: 15,
		});
	};

	handleClickGrid = () => {
		this.setCompaniesToShow(this.state.filteredCompanies, this.state.selectedOrder, 1, 30);
		this.setState({
			viewMode: 0,
			itemsCountPerPage: 30,
		});
	};

	handleClickProfile = (id) => {
		// console.log(id);
		window.location.href = `/company/${id}`;
	};

	applyFilter = async (filter, companies = null) => {
		this.setState({
			isProcessing: true,
			filter: filter,
			isExpandedSidebar: false,
		});

		let temp = companies ? companies : this.state.totalCompanies;

		temp = temp.filter(
			(company) =>
				(!filter.ateco || filter.ateco === company.ateco) &&
				(!filter.type || filter.type === company.typeOfCompany) &&
				(!filter.employeeMin || filter.employeeMin <= company.employees) &&
				(!filter.employeeMax || filter.employeeMax >= company.employees) &&
				(!filter.revenueMin || filter.revenueMin <= company.revenues) &&
				(!filter.revenueMax || filter.revenueMax >= company.revenues)
		);

		if (filter.tags && filter.tags.length) {
			let temp2 = [];

			temp.forEach((company) => {
				if (company.tags) {
					company.tags.forEach((tag) => {
						filter.tags.forEach((withTag) => {
							if (withTag === tag) {
								temp2.push(company);
							}
						});
					});
				}
			});

			temp = temp2.slice(0);
		}

		temp = await this.getCompaniesInRadius(temp, filter.city, filter.region, filter.radius);

		this.setState({
			filteredCompanies: temp,
			activePage: 1,
		});

		this.setCompaniesToShow(temp, this.state.selectedOrder, 1, this.state.itemsCountPerPage);
		this.setState({ isProcessing: false });
	};

	getCompaniesInRadius = async (companies, city, region, radius) => {
		if (!region) {
			return companies;
		}

		let items = [];
		if (!city) {
			for (let i in companies) {
				if (companies[i].region === region) {
					items.push(companies[i]);
				}
			}
			return items;
		}

		let latitude = 0.0;
		let longitude = 0.0;
		await geocodeByAddress(city, region)
			.then((res) => {
				latitude = res.lat;
				longitude = res.lng;
			})
			.catch((err) => {
				console.log("Did not get coordiantes for the address");
				return companies;
			});

		for (let i in companies) {
			if (!companies[i].latitude || !companies[i].longitude) {
				items.push(companies[i]);
				continue;
			}
			let distance = distanceFromCoords(latitude, longitude, companies[i].latitude, companies[i].longitude);
			if (distance <= radius) {
				items.push(companies[i]);
			}
		}
		return items;
	};

	companiesWithDistance = (companies) => {
		const { myLocation } = this.state;

		if (!myLocation) {
			return companies;
		}

		let modifiedCompanies = [];
		for (let i in companies) {
			let distance = distanceFromCoords(myLocation.latitude, myLocation.longitude, companies[i].latitude, companies[i].longitude);

			modifiedCompanies.push({
				...companies[i],
				distance: distance.toFixed(2),
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
			isProcessing,
			filter,
			updateFilterForm,
			viewMode,
			itemsCountPerPage,
			filterBarXSVisible,
		} = this.state;

		const dropdown = (
			<Dropdown>
				<Dropdown.Toggle>
					{selectedOrder.icon ? <i className={`fa fa-${selectedOrder.icon} pr-2`} /> : <div></div>}
					{selectedOrder.title}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{orders.map((item) => (
						<Dropdown.Item key={item.id} onClick={() => this.handleClickOrder(item)}>
							{item.title}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		);

		const filterBarXS = (
			<div>
				<div className={`filter-bar-xs ${!filterBarXSVisible ? "move" : ""}`}>
					{dropdown}
					<button className="btn-filter" onClick={this.handleClickFilter}>
						<i className="fa fa-filter pr-2" />
						Filter
					</button>
				</div>
				<div className="result-xs">
					<div>
						{`${(activePage - 1) * itemsCountPerPage + 1}-${(activePage - 1) * itemsCountPerPage + companiesToShow.length} / ${
							filteredCompanies.length
						} results`}
					</div>
					<div>
						<button className="btn-prev secondary round mr-2" onClick={this.handleClickPrev}>
							<i className="fa fa-angle-left" />
						</button>
						{activePage}
						<button className="btn-next secondary round ml-2" onClick={this.handleClickNext}>
							<i className="fa fa-angle-right" />
						</button>
					</div>
				</div>
			</div>
		);

		const filterBarMD = (
			<div className="filter-bar">
				<span className="result-md">
					{`${(activePage - 1) * itemsCountPerPage + 1}-${(activePage - 1) * itemsCountPerPage + companiesToShow.length} / ${
						filteredCompanies.length
					} results`}
				</span>
				<div className="d-flex">
					{dropdown}
					<button className={`btn-view ${!viewMode ? "active" : ""}`} onClick={this.handleClickGrid}>
						<i className="fa fa-th-large" />
					</button>
					<button className={`btn-view ${viewMode ? "active" : ""}`} onClick={this.handleClickList}>
						<i className="fa fa-th-list" />
					</button>
				</div>
			</div>
		);

		// const spinnerPanel = (
		// 	<div className="spinner-panel">
		// 		<Spinner animation="border" />
		// 	</div>
		// );

		const listPanel = (
			<div className="list-panel">
				<div className="row company-list">
					{companiesToShow.map((company, index) => (
						<div key={index} className={`grid-cell ${viewMode ? "col-12" : "col-sm-6 col-12"} `}>
							<CompanyCell company={company} viewMode={viewMode} handleClickProfile={() => this.handleClickProfile(company.id)} />
						</div>
					))}
				</div>
				<div className="pagination-bar">
					<Pagination
						activePage={activePage}
						itemsCountPerPage={itemsCountPerPage}
						totalItemsCount={filteredCompanies.length}
						onChange={this.handleChangePage.bind(this)}
					/>
				</div>
			</div>
		);
		return (
			<div className="dashboard container" ref={this.fileterPanel}>
				<div className={`left-panel ${isExpandedSidebar ? "xs" : ""}`}>
					<button
						onClick={() =>
							this.setState({
								isExpandedSidebar: false,
							})
						}
					>
						<i className="fa fa-close" />
					</button>
					<FilterForm isInDashboard handleSearch={this.handleClickSearch} initialFilter={filter} update={updateFilterForm} />
				</div>
				<div className={`right-panel ${isExpandedSidebar ? "xs" : ""}`}>
					{filterBarMD}
					{filterBarXS}
					{isProcessing ? <SpinnerView /> : filteredCompanies && filteredCompanies.length ? listPanel : <div className="no-result">No results</div>}
				</div>
			</div>
		);
	}
}
