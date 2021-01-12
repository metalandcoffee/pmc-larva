import { Route, Switch, useRouteMatch } from "react-router-dom";

import React, { useState, useEffect } from "react";
import { TokenForm } from "./TokenForm";
import { InitialForm } from "./InitialForm";
import { getCoreColorsFromTokens } from '../helpers';

export const TokensView = () => {
	let match = useRouteMatch();

	const [selectedBrand, setSelectedBrand] = useState({
		action: "",
		brand: "",
	});

	const supportsshowSaveFilePicker = () =>
		undefined !== window.showSaveFilePicker;

	const [tokens, setTokens] = useState();
	const [copied, setCopied] = useState(false);
	const [copyText, setCopyText] = useState("");
	const [canSaveFile] = useState(supportsshowSaveFilePicker);
	const [coreColorTokens, setCoreColorTokens ] = useState( {} );

	// Handle the updates that are side effects of the
	// check for browser support
	useEffect(() => {
		const beforeText = canSaveFile
			? "Save JSON to File"
			: "Copy JSON to Clipboard";
		const afterText = canSaveFile ? "Saved!" : "Copied!";

		if (copied) {
			setCopyText(afterText);
		} else {
			setCopyText(beforeText);
		}
	}, [copied, copyText, canSaveFile]);

	// Handle updating the tokens state when we update
	// the core colors state to "link" the values.
	useEffect(() => {
		// todo: when coreColorTokens is updated,
		// find all token keys
		// matching those of the coreColorTokens and update them
		// to the coreColorToken value


	}, [tokens, coreColorTokens]);

	const handleUpdateBrand = (brand, action) => {
		setSelectedBrand({
			brand,
			action,
		});
	};

	const updateTokenValue = (tokenData, newValue) => {

		const updateAllTokensWithNewValue = ( tokensObj, updateStateFn ) => {
			tokensObj[tokenData.name].value = newValue;

			updateStateFn( tokensObj );
		};

		if ( tokenData.category !== 'core-color' ) {
			updateAllTokensWithNewValue( tokens, setTokens );
		} else {
			updateAllTokensWithNewValue( coreColorTokens, setCoreColorTokens );
		}
	};

	const fetchAndSetTokens = async (e) => {
		const brand =
			"create" === selectedBrand.action ? "default" : selectedBrand.brand;

		let url =
			"https://raw.githubusercontent.com/penske-media-corp/pmc-larva/master/packages/larva-tokens/build/" +
			brand +
			".raw.json";
		let response = await fetch(url);
		let json = await response.json();
		let tokens = await json.props;
		let sortedKeys = await Object.keys(tokens).sort();
		let sortedTokens = sortedKeys.reduce( ( tokensObj, key ) => {
			tokensObj[key] = tokens[key];
			return tokensObj
		}, {});

		let reducedColorTokens = await getCoreColorsFromTokens( tokens );
		let sortedColorKeys = Object.keys( reducedColorTokens ).sort();
		let sortedColorTokens = sortedColorKeys.reduce( ( sortedColors, key ) => {
			sortedColors[key] = reducedColorTokens[key];
			return sortedColors;
		}, {});

		setCoreColorTokens(sortedColorTokens);
		setTokens(sortedTokens);
	};

	/**
	 * Save JSON to file for browsers that support it, and fallback to
	 * copy to clipboard for browsers that don't.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker
	 */
	const saveJsonToFile = async () => {
		if (canSaveFile) {
			const tokensBlob = new Blob([JSON.stringify(tokens, null, 2)], {
				type: "application/json",
			});

			// create a new handle
			const newHandle = await window.showSaveFilePicker({
				types: [
					{
						name: selectedBrand.brand,
						accept: { "text/json": [".json"] },
					},
				],
			});

			// create a FileSystemWritableFileStream to write to
			const writableStream = await newHandle.createWritable();

			// write our file
			await writableStream.write(tokensBlob);

			// close the file and write the contents to disk.
			await writableStream.close();
		} else {
			await navigator.clipboard.writeText(
				JSON.stringify(tokens, null, 2)
			);
		}

		setCopied(true);
	};

	return (
		<Switch>
			<Route path={`${match.url}/:action`}>
				<TokenForm
					tokens={tokens}
					updateTokenValue={updateTokenValue}
					brandName={selectedBrand.brand}
					action={selectedBrand.action}
					saveJsonToFile={saveJsonToFile}
					copyText={copyText}
					coreColorTokens={coreColorTokens}
					copied={copied}
				/>
			</Route>
			<Route path={`${match.url}`}>
				<InitialForm
					fetchAndSetTokens={fetchAndSetTokens}
					handleUpdateBrand={handleUpdateBrand}
					selectedBrand={selectedBrand}
				/>
			</Route>
		</Switch>
	);
};