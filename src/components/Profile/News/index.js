import React, { Component } from "react";
import "./index.css";
import PostItem from "../../PostItem";
import { requestAPI } from "../../../utils/api";
import { LOGGED_USER } from "../../../utils";
import SpinnerView from "../../SpinnerView";
// import { scaleImage } from "../../../utils/ImageProcess";
import * as Validate from "../../../utils/Validate";
import { Alert } from "react-bootstrap";
import ImageCropper from "../../ImageCropper";

const MAX_LENGTH = 140;

export default class ProfileNews extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photoFileName: "No image choosed",
            photoData: null,
            posts: props.posts,
            isProcessing: false,
            alertData: null,
            imageToCrop: null,
            lengthOfDescription: 0,
        };

        this.refBrowse = React.createRef();
        this.refTitle = React.createRef();
        this.refDescription = React.createRef();
    }

    setAlertData = (success, text) => {
        this.setState({
            showAlert: true,
            alertData: {
                variant: success ? "success" : "danger",
                text: text,
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
        let valid = Validate.checkEmpty(this.refTitle.current.value);
        Validate.applyToInput(this.refTitle.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "Title" + valid.msg);
            return false;
        }

        valid = Validate.checkEmpty(this.refDescription.current.value);
        Validate.applyToInput(this.refDescription.current, valid.code);
        if (valid.code !== Validate.VALID) {
            this.setAlertData(0, "Description" + valid.msg);
            return false;
        }

        return true;
    };

    handleClickPublish = async (e) => {
        if (this.validate()) {
            let dataToSave = {
                userId: this.props.userId,
                title: this.refTitle.current.value,
                description: this.refDescription.current.value,
                photo: this.state.photoData,
            };

            console.log(dataToSave);
            this.setState({ isProcessing: true });
            await requestAPI("/user/news/create", "POST", dataToSave).then((res) => {
                if (res.status === 1) {
                    let posts = [...this.state.posts, res.data];
                    this.updatePosts(posts);
                    console.log(res.data);
                } else {
                    console.log("Error occured!");
                }
                this.setState({ isProcessing: false });
            });
        }
    };

    handleDeleteNews = async (post) => {
        if (window.confirm("Do you really want to remove?")) {
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
                    alert("An error occured due to delete.");
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
        this.refTitle.current.style.border = this.refDescription.current.style.border = "1px solid var(--colorBorder)";
        this.setState({ alertData: null });
    };

    handleChangeDescription = (e) => {
        this.setState({ lengthOfDescription: e.target.value.length });
    };

    render() {
        const { photoFileName, posts, isProcessing, alertData, imageToCrop, lengthOfDescription } = this.state;
        return (
            <div className="news-view">
                {alertData ? <Alert variant={alertData.variant}>{alertData.text}</Alert> : <div></div>}
                <div className="mb-2 text-bold text-uppercase text-large">Make a post</div>
                <div className="mt-3 mb-1">Title</div>
                <div>
                    <input className="w-100" ref={this.refTitle} onFocus={this.handleFocusInput} />
                </div>
                <div className="mt-3 mb-1">What is new</div>
                <div className="mb-2">
                    <textarea ref={this.refDescription} onFocus={this.handleFocusInput} maxLength={MAX_LENGTH} onChange={this.handleChangeDescription} />
                    <div className="char-limit">
                        {lengthOfDescription}/{MAX_LENGTH}
                    </div>
                </div>
                <div>
                    <button className="secondary btn-photo" onClick={this.handleClickPhoto}>
                        <input type="file" onChange={this.handleChangeImage} style={{ display: "none" }} ref={this.refBrowse} accept="image/*" />
                        <i className="fa fa-upload pr-2" />
                        Upload a photo
                    </button>
                    <span className="pl-2">{photoFileName}</span>
                    <button className="float-right" style={{ minWidth: 160 }} onClick={this.handleClickPublish}>
                        Publish
                    </button>
                </div>
                <div className="mt-5 text-bold text-uppercase text-large">Previous posts</div>
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
