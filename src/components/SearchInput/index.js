import React, { Component } from "react";
import "./index.css";

export default class SearchInput extends Component {
	constructor(props) {
		super(props);
		this.keyword = null;
		this.input = React.createRef();
	}

	handleKeyPress = e => {
		if (e.key === "Enter") {
			if (this.props.handleSearch) {
				this.props.handleSearch(e.target.value);
			}
		}
	};

	setInputValue = value => {
		this.input.current.value = value;
	};

	handleChange = e => {
		this.keyword = e.target.value;
	};

	render() {
		return (
			<div className="search-input">
				<i className="fa fa-search"></i>
				<input
					type="text"
					placeholder="Company search"
					onKeyPress={this.handleKeyPress}
					onChange={this.handleChange}
					ref={this.input}
				/>
			</div>
		);
	}
}
