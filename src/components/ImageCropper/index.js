import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./index.css";

export default class ImageCropper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            crop: {
                unit: "%",
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                aspect: props.aspect
            }
        };
    }

    componentDidMount = () => {
        // const { src } = this.props;
        // let image = new Image();
        // image.src = src;
        // image.onload = () => {
        //     let elem = document.querySelector(".-content");
        //     const scaleX = image.width / (elem.offsetWidth - 60);
        //     const imageHeight = image.height / scaleX;
        //     if (imageHeight > elem.offsetHeight) {
        //         console.log(imageHeight, elem.offsetHeight);
        //     }
        //     elem.style.maxWidth = image.width / 2 + "px";
        // };
    };

    handleCropChange = crop => {
        this.setState({ crop });
    };

    getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        let elem = document.querySelector(".ReactCrop");

        const scaleX = image.naturalWidth / elem.offsetWidth;
        const scaleY = image.naturalHeight / elem.offsetHeight;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        // As Base64 string
        // const base64Image = canvas.toDataURL('image/jpeg');

        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    blob.name = fileName;
                    resolve(blob);
                },
                "image/jpeg",
                1
            );
        });
    };

    handleSaveImage = async () => {
        const { src, onSave } = this.props;
        const { crop } = this.state;
        let image = new Image();
        image.src = src;
        let croppedImage = await this.getCroppedImg(image, crop, "temp.jpg");
        onSave(URL.createObjectURL(croppedImage));
    };

    render() {
        const { src, onCancel } = this.props;
        return (
            <div className="cropper-modal">
                <div className="-content">
                    <h5 className="mb-3">Crop image</h5>
                    <ReactCrop
                        src={src}
                        crop={this.state.crop}
                        onChange={this.handleCropChange}
                    />
                    <div className="mt-2 d-flex justify-content-end">
                        <button className="mr-2" onClick={this.handleSaveImage}>
                            Save
                        </button>
                        <button onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
