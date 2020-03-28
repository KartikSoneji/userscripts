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
// @license		GPL-3.0-or-later
// ==/UserScript==

(function(){
	'use strict';
	
	const urlRegex = /https:\/\/yt3.ggpht.com\/a[/-]{1,2}[A-Za-z\d-_]+/;

	function isInIframe(){
		try{
			return window.self !== window.top;
		}
		catch(e){
			return true;
		}
	}
	if(isInIframe()) return;

	console.log("Started");
	
	setRoundFavicon(JSON.stringify(window.ytInitialData).match(urlRegex)[0]);
	
	function run(){	
		getChannelLogo(window.location.href).then(setRoundFavicon);
	}
	
	async function getChannelLogo(url){
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onload = () =>{
				let u = xhr.responseText.match(urlRegex)[0];
				console.log(u);
				resolve(u);
			}
			xhr.send();
		});
	}

	let observer = new MutationObserver(e => setTimeout(run, 150));

	function registerUrlChangeListener(){
		let e = document.querySelector("title");
		if(e){
			observer.observe(document.querySelector("title"), {attributes: true, characterData: true, childList: true});
			return;
		}

		setTimeout(registerUrlChangeListener, 250);
	}
	registerUrlChangeListener();
	
	function setRoundFavicon(dataUrl){
		roundImageToDataUrl(dataUrl).then(setFavicon);
	}

	async function roundImageToDataUrl(url){
		return new Promise((resolve, reject) => {
			if(url.src) url = url.src;

			let img = document.createElement("img");
			img.crossOrigin = "anonymous";
			img.src = url;

			img.onload = function(){
				let canvas = document.createElement("canvas"), g = canvas.getContext("2d");

				canvas.height = img.naturalHeight;
				canvas.width = img.naturalWidth;

				g.beginPath();
				g.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2);
				g.clip();

				g.drawImage(img, 0, 0);

				resolve(canvas.toDataURL());
			}
		});
	}

	function setFavicon(url){
		let a = document.querySelectorAll("link[rel *= 'icon']");

		if(a.length == 0){
			let link = document.createElement("link");
			link.type = "image/x-icon";
			link.rel = "icon";
			document.head.appendChild(link);
			a = [link];
		}

		for(let i of a) i.href = url;
	}
})();
