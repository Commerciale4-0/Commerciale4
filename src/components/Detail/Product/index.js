import React, { Component } from "react";
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default class CompanyDetailProduct extends Component {
    render() {
        const { profile } = this.props;

        return (
            <div className="detail-product">
                <h5 className="text-dark-light mb-4 text-uppercase text-center">{profile && profile.user.productName}</h5>
                {profile && profile.user.productPhotos && profile.user.productPhotos.length ? (
                    profile.user.productPhotos.length > 1 ? (
                        <div>
                            <Carousel showStatus={false} showThumbs={false} infiniteLoop={true} autoPlay={true}>
                                {profile.user.productPhotos.map((photo, index) => (
                                    <img src={process.env.REACT_APP_AWS_PREFIX + photo} key={index} alt="" />
                                ))}
                            </Carousel>
                        </div>
                    ) : (
                        <div>
                            <img className="carousel" src={process.env.REACT_APP_AWS_PREFIX + profile.user.productPhotos[0]} alt="" />
                        </div>
                    )
                ) : (
                    <div />
                )}

                <p className="text-uppercase text-dark-light text-bold mt-4 mb-2">Details</p>
                <p className="font-15">{profile && profile.user.productDetail}</p>
            </div>
        );
    }
}
