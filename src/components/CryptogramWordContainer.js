import React from "react";

import CryptogramCharInputContainer from "./CryptogramCharInputContainer";

const CryptogramWordContainer = props => {
	const { word, handleCharChange, guess, charKey, letterValues } = props;
	const charArray = word.split("");

	let tempArray = charArray.map((char, index) => {
		return (
			<CryptogramCharInputContainer
				type={"char"}
				char={char}
				index={`${props.index}-${index}`}
				key={index}
				handleCharChange={handleCharChange}
				guess={guess}
				charKey={charKey}
				letterValues={letterValues}
			/>
		);
	});

	return <div className="wordContainer">{tempArray}</div>;
};

export default CryptogramWordContainer;
