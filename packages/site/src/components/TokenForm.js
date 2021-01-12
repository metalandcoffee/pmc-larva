import { Link } from "react-router-dom";

import React, { Fragment } from "react";
import { TokenListItem } from "./TokenListItem";

export const TokenForm = ({
	action,
	tokens,
	coreColorTokens,
	brandName,
	updateTokenValue,
	saveJsonToFile,
	copyText,
}) => {
	const Tokens = () => {
		const tokensArr = [];

		for (const token in tokens) {
			tokensArr.push(
				<div
					className="lrv-u-display-block lrv-u-margin-b-1"
					key={token}
				>
					<TokenListItem
						key={token}
						tokenName={token}
						tokenData={tokens[token]}
						updateTokenValue={updateTokenValue}
					/>
				</div>
			);
		}

		return tokensArr;
	};

	const CoreColorTokens = () => {
		const coreColorsArr = [];

		for ( const color in coreColorTokens ) {
			coreColorsArr.push(
				<TokenListItem
					key={color}
					tokenName={color}
					tokenData={coreColorTokens[color]}
					updateTokenValue={updateTokenValue}
				/>
			);
		}

		return coreColorsArr;
	};

	const Header = () => {
		const headingText = "create" === action ? "Creating New " : "Updating ";

		if (!!brandName) {
			return (
				<Fragment>
					<h2 className="lrv-u-padding-b-2">
						{headingText} Tokens for{" "}
						<code className="lrv-u-background-color-grey-dark lrv-u-color-white lrv-u-border-radius-5 lrv-u-padding-tb-025 lrv-u-padding-lr-050">
							{brandName}
						</code>
					</h2>
				</Fragment>
			);
		}

		return (
			<Fragment>
				<h2 className="lrv-u-padding-b-2">
					Oops! You need to specify a brand and action on the initial
					tokens form.
				</h2>
				<Link
					className="lrv-u-display-inline-block ui button primary"
					to="/tokens"
				>
					Back to Initial Tokens Form
				</Link>
			</Fragment>
		);
	};

	return (
		<Fragment>
			<div className="lrv-a-grid lrv-a-cols3">
				<section className="lrv-a-span2">
					<Header />

					<h3 className="lrv-u-margin-b-1">Core Colors</h3>
					<p>These colors are repeated </p>
					<ul className="lrv-a-unstyle-list">
						{tokens && <CoreColorTokens />}
					</ul>
					<h3 className="lrv-u-margin-b-1">Tokens</h3>
					<ul className="lrv-a-unstyle-list">
						{tokens && <Tokens />}
					</ul>
				</section>
				<section className="lrv-u-width-100p lrv-u-overflow-auto">
					{tokens && (
						<div className="lrv-a-glue-parent lrv-u-margin-b-2">
							<div className="lrv-u-background-color-grey-lightest lrv-u-border-a-2 lrv-u-border-radius-5 lrv-u-padding-a-1">
								<h3 className="lrv-u-margin-b-1">
									When you are finished...
								</h3>
								<p>
									Press the button below to copy the JSON to
									your clipboard.
								</p>
								<p>
									Next, send this JSON to the engineer or
									product manager who requested it.
								</p>
								<button
									className="ui button primary"
									onClick={saveJsonToFile}
								>
									{copyText}
								</button>
							</div>
						</div>
					)}
				</section>
			</div>
		</Fragment>
	);
};
