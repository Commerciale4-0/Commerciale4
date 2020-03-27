import React, { Component } from "react";
import "./index.css";
import MySelect from "../../Custom/MySelect";
import { ATECO_CODES, COMPANY_TYPES } from "../../../utils";
import ReactTags from "react-tag-autocomplete";

export default class ProfileCompany extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedTab: 0,
			selectedAteco: null,
			selectedType: null,
			tags: [],
			suggestions: [],
			tagsPlaceholder: "Search with #TAGS"
		};
	}

	handleClickLogo = e => {};
	handleClickCover = e => {};
	handleClickSave = e => {};
	handleTypeChange = selectedType => {
		this.setState({ selectedType });
	};
	handleAtecoChange = selectedAteco => {
		this.setState({ selectedAteco });
	};

	handleTagDelete = i => {
		const tags = this.state.tags.slice(0);
		tags.splice(i, 1);
		this.setState({ tags });
		let elems = document.getElementsByClassName("react-tags__search-input");
		if (elems && elems.length) {
			elems[0].style.display = "block";
			elems[0].focus();
		}
		if (!tags || !tags.length) {
			this.setState({
				tagsPlaceholder: "Search with #TAGS"
			});
			if (elems && elems.length) {
				elems[0].style.width = "16ch";
			}
		} else {
			this.setState({
				tagsPlaceholder: "Max:5(Left:" + (5 - tags.length) + ")"
			});
		}
	};

	handleTagAddition = tag => {
		const { tags } = this.state;
		if (tags.filter(elem => elem.name === tag.name).length) {
			return;
		}

		if (tags.length === 4) {
			let elems = document.getElementsByClassName(
				"react-tags__search-input"
			);
			if (elems && elems.length) {
				elems[0].style.display = "none";
			}
		} else {
			this.setState({
				tagsPlaceholder: "Max:5(Left:" + (5 - tags.length - 1) + ")"
			});
		}

		const newTags = [].concat(tags, tag);
		this.setState({ tags: newTags });
	};

	render() {
		const {
			selectedTab,
			selectedAteco,
			selectedType,
			tags,
			suggestions,
			tagsPlaceholder
		} = this.state;

		const aboutUsPanel = (
			<div>
				<div className="my-2">Instruction</div>
				<div>
					<textarea />
				</div>
				<div className="char-limit">Max 500 characters</div>
				<div className="mt-4 mb-2">What to do</div>
				<div>
					<textarea />
				</div>
				<div className="char-limit">Max 500 characters</div>
				<div className="mt-3">
					<div className="info-row">
						<span>N employees:</span>
						<input />
					</div>
					<div className="info-row">
						<span>Revenues:</span>
						<input />
					</div>
					<div className="info-row">
						<span>ISO:</span>
						<input />
					</div>
					<div className="info-row">
						<span>Company type:</span>
						<MySelect
							value={selectedType}
							onChange={this.handleTypeChange}
							options={COMPANY_TYPES}
							width={300}
							borderColor="var(--colorBorder)"
						/>
					</div>
					<div className="info-row">
						<span>NACE:</span>
						<MySelect
							value={selectedAteco}
							onChange={this.handleAtecoChange}
							options={ATECO_CODES}
							width={300}
							borderColor="var(--colorBorder)"
							menuHeight={132}
						/>
					</div>
					<div className="info-row -tags">
						<span className="pt-2">Tags:</span>
						<ReactTags
							tags={tags}
							suggestions={suggestions}
							placeholderText={tagsPlaceholder}
							onDelete={this.handleTagDelete.bind(this)}
							onAddition={this.handleTagAddition.bind(this)}
							allowNew
						/>
					</div>
				</div>
			</div>
		);

		const productsPanel = (
			<div className="mt-4">
				<div className="info-row">
					<span>Product name:</span>
					<input />
				</div>
				<div>
					<div className="my-2">Photos:</div>
					<div className="photos-panel">
						<div className="photo">
							<i className="fa fa-upload pr-2" />
							Upload photo
						</div>
						<div className="photo">
							<i className="fa fa-upload pr-2" />
							Upload photo
						</div>
						<div className="photo">
							<i className="fa fa-upload pr-2" />
							Upload photo
						</div>
					</div>
				</div>
				<div className="mt-4 mb-2">Details:</div>
				<div>
					<textarea />
				</div>
			</div>
		);
		const contactsPanel = (
			<div className="mt-4">
				<div className="info-row">
					<span>Address:</span>
					<input />
				</div>
				<div className="info-row">
					<span>Phone:</span>
					<input />
				</div>
				<div className="info-row">
					<span>Website:</span>
					<input />
				</div>
				<div className="info-row">
					<span>Email:</span>
					<input />
				</div>
				<div className="info-row">
					<span>2nd email:</span>
					<input />
				</div>
			</div>
		);
		return (
			<div className="company-view">
				<div className="cover-image"></div>
				<div className="logo-image" onClick={this.handleClickLogo}>
					<div>YOUR LOGO HERE</div>
				</div>
				<button
					className="secondary btn-change-cover"
					onClick={this.handleClickCover}
				>
					<i className="fa fa-upload pr-2" />
					Choose system photo
				</button>
				<div className="info-panel">
					<div className="tab-header">
						<button
							className={`tab-item ${
								selectedTab === 0 ? "active" : ""
							}`}
							onClick={() =>
								this.setState({
									selectedTab: 0
								})
							}
						>
							About us
						</button>
						<button
							className={`tab-item ${
								selectedTab === 1 ? "active" : ""
							}`}
							onClick={() =>
								this.setState({
									selectedTab: 1
								})
							}
						>
							Product & service
						</button>
						<button
							className={`tab-item ${
								selectedTab === 2 ? "active" : ""
							}`}
							onClick={() =>
								this.setState({
									selectedTab: 2
								})
							}
						>
							Contacts
						</button>
					</div>
					<div className="tab-body">
						{selectedTab === 0
							? aboutUsPanel
							: selectedTab === 1
							? productsPanel
							: contactsPanel}
						<div className="d-flex justify-content-end m-2 mt-4">
							<button
								style={{ minWidth: 140 }}
								onClick={this.handleClickSave}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
