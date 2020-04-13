import React, { Component } from "react";
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { STRINGS } from "../../../utils/strings";
import { LangConsumer } from "../../../utils/LanguageContext";

export default class CompanyDetailProduct extends Component {
    render() {
        const { profile } = this.props;

        return (
            <LangConsumer>
                {(context) => (
                    <div className="detail-product">
                        <h5 className="text-dark-light mb-4 text-uppercase text-center">
                            {profile &&
                                (context.lang === "en"
                                    ? profile.user.productName
                                        ? profile.user.productName
                                        : profile.user.productNameIt
                                    : profile.user.productNameIt
                                    ? profile.user.productNameIt
                                    : profile.user.productName)}
                        </h5>
                        {profile && profile.user.productPhotos && profile.user.productPhotos.length ? (
                            profile.user.productPhotos.length > 1 ? (
                                <div className="d-flex justify-content-center">
                                    <div className="slide-container">
                                        <Carousel showStatus={false} showThumbs={false} infiniteLoop={true}>
                                            {profile.user.productPhotos.map((photo, index) => (
                                                <img src={process.env.REACT_APP_AWS_PREFIX + photo} key={index} alt="" />
                                            ))}
                                        </Carousel>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center">
                                    <div className="slide-container">
                                        <img className="carousel" src={process.env.REACT_APP_AWS_PREFIX + profile.user.productPhotos[0]} alt="" />
                                    </div>
                                </div>
                            )
                        ) : (
                            <div />
                        )}

                        <p className="text-uppercase text-dark-light text-bold mt-4 mb-2">{STRINGS.details}</p>
                        <p className="font-15">
                            {profile &&
                                (context.lang === "en"
                                    ? profile.user.productDetail
                                        ? profile.user.productDetail
                                        : profile.user.productDetailIt
                                    : profile.user.productDetailIt
                                    ? profile.user.productDetailIt
                                    : profile.user.productDetail)}
                        </p>
                    </div>
                )}
            </LangConsumer>
        );
    }
}
