import React, { Component } from "react";
import "./index.css";
import MySelect from "../../Custom/MySelect";
import { ISO, COMPANY_TYPES, LOGGED_USER } from "../../../utils";
import ReactTags from "react-tag-autocomplete";
import ImageCropper from "../../ImageCropper";
import { requestAPI } from "../../../utils/api";
import SpinnerView from "../../SpinnerView";
import Lang from "../../Lang";

const IMAGE_COVER = { ratio: 1200 / 240, maxWidth: 1200, circle: false };
const IMAGE_LOGO = { ratio: 1, maxWidth: 300, circle: true };
const IMAGE_PRODUCT = { ratio: 1, maxWidth: 800, circle: false };

const SUB_MENUS = ["About us", "Product & service", "Contacts"];

const INTRO_MAX_LENGTH = 300;
const WHATWEDO_MAX_LENGTH = 300;

const MAX_TAGS = 7;

export default class ProfileCompany extends Component {
    constructor(props) {
        super(props);

        let tags = [];
        props.profile.tags &&
            props.profile.tags.forEach((tag) => {
                tags.push({ name: tag });
            });

        let selectedISO = ISO.filter((code) => code.label === props.profile.iso);

        let selectedType = COMPANY_TYPES.filter((type) => type.label === props.profile.typeOfCompany);

        let productPhotos = [];
        props.profile.productPhotos &&
            props.profile.productPhotos.length &&
            props.profile.productPhotos.forEach((photo) => {
                productPhotos.push(process.env.REACT_APP_AWS_PREFIX + photo);
            });

        let originPhotos = {
            background: props.profile.background ? process.env.REACT_APP_AWS_PREFIX + props.profile.background : null,
            logo: props.profile.logo ? process.env.REACT_APP_AWS_PREFIX + props.profile.logo : null,
            productPhotos: productPhotos,
        };

        this.state = {
            selectedTab: 0,
            selectedISO: selectedISO,
            selectedType: selectedType,
            tags: tags,
            suggestions: [],
            tagsPlaceholder: "Type to add",
            targetToCrop: null,
            originPhotos: originPhotos,
            coverImage: originPhotos.background,
            logoImage: originPhotos.logo,
            productImages: originPhotos.productPhotos.slice(0),
            isProcessing: false,
            selectedIntroLang: 2,
            selectedWhatDoLang: 2,

            introLength: 0,
            introItLength: 0,
            whatWeDoLength: 0,
            whatWeDoItLength: 0,
        };

        this.aboutUsPanel = React.createRef();
        this.productsPanel = React.createRef();
        this.contactsPanel = React.createRef();

        this.refBrowse = React.createRef();
        this.refIntro = React.createRef();
        this.refIntroIt = React.createRef();
        this.refWhatWeDo = React.createRef();
        this.refWhatWeDoIt = React.createRef();
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

    handleChangeTab = (index) => {
        let maxHeight = this.aboutUsPanel.current.offsetHeight;
        if (maxHeight > 0) {
            this.productsPanel.current.style.height = this.contactsPanel.current.style.height = maxHeight + "px";
        }
        this.setState({ selectedTab: index });
    };

    handleClickSave = async (e) => {
        const { originPhotos, coverImage, logoImage, productImages, tags, selectedISO, selectedType } = this.state;

        let newTags = [];
        tags &&
            tags.forEach((tag) => {
                newTags.push(tag.name);
            });

        let employees = parseInt(this.refEmployee.current.value);
        if (!employees) {
            employees = 0;
        }

        let revenues = parseInt(this.refRevenue.current.value);
        if (!revenues) {
            revenues = 0;
        }

        let dataToSave = {
            id: this.props.profile.id,
            stringData: {
                introduction: this.refIntro.current.value,
                introductionIt: this.refIntroIt.current.value,
                whatWeDo: this.refWhatWeDo.current.value,
                whatWeDoIt: this.refWhatWeDoIt.current.value,
                employees: employees,
                revenues: revenues,
                iso: selectedISO && selectedISO.label,
                typeOfCompany: selectedType && selectedType.label,
                productName: this.refProductName.current.value,
                productDetail: this.refProductDetail.current.value,
                companyAddress: this.refAddress.current.value,
                companyPhone: this.refPhone.current.value,
                website: this.refWebsite.current.value,
                companyEmail: this.refEmail.current.value,
                company2ndEmail: this.ref2ndEmail.current.value,
                tags: newTags,
            },

            imageData: {
                background: coverImage !== originPhotos.background ? coverImage : null,
                logo: logoImage !== originPhotos.logo ? logoImage : null,
            },
        };

        let removedPhotos = [];
        let prefix = process.env.REACT_APP_AWS_PREFIX;
        if (originPhotos.background && coverImage && coverImage.search(prefix) === -1) {
            let path = originPhotos.background.substr(originPhotos.background.search(prefix) + prefix.length, originPhotos.background.length);
            removedPhotos.push(path);
        }

        if (originPhotos.logo && logoImage && logoImage.search(prefix) === -1) {
            let path = originPhotos.logo.substr(originPhotos.logo.search(prefix) + prefix.length, originPhotos.logo.length);
            removedPhotos.push(path);
        }

        for (let i in originPhotos.productPhotos) {
            let originPhoto = originPhotos.productPhotos[i];
            let removed = true;
            for (let j in productImages) {
                let modifiedPhoto = productImages[j];
                if (modifiedPhoto.search(originPhoto) !== -1) {
                    removed = false;
                    break;
                }
            }
            if (removed) {
                let path = originPhoto.substr(originPhoto.search(prefix) + prefix.length, originPhoto.length);
                removedPhotos.push(path);
            }
        }

        dataToSave.imageData.removedPhotos = removedPhotos;

        let newImages = [];
        for (let i in productImages) {
            let photo = productImages[i];
            let index = photo.search(prefix);
            if (index === -1) {
                newImages.push(photo);
            } else {
                newImages.push(photo.substr(index + prefix.length, photo.length));
            }
        }

        dataToSave.imageData.productPhotos = newImages;

        console.log(dataToSave);
        this.setState({ isProcessing: true });

        await requestAPI("/user/profile/edit", "POST", dataToSave).then((res) => {
            this.setState({ isProcessing: false });
            if (res.status === 1) {
                console.log(res.data);
                if (res.data) {
                    let originPhotos = this.state.originPhotos;
                    if (res.data.background) {
                        originPhotos.background = prefix + res.data.background;
                    }
                    if (res.data.logo) {
                        originPhotos.logo = prefix + res.data.logo;
                    }
                    if (res.data.productPhotos && res.data.productPhotos.length) {
                        let productPhotos = [];
                        res.data.productPhotos.forEach((photo) => {
                            productPhotos.push(prefix + photo);
                        });
                        originPhotos.productPhotos = productPhotos;
                    }
                    this.setState({
                        originPhotos,
                        coverImage: originPhotos.background,
                        logoImage: originPhotos.logo,
                        productImages: originPhotos.productPhotos,
                    });

                    let loggedUser = JSON.parse(sessionStorage.getItem(LOGGED_USER));
                    let newData = {
                        ...loggedUser,
                        user: res.data,
                    };

                    console.log(newData);
                    sessionStorage.setItem(LOGGED_USER, JSON.stringify(newData));
                }
            }
        });
    };

    handleRemoveProductImage = (index) => {
        if (window.confirm("Do you really want to remove?")) {
            let productImages = this.state.productImages.slice(0);
            productImages.splice(index, 1);
            this.setState({ productImages });
        }
    };

    handleISOChange = (selectedISO) => {
        console.log(selectedISO);
        this.setState({ selectedISO });
    };

    handleTypeChange = (selectedType) => {
        this.setState({ selectedType });
    };

    handleAtecoChange = (selectedAteco) => {
        this.setState({ selectedAteco });
    };

    handleTagDelete = (i) => {
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
                tagsPlaceholder: "Type to add",
            });
            if (elems && elems.length) {
                elems[0].style.width = "16ch";
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
            let elems = document.getElementsByClassName("react-tags__search-input");
            if (elems && elems.length) {
                elems[0].style.display = "none";
            }
        } else {
            this.setState({
                tagsPlaceholder: `Max:${MAX_TAGS}(Left:${MAX_TAGS - tags.length - 1})`,
            });
        }

