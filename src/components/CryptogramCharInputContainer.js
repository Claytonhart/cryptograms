import React, { Component } from "react";

import CryptogramChar from "./CryptogramChar";
import CryptogramSpace from "./CryptogramSpace";

class CryptogramCharInputContainer extends Component {
	handleChange = event => {
		let value = event.target.value.toUpperCase();
		this.props.handleCharChange(value, this.props.char);
	};

	render() {
		const { type, char, index, guess, charKey, letterValues } = this.props;
		const charCode = char.charCodeAt(0);
		let valueChange;

		// Allow each input to assign itself to a changed value,
		// or fallback on a stored letterValue if it has already been given an input,
		// or remain empty if neither has happened
		if (char === charKey) {
			valueChange = guess;
		}

		// letters display with open input, all non charcode 65-90 display with
		// predetermined input, as they are not part of the cipher
		if (type === "char" && (charCode > 64 && charCode < 91)) {
			return (
				<div className="charContainer">
					<input
						className="charInput"
						type="text"
						value={valueChange || letterValues[char] || ""}
						onChange={this.handleChange}
					/>
					<CryptogramChar char={char} key={index} />
				</div>
			);
		} else {
			return (
				<div className="charContainer">
					<CryptogramSpace char={char} />
					<CryptogramSpace char={char} />
				</div>
			);
		}
	}
}

export default CryptogramCharInputContainer;
