let listenersCount = 0;
let debug = false;
let debugCS = false;

let noInternetMessage = `
<div class="row justify-content-center align-items-center" style="height: min(100%, 80vh);">
	<div class="col-12" align="center">
		<img loading="lazy" src="/tools/src/imgs/ikonky/no-wifi.png" style="max-width: 50vw; max-height: 40vh;"><br/>
		<span class="card-desc text-lg">Nejste připojeni k internetu!</span>
	</div>
</div>
`;

function setCSSCPaths(SC, CS){
	pathSC = SC;
	pathCS = CS;
}

/*
 * SERVER TO CLIENT
 */
let pathSC = "/tools/CSNetwork/fromServer.php?";
let listenersSC = {};
let listenersSCPending = {};
let listenersSCPendingToLoad = {};

let isPageUnloading = false;

// On Unload - cancel all pending requests
addEventListener("beforeunload", (event) => {
	isPageUnloading = true;
	let entries = Object.entries(listenersSCPending);
	entries.map( ([key, listener] = entry) => {
		if(listener[0]){
			listener[1].abort();
		}
	});
});

// On load - send all pending request that have not been sent
let isPageLoaded = false;
addEventListener("load", (event) => {
	setTimeout(function(){
		isPageLoaded = true;

		let entries = Object.entries(listenersSCPendingToLoad);
		entries.map( ([key, listener] = entry) => {
			if(listener[0]){
				listener[1]();
			}
		});
	}, 3000);
});

function getListenersSC(){
	return listenersSC;
}

function registerListenerSC(printToElm, interval, notifyOnChange, displayIfNoConnection, runAfterSuccess){
	listenersCount++;
	listenersSC[listenersCount] = {};
	listenersSC[listenersCount]["id"] = listenersCount;
	listenersSC[listenersCount]["elm"] = printToElm;
	listenersSC[listenersCount]["interval"] = interval;
	listenersSC[listenersCount]["notifyOnChange"] = notifyOnChange;
	listenersSC[listenersCount]["displayIfNoConnection"] = displayIfNoConnection;
	listenersSC[listenersCount]["isLoading"] = false;
	listenersSC[listenersCount]["tick"] = 0;
	listenersSC[listenersCount]["runAfterSuccess"] = runAfterSuccess;

	return listenersCount;
}

function setRequestSC(listId, request){
	if(listenersSC[listId]["request" != pathSC + request])
		listenersSC[listId]["lastContent"] = "";
	listenersSC[listId]["request"] = pathSC + request;
}
function deleteListenerSC(id){
	listenersSC[id] = null;
}
function pauseListenerSC(id){
	if(listenersSC[id]["interval"] == -1) return;
	listenersSC[id]["intervalOld"] = listenersSC[id]["interval"];
	listenersSC[id]["interval"] = -1;
}
function resumeListenerSC(id){
	if(listenersSC[id]["intervalOld"] != undefined)
		listenersSC[id]["interval"] = listenersSC[id]["intervalOld"];
	else 
		listenersSC[id]["interval"] = -1;
}

