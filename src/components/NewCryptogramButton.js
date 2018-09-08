import React from "react";

const NewCryptogramButton = props => {
	return (
		<button className="btn" onClick={props.onClick}>
			{props.content}
		</button>
	);
};

export default NewCryptogramButton;
