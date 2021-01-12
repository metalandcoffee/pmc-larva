import { useState } from "react";

export const TokenListItem = ({ tokenName, tokenData, updateTokenValue }) => {
	const [tokenPreviewValue, setTokenPreviewValue] = useState(tokenData.value);

	return (
		<li className="lrv-u-display-block lrv-u-margin-b-1" key={tokenName}>
			<div className="ui labeled input">
				<span className="ui label">{tokenName}:</span>
				<br />
				<input
					defaultValue={tokenData.value}
					onChange={(e) => {
						setTokenPreviewValue(e.target.value);
						updateTokenValue(tokenData, e.target.value);
					}}
				/>
				{"color" === tokenData.type ? (
					<div
						className="lrv-u-width-30 lrv-u-border-a-1 lrv-u-margin-l-050"
						style={{ backgroundColor: tokenPreviewValue }}
					></div>
				) : (
					""
				)}
			</div>
		</li>
	);
};