async function getDataFromServer(listener, force){

	let listElm = listener["elm"];

	if(isPageUnloading){
		console.log("Page is unloading...");
		return;
	}
	if(!navigator.onLine){
		if(listener["displayIfNoConnection"]){
			if(listElm instanceof Array || listElm instanceof HTMLCollection){
				for(let i = 0; i < listElm.length; i++)
					listElm[i].innerHTML = noInternetMessage;
			}
			else{
				listElm.innerHTML = noInternetMessage;
			}
		}
		listener["lastContent"] = "";
		return;
	}
	if(listenersSCPending[listener["id"]] != undefined && listenersSCPending[listener["id"]][0] == true && (Date.now() - listenersSCPending[listener["id"]][2]) <= 1000*10){
		if(force){
			listenersSCPending[listener["id"]][1].abort();
		}
		else{
			console.log("Already pending...");
			return;
		}
	}
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		listenersSCPending[listener["id"]] = [false, null, Date.now()];
		listenersSCPendingToLoad[listener["id"]] = [false, null];
		if (this.readyState == 4 && this.status == 200 && listener["isLoading"] == false && (listener["lastContent"] != this.responseText || force || listener["lastContent"] == undefined || listener["lastContent"] == "")){
			// check for focus on inputs
			let inputs = document.getElementsByClassName("protected-input");
			for(let i = 0; i < inputs.length; i++){
				if(inputs[i] === document.activeElement){
					if(debug){
						console.log("----------------------------------------");
						console.log("Listener " + i + " got data, but is not inserting!");
						console.log("Got from: " + listener["request"]);
						console.log("Protected input selected");
						console.log("----------------------------------------");
					}
					return;
				}
			}
			// ---------------------

			// NOTIFER
			if(listener["notifyOnChange"] && listener["lastContent"] != "" && listener["lastContent"] != undefined){
				if(!force || force == undefined || force == null){
					if(listener["id"] == notiferListener){
						createNotification();
					}
				}
			}
			// -----------------------

			if(listElm instanceof Array || listElm instanceof HTMLCollection){
				for(let i = 0; i < listElm.length; i++)
					listElm[i].innerHTML = this.responseText;
			}
			else{
				listElm.innerHTML = this.responseText;
			}
			listenersSC[listener["id"]]["lastContent"] = this.responseText;
			if(listener["runAfterSuccess"] != undefined && listener["runAfterSuccess"] != null && typeof listener["runAfterSuccess"] === "function"){
				listener["runAfterSuccess"]();
			}

			if(listener["locationAfterDone"] != undefined){
				setTimeout(function(){
					window.location.href = listener["locationAfterDone"];
					listenersSC[listener["id"]]["locationAfterDone"] = undefined;
				}, 1000);
			}

			if(debug){
				console.log("----------------------------------------");
				console.log("Listener " + listener["id"] + " got data");
				console.log("Got from: " + listener["request"]);
				if(listElm instanceof Array || listElm instanceof HTMLCollection){
					console.log("Inserted into: ");
					for(let i = 0; i < listElm.length; i++)
						console.log(listElm[i].id);
				}
				else{
					console.log("Inserted into: " + listElm.id);
				}
				console.log("----------------------------------------");
			}
		}
		else if(this.readyState == 4 && this.status == 200){
			if(listener["lastContent"] == this.responseText){
				if(debug){
					console.log("----------------------------------------");
					console.log("Listener " + listener["id"] + " got data, but is not inserting!");
					console.log("Got from: " + listener["request"]);
					console.log("Same data already printed!");
					console.log("----------------------------------------");
				}
			}
		}

		if(this.readyState == 4 && this.status == 200){
			if(this.responseText.includes("<redirect after error>")){
				if(listener["locationAfterError"] != undefined){
					window.location.href = listener["locationAfterError"];
					listenersSC[listener["id"]]["locationAfterError"] = undefined;
				}
			}
		}
	};
	xmlhttp.open("GET", listener["request"], true);
	xmlhttp.send();
	listenersSCPending[listener["id"]] = [true, xmlhttp, Date.now()];
}

async function getFromServerForce(listenerId){
	var listener = listenersSC[listenerId];
	if(listener == null || listener == undefined || listener["request"] == undefined){
		console.log("null! " + listener["request"]);
		return;
	}
	getDataFromServer(listener, true);
	if(debug){
		console.log("----------------------------------------");
		console.log("Listener " + listener["id"] + " executed at tick " + listener["tick"] + " - FORCED!");
		console.log("Data getter message pending...");
		console.log("----------------------------------------");
	}
}

function getFromServerLoop(){
	for(let i = 0; i <= listenersCount; i++){
		if(listenersSC[i] == null || listenersSC[i] == undefined || listenersSC[i]["request"] == undefined) continue;
		var l = listenersSC[i];
		if(l["interval"] != -1 && (l["tick"] % l["interval"] == 0 || l["tick"] == 0)){
			getDataFromServer(l, false);
			if(debug){
				console.log("----------------------------------------");
				console.log("Listener " + i + " executed at tick " + l["tick"]);
				console.log("Data getter message pending...");
				console.log("----------------------------------------");
			}
		}
		l["tick"]++;
	}
}
setInterval(getFromServerLoop, 1);

