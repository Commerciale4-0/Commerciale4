import React, { Component } from "react";
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default class CompanyDetailProduct extends Component {
	render() {
		const { company } = this.props;
		return (
			<div className="detail-product">
				<Carousel
					showStatus={false}
					showThumbs={false}
					infiniteLoop={true}
					autoPlay={true}
				>
					<img src="/images/slider/slide1.jpg" alt="" />
					<img src="/images/slider/slide2.jpg" alt="" />
					<img src="/images/slider/slide3.jpg" alt="" />
				</Carousel>
				<h5 className="mt-4 mb-2">Details</h5>
				<p>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
					diam nonumy eirmod tempor invidunt ut labore et dolore magna
					aliquyam erat, sed diam voluptua. At vero eos et accusam et
					justo duo dolores et ea rebum. Stet clita kasd gubergren, no
					sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
					ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
					nonumy eirmod tempor invidunt ut labore et dolore magna
					aliquyam erat, sed diam voluptua. At vero eos et accusam et
					justo duo dolores et ea rebum. Stet clita kasd gubergren, no
					sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
			</div>
		);
	}
}