        const newTags = [].concat(tags, tag);
        this.setState({ tags: newTags });
    };

    handleBrowseFile = (index, info) => {
        this.refBrowse.current.value = null;
        this.refBrowse.current.click();
        this.setState({
            targetToCrop: { index: index, info: info },
        });
    };

    handleChangeImage = () => {
        if (!this.refBrowse.current.files || !this.refBrowse.current.files.length) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const { targetToCrop } = this.state;
            this.setState({
                targetToCrop: {
                    ...targetToCrop,
                    info: {
                        ...targetToCrop.info,
                        image: reader.result,
                    },
                },
            });
        };

        reader.readAsDataURL(this.refBrowse.current.files[0]);
    };

    handleSaveImage = (image) => {
        const { targetToCrop } = this.state;
        let imageArray = this.state.productImages;
        let that = this;
        if (targetToCrop.index === 0) {
            that.setState({ coverImage: image });
        } else if (targetToCrop.index === 1) {
            that.setState({ logoImage: image });
        } else {
            let index = targetToCrop.index - 2;

            if (imageArray.length <= index) {
                imageArray.push(image);
            } else {
                imageArray[index] = image;
            }
            that.setState({ productImages: imageArray });
        }

        that.setState({ targetToCrop: null });
    };

    handleCropCancel = () => {
        this.setState({ targetToCrop: null });
    };

    handleChangeIntroLang = (selectedIntroLang) => {
        this.setState({ selectedIntroLang });
    };

    handleChangeWhatDoLang = (selectedWhatDoLang) => {
        this.setState({ selectedWhatDoLang });
    };

    getTextLength = (e) => {
        console.log(e);
        return e && e.value.length;
    };

    handleChangeText = (e) => {
        if (e.target === this.refIntro.current) {
            this.setState({ introLength: e.target.value.length });
        } else if (e.target === this.refIntroIt.current) {
            this.setState({ introItLength: e.target.value.length });
        } else if (e.target === this.refWhatWeDo.current) {
            this.setState({
                whatWeDoLength: e.target.value.length,
            });
        } else if (e.target === this.refWhatWeDoIt.current) {
            this.setState({
                whatWeDoItLength: e.target.value.length,
            });
        }
    };

    render() {
        const {
            selectedTab,
            selectedISO,
            selectedType,
            tags,
            suggestions,
            tagsPlaceholder,
            targetToCrop,
            coverImage,
            logoImage,
            productImages,
            isProcessing,
            selectedIntroLang,
            selectedWhatDoLang,
            introLength,
            introItLength,
            whatWeDoLength,
            whatWeDoItLength,
        } = this.state;

        const { profile } = this.props;

        const btnSave = (
            <div className="d-flex justify-content-end mt-4 pb-2">
                <button style={{ minWidth: 140 }} onClick={this.handleClickSave}>
                    Save
                </button>
            </div>
        );

        const aboutUsPanel = (
            <div className={selectedTab === 0 ? "d-block" : "d-none"} ref={this.aboutUsPanel}>
                <div className="py-2 d-flex align-items-center">
                    Introduction
                    <Lang onChange={this.handleChangeIntroLang} />
                </div>
                <div className={selectedIntroLang === 2 ? "d-block" : "d-none"}>
                    <textarea
                        maxLength={INTRO_MAX_LENGTH}
                        ref={this.refIntro}
                        defaultValue={profile && profile.introduction}
                        onChange={this.handleChangeText}
                    ></textarea>
                    <div className="char-limit">
                        {introLength}/{INTRO_MAX_LENGTH}
                    </div>
                </div>
                <div className={selectedIntroLang === 1 ? "d-block" : "d-none"}>
                    <textarea
                        maxLength={INTRO_MAX_LENGTH}
                        ref={this.refIntroIt}
                        defaultValue={profile && profile.introductionIt}
                        onChange={this.handleChangeText}
                    />
                    <div className="char-limit">
                        {introItLength}/{INTRO_MAX_LENGTH}
                    </div>
                </div>
                <div className="mt-4 mb-2 d-flex align-items-center">
                    What we do
                    <Lang onChange={this.handleChangeWhatDoLang} />
                </div>
                <div>
                    <div className={selectedWhatDoLang === 2 ? "d-block" : "d-none"}>
                        <textarea
                            maxLength={WHATWEDO_MAX_LENGTH}
                            ref={this.refWhatWeDo}
                            defaultValue={profile && profile.whatWeDo}
                            onChange={this.handleChangeText}
                        />
                        <div className="char-limit">
                            {whatWeDoLength}/{WHATWEDO_MAX_LENGTH}
                        </div>
                    </div>
                    <div className={selectedWhatDoLang === 1 ? "d-block" : "d-none"}>
                        <textarea
                            maxLength={WHATWEDO_MAX_LENGTH}
                            ref={this.refWhatWeDoIt}
                            defaultValue={profile && profile.whatWeDoIt}
                            onChange={this.handleChangeText}
                        />
                        <div className="char-limit">
                            {whatWeDoItLength}/{WHATWEDO_MAX_LENGTH}
                        </div>
                    </div>
                </div>
                <hr />
                <div>
                    TAGS
                    <br />
                    <span className="text-small">Select the main keyword that represent your company.</span>
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
                        <input ref={this.refEmployee} defaultValue={profile && profile.employees} />
                    </div>
                    <div className="info-row">
                        <span>Revenues:</span>
                        <input ref={this.refRevenue} defaultValue={profile && profile.revenues} />
                    </div>
                    <div className="info-row">
                        <span>ISO:</span>
                        <MySelect
                            value={selectedISO}
                            isMulti
                            onChange={this.handleISOChange}
                            options={ISO}
                            width={300}
                            borderColor="var(--colorBorder)"
                            menuHeight={154}
                        />
                    </div>
                    <div className="info-row">
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
                {btnSave}
            </div>
        );

        const productsPanel = (
            <div className={`pt-4 ${selectedTab === 1 ? "d-block" : "d-none"}`} ref={this.productsPanel}>
                <div className="info-row">
                    <span>Product name:</span>
                    <input ref={this.refProductName} defaultValue={profile.productName} />
                </div>
                <div>
                    <div className="my-2">Photos:</div>
                    <div className="photos-panel">
                        {productImages.map((image, index) => (
                            <div key={index} className="photo">
                                {/* <div className="d-flex justify-content-center w-100"> */}
                                <img className="mx-auto w-50" src={image} alt="" onClick={() => this.handleBrowseFile(index + 2, IMAGE_PRODUCT)} />
                                {/* </div> */}
                                <button onClick={() => this.handleRemoveProductImage(index)}>
                                    <i className="fa fa-close" />
                                </button>
                            </div>
                        ))}
                        {productImages.length < 3 && (
                            <div
                                className="photo justify-content-center align-items-center"
                                onClick={() => this.handleBrowseFile(productImages.length + 2, IMAGE_PRODUCT)}
                            >
                                <i className="fa fa-upload pr-2" />
                                Upload photo
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-4 mb-2">Details:</div>
                <div>
                    <textarea ref={this.refProductDetail} defaultValue={profile.productDetail} style={{ height: 160 }} />
                </div>
                {btnSave}
            </div>
        );

        const contactsPanel = (
            <div className={`pt-4 ${selectedTab === 2 ? "d-block" : "d-none"}`} ref={this.contactsPanel}>
                <div className="info-row">
                    <span>Address:</span>
                    <input ref={this.refAddress} defaultValue={profile.companyAddress} />
                </div>
                <div className="info-row">
                    <span>Phone:</span>
                    <input ref={this.refPhone} defaultValue={profile.companyPhone} />
                </div>
                <div className="info-row">
                    <span>Website:</span>
                    <input ref={this.refWebsite} defaultValue={profile.website} />
                </div>
                <div className="info-row">
                    <span>Email:</span>
                    <input ref={this.refEmail} defaultValue={profile.companyEmail} />
                </div>
                <div className="info-row">
                    <span>2nd email:</span>
                    <input ref={this.ref2ndEmail} defaultValue={profile.company2ndEmail} />
                </div>
                {btnSave}
            </div>
        );

        return (
            <div className="company-view">
                <div>
                    <div className="cover-image">{coverImage && <img src={coverImage} alt="" />}</div>
                    <div className="logo-image">{logoImage && <img src={logoImage} alt="" />}</div>
                    <button className="secondary btn-change-logo" onClick={() => this.handleBrowseFile(1, IMAGE_LOGO)}>
                        <i className="fa fa-upload" />
                    </button>
                    <button className="secondary btn-change-cover" onClick={() => this.handleBrowseFile(0, IMAGE_COVER)}>
                        <i className="fa fa-upload pr-2" />
                        Choose system photo
                    </button>
                </div>
                <div className="info-panel">
                    <div className="tab-header">
                        {SUB_MENUS.map((menu, index) => (
                            <button key={index} className={`tab-item ${selectedTab === index ? "active" : ""}`} onClick={() => this.handleChangeTab(index)}>
                                {menu}
                            </button>
                        ))}
                    </div>
                    <div className="tab-body">
                        {aboutUsPanel}
                        {productsPanel}
                        {contactsPanel}
                    </div>
                </div>
                {targetToCrop && targetToCrop.info && targetToCrop.info.image && (
                    <ImageCropper options={targetToCrop.info} onSave={this.handleSaveImage} onCancel={this.handleCropCancel} />
                )}
                <input type="file" onChange={this.handleChangeImage} className="d-none" ref={this.refBrowse} accept="image/*" />
                {isProcessing && <SpinnerView />}
            </div>
        );
    }
}