/**
 * CLIENT TO SERVER
 */
let pathCS = "/tools/CSNetwork/toServer.php";
let listenersCS = {};
function getListenersCS(){
	return listenersCS;
}

function registerListenerCS(uploadStartedMess, successMess, errorMess, runAfterSuccess){
	listenersCount++;
	listenersCS[listenersCount] = {};
	listenersCS[listenersCount]["id"] = listenersCount;
	listenersCS[listenersCount]["successMess"] = successMess;
	listenersCS[listenersCount]["uploadStartedMess"] = uploadStartedMess;
	listenersCS[listenersCount]["errorMess"] = errorMess;
	listenersCS[listenersCount]["runAfterSuccess"] = runAfterSuccess;

	return listenersCount;
}
function setRequestCS(listId, request){
	listenersCS[listId]["request"] = request;
}
function deleteListenerCS(id){
	listenersCS[id] = null;
}

async function postDataToServer(listener){
	if(!navigator.onLine){
		if(listener["errorMess"] != null)
			alertError("<b>Nejste připojeni k internetu!</b>", 7);
		return;
	}
	if(listener["uploadStartedMess"] != null){
		alertLoading(listener["uploadStartedMess"], 1);
	}
	$.ajax({
		url: pathCS,
		contentType: false,
		processData: false,
		data: listener["request"],               
		type: 'post',
		complete: function(response){
			console.log(response.responseText || "POST: OK");
			if (response.responseText == undefined){
				alertError("Při odesílání došlo k neznámé chybě! (Error code 0288)", 7);
			}
			else if(response.responseText == "" || response.responseText.startsWith("success")){
				// success
				if(typeof listener["runAfterSuccess"] === "function"){
					listener["runAfterSuccess"](response.responseText.replace("success", ""));
				}
				else{
					let l = listenersSC[listener["runAfterSuccess"]];
					if(l != undefined || l != null){
						getFromServerForce(l["id"]);
					}
					l = listenersCS[listener["runAfterSuccess"]];
					if(l != undefined || l != null){
						postToServer(l["id"]);
					}
				}
				if(response.responseText == ""){
					if(listener["successMess"] != null){
						alertSuccess(listener["successMess"], 3);
					}

					if(listener["locationAfterDone"] != undefined){
						setTimeout(function(){
							window.location.href = listener["locationAfterDone"];
							listenersCS[listener["id"]]["locationAfterDone"] = undefined;
						}, 1000);
					}
				}
			}
			else if(listener["errorMess"] != null){
				alertError((listener["errorMess"] != "" ? (listener["errorMess"] + "<br/><i><b>" + response.responseText + "</b></i>") : "<b>" + response.responseText + "</b>"), 7);
			}            
	 	}
	});
}

async function postToServer(listenerId){
	var listener = listenersCS[listenerId];
	if(listener == null || listener == undefined || listener["request"] == undefined){
		console.log("null! " + new URLSearchParams(listener["request"]).toString());
		return;
	}
	postDataToServer(listener);
	if(debugCS){
		console.log("----------------------------------------");
		console.log("Listener " + listener["id"] + " executed");
		console.log("Data post message pending...");
		console.log("----------------------------------------");
	}
}


/**
 * GLOBAL
 */

function setLocationAfterDone(listenerId, location){
	let l = listenersSC[listenerId];
	if(l != undefined || l != null){
		listenersSC[listenerId]["locationAfterDone"] = location;
	}
	else{
		l = listenersCS[listenerId];
		if(l != undefined || l != null){
			listenersCS[listenerId]["locationAfterDone"] = location;
		}
	}
}

function setLocationAfterError(listenerId, location){
	let l = listenersSC[listenerId];
	if(l != undefined || l != null){
		listenersSC[listenerId]["locationAfterError"] = location;
	}
	else{
		l = listenersCS[listenerId];
		if(l != undefined || l != null){
			listenersCS[listenerId]["locationAfterError"] = location;
		}
	}
}
