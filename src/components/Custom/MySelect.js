import React, { Component } from "react";
import Select from "react-select";

export default class MySelect extends Component {
	render() {
		const {
			value,
			onChange,
			options,
			placeholder,
			checkValid,
			width,
			borderColor,
			menuHeight
		} = this.props;

		const styles = {
			control: (provided, state) => ({
				...provided,
				borderRadius: 4,
				background: borderColor ? "#f9f9f9" : "#eee",
				width: width ? width : "auto",
				borderColor: state.isFocused
					? "var(--colorPrimary)"
					: checkValid !== true || value
					? borderColor
						? borderColor
						: "transparent"
					: "red",
				"&:hover": {
					borderColor: state.isFocused
						? "var(--colorPrimary)"
						: checkValid !== true || value
						? borderColor
							? borderColor
							: "transparent"
						: "red"
				}
			}),
			indicatorSeparator: () => ({
				display: "none"
			}),
			// menu: provided => ({
			// 	...provided,
			// 	position: extendMenu ? "relative" : "absolute"
			// }),
			menuList: provided => ({
				...provided,
				// maxHeight: menuHeight ? menuHeight : provided.maxHeight
				maxHeight: menuHeight ? menuHeight : 200
			})
		};

		return (
			<Select
				styles={styles}
				value={value}
				onChange={onChange}
				options={options}
				placeholder={placeholder}
				theme={theme => ({
					...theme,
					colors: {
						...theme.colors,
						primary: "var(--colorPrimary)"
					}
				})}
			/>
		);
	}
}
