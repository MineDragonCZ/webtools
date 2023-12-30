/**
 * FILE UPLOADER - Client side
 * @author MineDragonCZ_
 */

 $("body").bind('paste', function(je){
	var e = je.originalEvent;
	for (var i = 0; i < e.clipboardData.items.length; i++) {
		var item = e.clipboardData.items[i];
		console.log('Item: ' + item.type);
		if (item.type.indexOf('image') != -1) {
			pasteFile(item.getAsFile());
		}
	}
});
let fileInputs;
let fileOuts;
let dataTransfer = new DataTransfer();
function setPasteInputs(elms){
	fileInputs = elms;
	dataTransfer = new DataTransfer();
}
function setPasteOutputs(elms){
	fileOuts = elms;
	dataTransfer = new DataTransfer();
}
function addPasteInput(elm){
	fileInputs.push(elm);
	dataTransfer = new DataTransfer();
}
function addPasteOutput(elm){
	fileOuts.push(elm);
	dataTransfer = new DataTransfer();
}
function pasteFile(oldFile){
	if(fileInputs == undefined) return;

	var name = oldFile.name;
	var blob = oldFile.slice(0, oldFile.size, 'image/png'); 
	let file = new File([blob], (new Date().getTime()) + '_' + name, {type: 'image/png'});

	dataTransfer.items.add(file);
	for(let i = 0; i < fileInputs.length; i++){
		fileInputs[i].files = dataTransfer.files;
	}
	if(fileOuts == undefined) return;
	for(let i = 0; i < fileOuts.length; i++){
		const img = document.createElement("img");

		img.classList.add("col-3");

		img.src = URL.createObjectURL(dataTransfer.files[dataTransfer.files.length - 1]);
		img.onload = function() {
			URL.revokeObjectURL(img.src) // free memory
		}

		fileOuts[i].appendChild(img);
	}
}
function clearFileOut(){
	if(fileInputs == undefined) return;
	dataTransfer = new DataTransfer();
	for(let i = 0; i < fileInputs.length; i++){
		fileInputs[i].files = dataTransfer.files;
	}
	if(fileOuts == undefined) return;
	for(let i = 0; i < fileOuts.length; i++){
		fileOuts[i].innerHTML = '';
	}
}
function clearFileOutOnlyThis(th){
	if(fileInputs == undefined) return;
	dataTransfer = new DataTransfer();
	let t = -1;
	for(let i = 0; i < fileInputs.length; i++){
		if(fileInputs[i].classList != th.classList) continue;
		fileInputs[i].files = dataTransfer.files;
		t = i;
	}
	if(t == -1) return;
	if(fileOuts == undefined) return;
	fileOuts[t].innerHTML = '';
}