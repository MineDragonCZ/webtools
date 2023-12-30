/**
 * JS PAGING SYSTEM
 * @author MineDragonCZ_
 */

let pages = document.getElementsByClassName("pp-page");
let titles = document.getElementsByClassName("pp-page-title");
let links = document.getElementsByClassName("pp-page-nav-link");

let currentPage = "";

var pageSwitchEvent;
if(document.createEvent){
    pageSwitchEvent = document.createEvent("HTMLEvents");
    pageSwitchEvent.initEvent("pageSwitchEvent", true, true);
    pageSwitchEvent.eventName = "pageSwitchEvent";
} else {
    pageSwitchEvent = document.createEventObject();
    pageSwitchEvent.eventName = "pageSwitchEvent";
    pageSwitchEvent.eventType = "pageSwitchEvent";
}

function firePageSwitchEvent(){
	if(document.createEvent){
		document.dispatchEvent(pageSwitchEvent);
	} else {
		document.fireEvent(pageSwitchEvent.eventType, pageSwitchEvent);
	}
}

function hidePages() {
	pages = document.getElementsByClassName("pp-page");
	titles = document.getElementsByClassName("pp-page-title");
	links = document.getElementsByClassName("pp-page-nav-link");
	for (let i = 0; i < pages.length; i++) {
		var page = pages[i];
		if (page == undefined) continue;
		page.style.display = "none";
	}
	for (let y = 0; y < titles.length; y++) {
		var title = titles[y];
		if (title == undefined) continue;
		title.style.display = "none";
	}
	for (let y = 0; y < links.length; y++) {
		var link = links[y];
		if (link.classList.contains("pp-active")) link.classList.remove("pp-active");
	}
}

function getPage(id) {
	if(id == undefined) id = "";
	for (let i = 0; i < pages.length; i++) {
		var page = pages[i];
		if (page == undefined) continue;
		var pageId = page.getAttribute('page-id');
		if (pageId == id) return page;
	}
}

function getTitle(id) {
	if(id == undefined) id = "";
	for (let i = 0; i < titles.length; i++) {
		var title = titles[i];
		if (title == undefined) continue;
		var titleId = title.getAttribute('for-page');
		if (titleId == id) return title;
	}
}

function getCaller(id) {
	if(id == undefined) id = "";
	for (let i = 0; i < links.length; i++) {
		var link = links[i];
		if (link == undefined) continue;
		var linkId = link.getAttribute('caller-for-page');
		if (linkId == id) return link;
	}
}

function switchPage(pageId, caller, ignoreTickets, dontpushlink) {
	if(pages.length < 1) return;
	if(pageId == undefined) pageId = "";
	if(pageId == null || pageId == "null") pageId = "";
	if (caller == null) caller = getCaller(pageId);
	hidePages();
	var page_s = pageId.split("::");
	var page_test = getPage(page_s[0]);
	if(page_test == undefined && pageId != ""){
		switchPage("", null, ignoreTickets, dontpushlink);
		return;
	}
	for(var i = 0; i < page_s.length; i++){
		var page = getPage(page_s[i]);
		var title = getTitle(page_s[i]);
		if(page != undefined){
			page.style.display = "block";
			if(page.tagName.toLowerCase() == "table")
				page.style.display = "table";
		}
		else return;
		if(title != undefined && title != null){
			let d = "block";
			if(title.getAttribute("data-display") != null && title.getAttribute("data-display") != undefined){
				d = title.getAttribute("data-display");
			}
			title.style.display = d;
		}
		var c = getCaller(page_s[i]);
		if (c != null) {
			if (!c.classList.contains("pp-active")) c.classList.add("pp-active")
		}
	}
	if (caller != null) {
		if (!caller.classList.contains("pp-active")) caller.classList.add("pp-active");
	}
	if(!dontpushlink)
		pushLink("Paging", "?p=" + pageId + (getFromLink("ticket") && !ignoreTickets ? "&ticket=" + getFromLink("ticket") : ""));
	currentPage = pageId;

	setPasteInputs(document.getElementsByClassName((currentPage.replaceAll("/", "-")) + "-pasteFiles"));
	setPasteOutputs(document.getElementsByClassName((currentPage.replaceAll("/", "-")) + "-pasteFiles-out"));
	firePageSwitchEvent();
	return false; //- disable <a> click event
}
switchPage(getFromLink("p"), null, false);

function checkPage(){
	if(currentPage != getFromLink("p"))
		switchPage(getFromLink("p"), null, false);
}
setInterval(checkPage, 10);

function toggleDropdown(elm){
	let targetElm = document.getElementById(elm.getAttribute("targetElm"));
	if(elm.getAttribute("toggled") == "true" || (targetElm.querySelectorAll('.pp-active').length >= 1 && elm.getAttribute("toggled") == undefined)){
		elm.setAttribute("toggled", "false");
		targetElm.style.display = "none";
		return;
	}
	elm.setAttribute("toggled", "true");
	targetElm.style.display = "block";
}

function updatePage(){
	return switchPage(currentPage);
}

function getCurrentPage(){
	return currentPage;
}



// Table pages
let tablePages = document.getElementsByClassName("tablepage");
let tableNavigators = document.getElementsByClassName("tablenav");

function switchTablePage(pageArg){
	let page = pageArg;
	for(let i = 0; i < tableNavigators.length; i++){
		let tabNavLink = tableNavigators[i];
		let inactiveClass = tabNavLink.getAttribute("data-tablepage-inactive-class");
		let activeClass = tabNavLink.getAttribute("data-tablepage-active-class");
		tabNavLink.classList.remove(inactiveClass);
		tabNavLink.classList.remove(activeClass);
		let forPage = tabNavLink.getAttribute("data-tablepage-for");
		if(!pageArg){
			if(tabNavLink.getAttribute("data-tablepage-active-def") == "true"){
				page = forPage;
			}
			console.log("set");
			tabNavLink.addEventListener("click", (e) => {
				switchTablePage(forPage);
			});
		}

		if(page == forPage)
			tabNavLink.classList.add(activeClass);
		else
			tabNavLink.classList.add(inactiveClass);
	}

	for(let i = 0; i < tablePages.length; i++){
		tablePages[i].style.display = "none";
	}
	let activePages = document.getElementsByClassName("tablepage-" + page);
	for(let i = 0; i < activePages.length; i++){
		activePages[i].style.display = "";
	}
}
switchTablePage(false);