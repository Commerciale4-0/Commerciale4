import React, { Component } from "react";
import "./index.css";
import MySelect from "../../Custom/MySelect";
import { ISO, COMPANY_TYPES } from "../../../utils";
import ReactTags from "react-tag-autocomplete";
import ImageCropper from "../../ImageCropper";

const RATIO_COVER = 898 / 198;
const RATIO_LOGO = 1;
const RATIO_PRODUCT = 268 / 138;

const SUB_MENUS = ["About us", "Product & service", "Contacts"];

export default class ProfileCompany extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedTab: 0,
			selectedISO: null,
			selectedType: null,
			tags: [],
			suggestions: [],
			tagsPlaceholder: "Type to add",
			targetToCrop: null,
			croppedImages: [null, null, null, null, null]
		};

		this.refBrowse = React.createRef();
		this.refIntro = React.createRef();
		this.refWhatDo = React.createRef();
		this.refEmployee = React.createRef();
		this.refRevenue = React.createRef();
		this.refProductName = React.createRef();
		this.refProductDetail = React.createRef();
		this.refAddress = React.createRef();
		this.refPhone = React.createRef();
		this.refWebsite = React.createRef();
		this.refEmail = React.createRef();
		this.ref2ndEmail = React.createRef();
	}

	handleBrowseFile = (index, ratio) => {
		this.refBrowse.current.value = null;
		this.refBrowse.current.click();
		this.setState({
			targetToCrop: { index: index, ratio: ratio }
		});
	};

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
	};

	handleTagAddition = tag => {
		const { tags } = this.state;
		if (tags.filter(elem => elem.name === tag.name).length) {
			return;
		}

		const newTags = [].concat(tags, tag);
		this.setState({ tags: newTags });
	};

	handleChangeImage = () => {
		if (
			!this.refBrowse.current.files ||
			!this.refBrowse.current.files.length
		) {
			return;
		}

		const reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				this.setState({
					targetToCrop: {
						...this.state.targetToCrop,
						image: reader.result
					}
				});
			},
			false
		);
		reader.readAsDataURL(this.refBrowse.current.files[0]);
	};

	handleSaveImage = image => {
		const { targetToCrop, croppedImages } = this.state;
		croppedImages[targetToCrop.index] = image;
		this.setState({ croppedImages: croppedImages, targetToCrop: null });
	};

	handleCropCancel = () => {
		this.setState({ targetToCrop: null });
	};

	render() {
		const {
			selectedTab,
			selectedISO,
			selectedType,
			tags,
			suggestions,
			tagsPlaceholder,
			croppedImages,
			targetToCrop
		} = this.state;

		const refBrowse = (
			<input
				type="file"
				onChange={this.handleChangeImage}
				style={{ display: "none" }}
				ref={this.refBrowse}
				accept="image/*"
			/>
		);

		const aboutUsPanel = (
			<div className={selectedTab === 0 ? "d-block" : "d-none"}>
				<div className="my-2">Introduction</div>
				<div>
					<textarea ref={this.refIntro} />
				</div>
				<div className="char-limit">Max 500 characters</div>
				<div className="mt-4 mb-2">What we do</div>
				<div>
					<textarea ref={this.refWhatDo} />
				</div>
				<div className="char-limit">Max 500 characters</div>
				<hr />
				<div>
					TAGS
					<br />
					<span className="text-small">
						Select the main keyword that represent your company.
					</span>
					<div className="info-row mt-3">
						<ReactTags
							tags={tags}
							suggestions={suggestions}
							placeholderText={tagsPlaceholder}
							onDelete={this.handleTagDelete.bind(this)}
							onAddition={this.handleTagAddition.bind(this)}
							allowNew
						/>
					</div>
					<div className="d-flex justify-content-center">
						<div className="tag-hint">
							Examples: <label>lasercut</label>
							<label>welding</label>
							<label>CNC</label>
						</div>
					</div>
				</div>
				<hr />
				<div className="mt-3">
					<div className="info-row">
						<span>N employees:</span>
						<input ref={this.refEmployee} />
					</div>
					<div className="info-row">
						<span>Revenues:</span>
						<input ref={this.refRevenue} />
					</div>
					<div className="info-row">
						<span>ISO:</span>
						<MySelect
							value={selectedISO}
							onChange={this.handleISOChange}
							options={ISO}
							width={300}
							borderColor="var(--colorBorder)"
							menuHeight={154}
						/>
					</div>
					<div className="info-row mb-5">
						<span>Company type:</span>
						<MySelect
							value={selectedType}
							onChange={this.handleTypeChange}
							options={COMPANY_TYPES}
							width={300}
							borderColor="var(--colorBorder)"
							menuHeight={102}
						/>
					</div>
				</div>
			</div>
		);

		const productsPanel = (
			<div className={`mt-4 ${selectedTab === 1 ? "d-block" : "d-none"}`}>
				<div className="info-row">
					<span>Product name:</span>
					<input ref={this.refProductName} />
				</div>
				<div>
					<div className="my-2">Photos:</div>
					<div className="photos-panel">
						{[2, 3, 4].map(index => (
							<div
								key={index}
								className="photo"
								onClick={() =>
									this.handleBrowseFile(index, RATIO_PRODUCT)
								}
							>
								{croppedImages[index] ? (
									<img src={croppedImages[index]} alt="" />
								) : (
									<div>
										<i className="fa fa-upload pr-2" />
										Upload photo
									</div>
								)}
							</div>
						))}
					</div>
				</div>
				<div className="mt-4 mb-2">Details:</div>
				<div>
					<textarea ref={this.refProductDetail} />
				</div>
			</div>
		);

		const contactsPanel = (
			<div className={`mt-4 ${selectedTab === 2 ? "d-block" : "d-none"}`}>
				<div className="info-row">
					<span>Address:</span>
					<input ref={this.refAddress} />
				</div>
				<div className="info-row">
					<span>Phone:</span>
					<input ref={this.refPhone} />
				</div>
				<div className="info-row">
					<span>Website:</span>
					<input ref={this.refWebsite} />
				</div>
				<div className="info-row">
					<span>Email:</span>
					<input ref={this.refEmail} />
				</div>
				<div className="info-row">
					<span>2nd email:</span>
					<input ref={this.ref2ndEmail} />
				</div>
			</div>
		);

		return (
			<div className="company-view">
				<div className="cover-image">
					{croppedImages[0] && <img src={croppedImages[0]} alt="" />}
				</div>
				<div className="logo-image">
					{croppedImages[1] && <img src={croppedImages[1]} alt="" />}
				</div>
				<button
					className="secondary btn-change-logo"
					onClick={() => this.handleBrowseFile(1, RATIO_LOGO)}
				>
					<i className="fa fa-upload" />
				</button>
				<button
					className="secondary btn-change-cover"
					onClick={() => this.handleBrowseFile(0, RATIO_COVER)}
				>
					<i className="fa fa-upload pr-2" />
					Choose system photo
				</button>
				<div className="info-panel">
					<div className="tab-header">
						{SUB_MENUS.map((menu, index) => (
							<button
								key={index}
								className={`tab-item ${
									selectedTab === index ? "active" : ""
								}`}
								onClick={() =>
									this.setState({
										selectedTab: index
									})
								}
							>
								{menu}
							</button>
						))}
					</div>
					<div className="tab-body">
						{aboutUsPanel}
						{productsPanel}
						{contactsPanel}
						<div className="d-flex justify-content-end mb-2 mt-4">
							<button
								style={{ minWidth: 140 }}
								onClick={this.handleClickSave}
							>
								Save
							</button>
						</div>
					</div>
				</div>
				{targetToCrop && targetToCrop.image && (
					<ImageCropper
						src={targetToCrop.image}
						aspect={targetToCrop.ratio}
						onSave={this.handleSaveImage}
						onCancel={this.handleCropCancel}
					/>
				)}
				{refBrowse}
			</div>
		);
	}
}
