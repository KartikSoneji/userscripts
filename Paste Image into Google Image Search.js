// ==UserScript==
// @name		Paste Image into Google Image Search
// @description	Performs a reverse Google Image Search with the image from the clipboard.
// @license		MIT
// @version		1.0
// @supportURL	https://github.com/KartikSoneji/userscripts/issues
// @updateURL	https://openuserjs.org/meta/KartikSoneji/Paste_Image_into_Google_Image_Search.meta.js
// @downloadURL	https://openuserjs.org/install/KartikSoneji/Paste_Image_into_Google_Image_Search.user.js
// @match		https://www.google.com/search*tbm=isch*
// @match		https://www.google.com/imghp*
// @match		https://images.google.com/*
// @run-at		document-end
// @grant		none
// ==/UserScript==

(function(){
	'use strict';
	
	document.querySelector("input[title=\"Search\"]").addEventListener("paste", handlePasteEvent);
	document.querySelector("div[aria-label=\"Search by image\"]").addEventListener("click", () => {
		if(window.LABEL) return;
		else window.LABEL = true;

		setTimeout(() => document.querySelector("#qbui").addEventListener("paste", handlePasteEvent), 50);
	});

	function handlePasteEvent(e){
		getImageURLFromPasteEvent(e).then(url => searchByImageURL(url)).catch(e => e);
	}

	function searchByImageURL(url){
		window.google.qb.tp();
		window.google.qb.tp(); //Needed twice

		document.querySelector("#qbui").value = url;
		document.querySelector("#qbbtc > input").click();
	}

	function getImageURLFromPasteEvent(e){
		for(let i of e.clipboardData.items)
			if(i.type.indexOf("image") > -1)
				return getBase64(i.getAsFile());

		throw "No Image on clipboard";
	}

	async function getBase64(file){
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
				if(encoded.length % 4 > 0)
					encoded += '='.repeat(4 - (encoded.length % 4));
				resolve(reader.result);
			};
			reader.onerror = reject;
		});
	}
})();
