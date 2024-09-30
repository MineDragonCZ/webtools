/**
 * MILLISECONDS TO COUNTDOWN TRANSLATOR
 * @author MineDragonCZ_
 */
function initTimer(timer, simlified, neableMillis) {
	timer.innerHTML = ``
	timer.innerHTML += `<div class="cell" data-type="year1"></div>`;
	timer.innerHTML += `<div class="cell" data-type="year0"></div>`;
	if(simlified)
		timer.innerHTML += `<div class="cell-l" data-type="yearl">:</div>`;
	else
		timer.innerHTML += `<div class="cell-l" data-type="yearl">l </div>`;
	timer.innerHTML += `<div class="cell" data-type="month1"></div>`;
	timer.innerHTML += `<div class="cell" data-type="month0"></div>`;
	if(simlified)
		timer.innerHTML += `<div class="cell-l" data-type="monthl">:</div>`;
	else
		timer.innerHTML += `<div class="cell-l" data-type="monthl">m </div>`;
	timer.innerHTML += `<div class="cell" data-type="day1"></div>`;
	timer.innerHTML += `<div class="cell" data-type="day0"></div>`;
	if(simlified)
		timer.innerHTML += `<div class="cell-l" data-type="dayl">:</div>`;
	else
		timer.innerHTML += `<div class="cell-l" data-type="dayl">d </div>`;
	timer.innerHTML += `<div class="cell" data-type="hour1"></div>`;
	timer.innerHTML += `<div class="cell" data-type="hour0"></div>`;
	if(simlified)
		timer.innerHTML += `<div class="cell-l" data-type="hourl">:</div>`;
	else
		timer.innerHTML += `<div class="cell-l" data-type="hourl">h </div>`;
	timer.innerHTML += `<div class="cell" data-type="minute1"></div>`;
	timer.innerHTML += `<div class="cell" data-type="minute0"></div>`;
	if(simlified)
		timer.innerHTML += `<div class="cell-l" data-type="minutel">:</div>`;
	else
		timer.innerHTML += `<div class="cell-l" data-type="minutel">min </div>`;
	timer.innerHTML += `<div class="cell" data-type="second1"></div>`;
	timer.innerHTML += `<div class="cell" data-type="second0"></div>`;
	if(simlified){
		if(neableMillis)
			timer.innerHTML += `<div class="cell-l" data-type="secondl">.</div>`;
		else
			timer.innerHTML += `<div class="cell-l" data-type="secondl"></div>`;
	}
	else{
		if(neableMillis)
			timer.innerHTML += `<div class="cell-l" data-type="secondl">.</div>`;
		else
			timer.innerHTML += `<div class="cell-l" data-type="secondl">s</div>`;
	}
	if(neableMillis){
		timer.innerHTML += `<div class="cell" style="--duration: 0.05s;" data-type="milli1"></div>`;
		if(simlified)
			timer.innerHTML += `<div class="cell-l" data-type="millil"></div>`;
		else
			timer.innerHTML += `<div class="cell-l" data-type="millil">s</div>`;
	}

	var cells = timer.getElementsByClassName("cell");
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerHTML = `
			<div class="number-placeholder" style="opacity: 0;">0</div>
			<div class="number">9</div>
			<div class="number">8</div>
			<div class="number">7</div>
			<div class="number">6</div>
			<div class="number">5</div>
			<div class="number">4</div>
			<div class="number">3</div>
			<div class="number">2</div>
			<div class="number">1</div>
			<div class="number">0</div>
		`;
	}

	timer.setAttribute("data-inited", "1");
}
let lastTimesSeconds = {};
function updateTimers() {
	var _milli = 10;
	var _second = 1000;
	var _minute = _second * 60;
	var _hour = _minute * 60;
	var _day = _hour * 24;
	var _month = _day * 30;
	var _year = _month * 12;

	var timers = document.getElementsByTagName("timer");
	var now = new Date();
	for (var i = 0; i < timers.length; i++) {
		var timer = timers[i];
		if(!lastTimesSeconds[timer]) {
			lastTimesSeconds[timer] = 0;
		}
		var timerTime = parseInt(timer.getAttribute("data-time"));

		var enableMillis = (timer.getAttribute("data-enable-millis") == "true");

		var distance = timerTime - now;

		if(lastTimesSeconds[timer] != Math.floor(distance / 1000)){
			if(timer.getAttribute("data-tick-sound")){
				var tickSound = new Audio(timer.getAttribute("data-tick-sound"));
				tickSound.play().catch((error) => {});
			}
			lastTimesSeconds[timer] = Math.floor(distance / 1000);
		}

		if (distance < 0 && timer.getAttribute("data-allow-reverse") != "true") distance = 0;

		if (timerTime >= 0) {
			if (distance == 0) {
				// finito
				timer.innerHTML = (timer.getAttribute("data-end") ? timer.getAttribute("data-end") : "");
				timer.style.background = (timer.getAttribute("data-end-color") ? timer.getAttribute("data-end-color") : "");

				timer.removeAttribute("data-inited");
			}
			else {
				timer.style.background = (timer.getAttribute("data-color") ? timer.getAttribute("data-color") : "");
				if(timer.getAttribute("data-font-color") && eval(timer.getAttribute("data-font-color").replace("{time}", distance)) != null)
					timer.style.color = eval(timer.getAttribute("data-font-color").replace("{time}", distance));
				var isInited = timer.getAttribute("data-inited") == "1";
				var simlified = (timer.getAttribute("data-simplified") == "true")
				if (!isInited) {
					initTimer(timer, simlified, enableMillis);
				}
				var cells = timer.getElementsByClassName("cell");
				var labels = timer.getElementsByClassName("cell-l");

				if (distance < 0) distance *= -1;

				var years = Math.floor((distance / _year));
				var months = Math.floor((distance % _year) / _month);
				var days = Math.floor((distance % _month) / _day);
				var hours = Math.floor((distance % _day) / _hour);
				var minutes = Math.floor((distance % _hour) / _minute);
				var seconds = Math.floor((distance % _minute) / _second);
				var millis = Math.floor((distance % _second) / _milli);

				var typesValues = {
					years: [],
					months: [],
					days: [],
					hours: [],
					minutes: [],
					seconds: [],
					millis: [],
				};

				typesValues.years = ("" + years).split("");
				typesValues.months = ("" + months).split("");
				typesValues.days = ("" + days).split("");
				typesValues.hours = ("" + hours).split("");
				typesValues.minutes = ("" + minutes).split("");
				typesValues.seconds = ("" + seconds).split("");
				typesValues.millis = ("" + millis).split("");

				for (const [key, value] of Object.entries(typesValues)) {
					while (typesValues[key].length < 2) {
						typesValues[key].unshift("0");
					}
				}

				var isLastZero = true;
				for (let j = 0; j < cells.length; j++) {
					var cell = cells[j];
					cell.style.opacity = 1;
					cell.style.display = "inline-block";
					var cellNumbers = cell.getElementsByClassName("number");
					if (cellNumbers.length < 10) continue;
					var type = cell.getAttribute("data-type");
					var currType = type.replace("0", "").replace("1", "").replace("2", "").replace("3", "").replace("4", "");
					var typeLabel;
					for (var l = 0; l < labels.length; l++) {
						var label = labels[l];
						var type1 = label.getAttribute("data-type");
						if (type1.startsWith(currType)) {
							typeLabel = label;
							typeLabel.style.display = "inline";
						}
					}

					var cellOrder = parseInt(type.substring(type.length - 1, type.length));
					var cellValue = parseInt(typesValues[currType + "s"][(typesValues[currType + "s"].length - 1) - cellOrder]);
					var cellOtherValue = parseInt(typesValues[currType + "s"][cellOrder]);

					if (cellOrder == 0) {
						// is the firts digit (jednotky)
						if (cellValue == cellOtherValue && cellValue == 0 && currType != "second") {
							// both are zeros - check previous
							if (isLastZero) {
								for (let l = 0; l < cells.length; l++) {
									var cell1 = cells[l];
									var type1 = cell1.getAttribute("data-type");
									if (type1.startsWith(currType)) {
										cell1.style.display = "none";
									}
								}
								if (typeLabel != undefined) {
									typeLabel.style.display = "none";
								}
								isLastZero = true;
								continue;
							}
						}
					}


					var actualValue = cellValue;
					var prevValue = (actualValue + 1) % 10;
					var prevPrevValue = (actualValue + 2) % 10;
					var prevPrevPrevValue = (actualValue + 3) % 10;
					var nextValue = (actualValue - 1);
					var nextNextValue = (actualValue - 2);
					var nextNextNextValue = (actualValue - 3);
					if (nextValue < 0) nextValue = nextValue + 10;
					if (nextNextValue < 0) nextNextValue = nextNextValue + 10;
					if (nextNextNextValue < 0) nextNextNextValue = nextNextNextValue + 10;

					var prevPrevPrevNumber = cellNumbers[9 - prevPrevPrevValue];
					var prevPrevNumber = cellNumbers[9 - prevPrevValue];
					var prevNumber = cellNumbers[9 - prevValue];
					var actualNumber = cellNumbers[9 - actualValue];
					var nextNumber = cellNumbers[9 - nextValue];
					var nextNextNumber = cellNumbers[9 - nextNextValue];
					var nextNextNextNumber = cellNumbers[9 - nextNextNextValue];

					for (var l = 0; l < cellNumbers.length; l++) {
						if (Math.abs(l - actualValue) <= 2) continue;
						var bottom = (l - actualValue) > 0;
						if (bottom)
							cellNumbers[l].style.bottom = "calc(var(--line-height) * 3";
						else
							cellNumbers[l].style.bottom = "calc(var(--line-height) * -3";
						cellNumbers[l].style.opacity = 0;
					}

					prevPrevPrevNumber.style.bottom = "calc(var(--line-height) * 3";
					prevPrevPrevNumber.style.opacity = 0;

					prevPrevNumber.style.bottom = "calc(var(--line-height) * -3";
					prevPrevNumber.style.opacity = 0;

					prevNumber.style.bottom = "calc(var(--line-height) * -3";
					prevNumber.style.opacity = 1;

					if(!(cellOrder > 0 && currType != "millis" && cellValue == 0 && isLastZero)){
						actualNumber.style.bottom = "0";
						actualNumber.style.opacity = 1;
					}
					else {
						actualNumber.style.opacity = 0;
						cell.style.display = "none";
					}

					nextNumber.style.bottom = "calc(var(--line-height) * 3";
					nextNumber.style.opacity = 1;

					nextNextNumber.style.bottom = "calc(var(--line-height) * 3";
					nextNextNumber.style.opacity = 0;

					nextNextNextNumber.style.bottom = "calc(var(--line-height) * -3";
					nextNextNextNumber.style.opacity = 0;

					if(cellOrder == 0)
						isLastZero = false;
				}
			}
		}
		else{
			timer.innerHTML = (timer.getAttribute("data-error" + (timerTime * -1)) ? timer.getAttribute("data-error" + (timerTime * -1)) : "");
			timer.style.background = (timer.getAttribute("data-error-color" + (timerTime * -1)) ? timer.getAttribute("data-error-color" + (timerTime * -1)) : "");
		}
	}
}

setInterval(updateTimers, 10);

setTimeout(() => {
	console.log("CSS created!");
	var css = `
		/*
		TIMERS
		*/
		timer {
			--line-height: 25px;
			overflow-y: hidden;
			position: relative;
			-webkit-mask-image: linear-gradient(0deg, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 100%);
			mask-image: linear-gradient(0deg, transparent 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 100%);
		}

		timer>.cell {
			display: none;
			position: relative;
			--duration: 0.5s;
		}

		timer>.cell-l {
			display: inline;
			position: relative;
			display: none;
		}

		timer>.cell>.number {
			display: inline;
			position: absolute;
			left: 0;
			bottom: calc(var(--line-height) / -2);
			opacity: 0;
			transition: bottom cubic-bezier(1, .18, .5, 1.46);
			transition-duration: var(--duration);
		}
		timer>.cell>.number-placeholder {
			display: inline;
			position: relative;
			opacity: 0;
		}
		timer>.cell>.number.active {
			opacity: 1;
		}
	`,
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');

	head.appendChild(style);

	style.type = 'text/css';
	if (style.styleSheet){
		// This is required for IE8 and below.
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
}, 5);