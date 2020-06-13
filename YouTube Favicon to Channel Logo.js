// ==UserScript==
// @name		YouTube Favicon to Channel logo
// @version		1.1
// @description	Changes the YouTube Favicon to the Channel Logo
// @author		Kartik Soneji
// @updateURL	https://openuserjs.org/meta/KartikSoneji/YouTube_Favicon_to_Channel_logo.meta.js
// @supportURL	https://gitlab.com/KartikSoneji/userscripts/issues
// @match		https://www.youtube.com/*
// @exclude		https://www.youtube.com/
// @exclude		https://www.youtube.com/tv*
// @exclude		https://www.youtube.com/embed/*
// @exclude		https://www.youtube.com/live_chat*
// @grant		none
// @run-at		document-end
// @grant		none
// @license		GPL-3.0-or-later
// @noframes
// ==/UserScript==


(function(){
	'use strict';

	const urlRegex = /https:\/\/yt3.ggpht.com\/a[/-]{1,2}[a-zA-Z\d-_]+/;

	console.log("Started");

	function run(){
		getChannelLogo(window.location.href).then(setRoundFavicon);
	}

	window.addEventListener("load", () => {
		setRoundFavicon(JSON.stringify(window.ytInitialData).match(urlRegex)[0]);

		let observer = new MutationObserver(e => setTimeout(run, 150));
		observer.observe(document.querySelector("title"), {
			childList: true,
			attributes: true,
			characterData: true
		});
	});

	async function getChannelLogo(url){
		return fetch(url)
			.then(e => e.text())
			.then(e => {
				let u = e.match(urlRegex)[0];
				console.log("Favicon:", u);
				return u;
			});
	}

	function setRoundFavicon(dataUrl){
		roundImageToDataUrl(dataUrl).then(setFavicon);
	}

	async function roundImageToDataUrl(url){
		return new Promise((resolve, reject) => {
			if(url.src)
				url = url.src;

			let img = new Image();
			img.crossOrigin = "anonymous";
			img.src = url;

			img.onload = function(){
				let canvas = document.createElement("canvas"),
					g = canvas.getContext("2d");

				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;

				g.beginPath();
				g.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2);
				g.clip();

				g.drawImage(img, 0, 0);

				resolve(canvas.toDataURL());
			}
		});
	}

	function setFavicon(url){
		let a = document.querySelectorAll("link[rel *= icon]");

		if(a.length == 0){
			let link = document.createElement("link");
			link.type = "image/x-icon";
			link.rel = "icon";
			document.head.appendChild(link);
			a = [link];
		}

		for(let i of a)
			i.href = url;
	}
})();
