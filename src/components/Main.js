import React, { Component } from "react";
import axios from "axios";

import NewCryptogramButton from "./NewCryptogramButton";
import CryptogramWordContainer from "./CryptogramWordContainer";

import shuffleKnuth from "../services/shuffleKnuth";

class Main extends Component {
	state = {
		url: "https://talaikis.com/api/quotes/random/",
		defaultLetterPosition: [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z"
		],
		cryptogramQuote: [],
		activeLetter: "",
		letterValues: {},
		initialLoading: true
	};

	componentDidMount() {
		this.generateNewQuote();
	}

	generateNewQuote = async () => {
		this.setState({
			solved: false,
			error: false,
			letterValues: {},
			activeLetter: "",
			activeKey: ""
		});
		const response = await axios.get(this.state.url);
		let { quote } = response.data;
		quote = quote.toUpperCase();
		const lettersUsed = this.getLettersUsed(quote);
		this.setState({ quote, lettersUsed }, this.randomSeed);
	};

	getLettersUsed = quote => {
		// Removes all non A-Z characters including whitespace, numbers, etc.
		quote = quote.replace(/[^A-Za-z]/g, "");

		let lettersUsed = [];
		for (let i = 0; i < quote.length; i++) {
			let char = quote.charAt(i);
			if (!lettersUsed.includes(char)) {
				lettersUsed.push(char);
			}
		}
		return lettersUsed;
	};

	// Generates a new array of letters shuffled by the Knuth algo
	randomSeed = () => {
		let newLetterPosition = shuffleKnuth(this.state.defaultLetterPosition);
		this.setState({ newLetterPosition }, this.generateCryptoArray);
	};

	generateCryptoArray = () => {
		let quoteWordArray = this.state.quote.split(" ");
		// let quoteArray = this.state.quote.split("");

		let cryptoWordArray = quoteWordArray.map(word => {
			let tempWordArray = word.split("");
			let cipherWord = tempWordArray.map(char => {
				let charCode = char.charCodeAt(0);
				if (charCode > 64 && charCode < 91) {
					let charPos = this.state.defaultLetterPosition.indexOf(char);

					let convertedChar = this.state.newLetterPosition[charPos];

					return convertedChar;
				} else {
					return char;
				}
			});
			return cipherWord.join("");
		});
		this.setState({ cryptogramQuote: cryptoWordArray, initialLoading: false });
	};

	handleSubmit = event => {
		event.preventDefault();

		let error = false;

		const {
			lettersUsed,
			newLetterPosition,
			defaultLetterPosition,
			letterValues
		} = this.state;

		// Compares each letter used in the original quote to its ciphered letter
		// in order to assure the inputs match the original quote without
		// having to loop through each input
		lettersUsed.forEach(letter => {
			let index = defaultLetterPosition.findIndex(char => char === letter);
			let result = newLetterPosition[index];
			if (letterValues[result] !== letter) {
				error = true;
				this.setState({ error: true, solved: false });
			}
		});

		if (!error) {
			this.setState({ solved: true, error: false });
		}
	};

	handleCharChange = (char, guess) => {
		char = char.toUpperCase();
		this.setState({
			letterValues: { ...this.state.letterValues, [guess]: char },
			activeLetter: char,
			activeKey: guess
		});
	};

	render() {
		let cryptogramWordQuote = this.state.cryptogramQuote.map((word, index) => {
			return (
				<CryptogramWordContainer
					word={word}
					index={index}
					key={index}
					handleCharChange={this.handleCharChange}
					guess={this.state.activeLetter}
					charKey={this.state.activeKey}
					letterValues={this.state.letterValues}
				/>
			);
		});

		if (this.state.initialLoading) {
			return <div />;
		} else {
			return (
				<div className="main-container">
					<div className="btn-container">
						<NewCryptogramButton
							content="New Cryptogram"
							onClick={this.generateNewQuote}
						/>
					</div>
					<form className="cryptogramForm" onSubmit={this.handleSubmit}>
						<div className="cryptogramContainer">{cryptogramWordQuote}</div>
						{this.state.error && (
							<p className="error-container">Your solution is incorrect</p>
						)}
						{this.state.solved && (
							<p className="solved-container">Your solution is correct</p>
						)}
						<div className="btn-container btn-container__center">
							<button
								className="btn btn-margin-bottom"
								onClick={this.handleSubmit}
							>
								Check Answer
							</button>
						</div>
					</form>
				</div>
			);
		}
	}
}

export default Main;
