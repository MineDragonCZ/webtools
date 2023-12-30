/**
 * MILLISECONDS TO COUNTDOWN TRANSLATOR
 * @author MineDragonCZ_
 */
function checkMillis(){
	var _second = 1000;
	var _minute = _second * 60;
	var _hour = _minute * 60;
	var _day = _hour * 24;
	//var _week = _day * 7;
	var _month = _day * 30;
	var _year = _month * 12;


	let elmsOut = document.getElementsByClassName("millis-to-countdown");
	var now = new Date();

	for(let i = 0; i < elmsOut.length; i++){
		let elmOut = elmsOut[i];
		let ts = parseInt(elmOut.getAttribute("data-time"));
        var distance = ts - now;

		if(distance < 0 && elmOut.getAttribute("data-allow-reverse") != "true") distance = 0;

		let output = "";
		let outBack = "";

		if(ts >= 0){

			if(distance == 0){
				output = (elmOut.getAttribute("data-end") ? elmOut.getAttribute("data-end") : "");
				outBack = (elmOut.getAttribute("data-end-color") ? elmOut.getAttribute("data-end-color") : "");
			}
			else{
				if(distance < 0) distance *= -1;

				var years = Math.floor((distance / _year));
				var months = Math.floor((distance % _year) / _month);
				var days = Math.floor((distance % _month) / _day);
				var hours = Math.floor((distance % _day) / _hour);
				var minutes = Math.floor((distance % _hour) / _minute);
				var seconds = Math.floor((distance % _minute) / _second);
		
	
				var s = seconds + minutes + hours + days + months + years;
				var m = minutes + hours + days + months + years;
				var h = hours + days + months + years;
				var d = days + months + years;
				var mo = months + years;
				var y = years;

				outBack = (elmOut.getAttribute("data-color") ? elmOut.getAttribute("data-color") : "");
				output = seconds + "s";
				if(m > 0){
					output = minutes + "min " + output;
					if(h > 0){
						output = hours + "h " + output;
						if(d > 0){
							output = days + "d " + output;
							if(mo > 0){
								output = months + "m " + output;
								if(y > 0)
									output = years + "l " + output;
							}
						}
					}
				}
			}
		}
		else{
			output = (elmOut.getAttribute("data-error" + (ts * -1)) ? elmOut.getAttribute("data-error" + (ts * -1)) : "");
			outBack = (elmOut.getAttribute("data-error-color" + (ts * -1)) ? elmOut.getAttribute("data-error-color" + (ts * -1)) : "");
		}
		elmOut.innerHTML = output;
		if(outBack != "")
			elmOut.style.background = outBack;
	}
}
setInterval(checkMillis, 1);