import React, { Component } from "react";
import TextareaAutosize from "react-autosize-textarea";
import "./index.css";
import PostItem from "../../PostItem";
import { requestAPI } from "../../../utils/api";
import { LOGGED_USER } from "../../../utils";
import SpinnerView from "../../SpinnerView";
// import { scaleImage } from "../../../utils/ImageProcess";
import * as Validate from "../../../utils/Validate";
import { Alert } from "react-bootstrap";
import ImageCropper from "../../ImageCropper";
import { STRINGS } from "../../../utils/strings";
import Lang from "../../Lang";
const MAX_LENGTH = 300;

export default class ProfileNews extends Component {
    constructor(props) {
        super(props);
        let lang = sessionStorage.getItem("lang");
        this.state = {
            photoFileName: null,
            photoData: null,
            posts: props.posts,
            isProcessing: false,
            alertData: null,
            imageToCrop: null,
            lengthOfDescription: 0,
            selectedLang: lang ? lang : "en",
        };

        this.refBrowse = React.createRef();
        this.refTitle = React.createRef();
        this.refTitleIt = React.createRef();
        this.refDescription = React.createRef();
        this.refDescriptionIt = React.createRef();
    }

    setAlertData = (success, messages) => {
        this.setState({
            showAlert: true,
            alertData: {
                variant: success ? "success" : "danger",
                messages: messages,
            },
        });
    };

    updatePosts = (posts) => {
        this.setState({ posts });
        let loggedUser = JSON.parse(sessionStorage.getItem(LOGGED_USER));

        let newData = {
            ...loggedUser,
            posts: posts,
        };
        sessionStorage.setItem(LOGGED_USER, JSON.stringify(newData));
    };

    handleClickPhoto = (e) => {
        this.refBrowse.current.click();
    };

    validate = () => {
        let inputTitle = this.state.selectedLang === "en" ? this.refTitle.current : this.refTitleIt.current;
        let inputDescription = this.state.selectedLang === "en" ? this.refDescription.current : this.refDescriptionIt.current;

        let valid = Validate.checkEmpty(inputTitle.value);
        Validate.applyToInput(inputTitle, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, [{ langKey: "title" }, { validCode: valid.code }]);
            return false;
        }
        valid = Validate.checkEmpty(inputDescription.value);
        Validate.applyToInput(inputDescription, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, [{ langKey: "description" }, { validCode: valid.code }]);
            return false;
        }

        return true;
    };

    handleClickPublish = async (e) => {
        if (this.validate()) {
            let dataToSave = {
                userId: this.props.userId,
                title: this.refTitle.current.value,
                titleIt: this.refTitleIt.current.value,
                description: this.refDescription.current.value,
                descriptionIt: this.refDescriptionIt.current.value,
                photo: this.state.photoData,
            };

            this.setState({ isProcessing: true });
            await requestAPI("/user/news/create", "POST", dataToSave).then((res) => {
                if (res.status === 1) {
                    let posts = [...this.state.posts, res.data];
                    this.updatePosts(posts);
                } else {
                    alert(STRINGS.connectionFailed);
                    console.log("Error occured!");
                }
                this.setState({ isProcessing: false });
            });
        }
    };

    handleDeleteNews = async (post) => {
        if (window.confirm(STRINGS.wantToDelete)) {
            let data = {
                id: post.id,
                photo: post.photo,
            };

            this.setState({ isProcessing: true });
            await requestAPI("/user/news/delete", "POST", data).then((res) => {
                if (res.status === 1) {
                    const { posts } = this.state;
                    posts.splice(
                        posts.findIndex((item) => item.id === post.id),
                        1
                    );
                    this.updatePosts(posts);
                } else {
                    alert(STRINGS.errorOccuredDelete);
                }
                this.setState({ isProcessing: false });
            });
        }
    };

    handleChangeImage = (e) => {
        if (!e.target.files || !e.target.files.length) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () => {
            this.setState({
                imageToCrop: {
                    ratio: 1,
                    maxWidth: 600,
                    image: reader.result,
                },
            });
            // let image = new Image();
            // image.onload = () => {
            // 	let scaledImage = scaleImage(image, 800);
            // 	this.setState({ photoData: scaledImage });
            // };
            // image.src = reader.result;
        };
    };

    handleImageCropped = (image) => {
        if (this.refBrowse.current.files && this.refBrowse.current.files.length) {
            this.setState({
                photoFileName: this.refBrowse.current.files[0].name,
            });
        }
        this.setState({ photoData: image, imageToCrop: null });
    };

    handleCropCancelled = () => {
        this.setState({ imageToCrop: null });
    };

    handleFocusInput = () => {
        if (this.state.selectedLang === "en") {
            this.refTitle.current.style.border = this.refDescription.current.style.border = "1px solid var(--colorBorder)";
        } else {
            this.refTitleIt.current.style.border = this.refDescriptionIt.current.style.border = "1px solid var(--colorBorder)";
        }
        this.setState({ alertData: null });
    };

    handleChangeDescription = (e) => {
        this.setState({ lengthOfDescription: e.target.value.length });
    };

    handleChangeLang = (selectedLang) => {
        this.setState({ selectedLang });
        this.handleFocusInput();
    };
    render() {
        const { photoFileName, posts, isProcessing, alertData, imageToCrop, lengthOfDescription, selectedLang } = this.state;
        return (
            <div className="news-view">
                {alertData ? <Alert variant={alertData.variant}>{Validate.getAlertMsg(alertData.messages)}</Alert> : <div></div>}
                <div className="float-right">
                    <Lang onChange={this.handleChangeLang} />
                </div>
                <div className="mb-2 text-bold text-uppercase text-large">{STRINGS.makePost}</div>
                <div className="mt-3 mb-1">{STRINGS.title}</div>
                <div className={selectedLang === "en" ? "d-block" : "d-none"}>
                    <input className="w-100" ref={this.refTitle} onFocus={this.handleFocusInput} />
                </div>
                <div className={selectedLang === "it" ? "d-block" : "d-none"}>
                    <input className="w-100" ref={this.refTitleIt} onFocus={this.handleFocusInput} />
                </div>
                <div className="mt-3 mb-1">{STRINGS.whatIsNew}</div>
                <div className="mb-2">
                    <div className={selectedLang === "en" ? "d-block" : "d-none"}>
                        <TextareaAutosize
                            ref={this.refDescription}
                            onFocus={this.handleFocusInput}
                            maxLength={MAX_LENGTH}
                            onChange={this.handleChangeDescription}
                            style={{ maxHeight: 200 }}
                        />
                        <div className="char-limit">
                            {lengthOfDescription}/{MAX_LENGTH}
                        </div>
                    </div>
                    <div className={selectedLang === "it" ? "d-block" : "d-none"}>
                        <TextareaAutosize
                            ref={this.refDescriptionIt}
                            onFocus={this.handleFocusInput}
                            maxLength={MAX_LENGTH}
                            onChange={this.handleChangeDescription}
                            style={{ maxHeight: 200 }}
                        />
                        <div className="char-limit">
                            {lengthOfDescription}/{MAX_LENGTH}
                        </div>
                    </div>
                </div>

                <div>
                    <button className="secondary btn-photo" onClick={this.handleClickPhoto}>
                        <input type="file" onChange={this.handleChangeImage} style={{ display: "none" }} ref={this.refBrowse} accept="image/*" />
                        <i className="fa fa-upload pr-2" />
                        {STRINGS.uploadPhoto}
                    </button>
                    <span className="pl-2">{photoFileName ? photoFileName : STRINGS.noImageChoosed}</span>
                    <button className="float-right" style={{ minWidth: 160 }} onClick={this.handleClickPublish}>
                        {STRINGS.publish}
                    </button>
                </div>
                <div className="mt-5 text-bold text-uppercase text-large">{STRINGS.previousNews}</div>
                <hr className="mt-2 mb-3" />
                <div>
                    {posts.map((post, index) => (
                        <PostItem key={index} data={post} handleDelete={() => this.handleDeleteNews(post)} />
                    ))}
                </div>
                {imageToCrop && imageToCrop.image && <ImageCropper options={imageToCrop} onSave={this.handleImageCropped} onCancel={this.handleCropCancelled} />}
                {isProcessing && <SpinnerView />}
            </div>
        );
    }
}
