// Utilities I use variously in backend logic 
function pad2(num) {
	num = num + '';
	return num.length >= 2 ? num : new Array(2 - num.length + 1).join('0') + num;
}

function MyTime(time) {
	time = time || new Date();
	return `${pad2(time.getHours())}_${pad2(time.getMinutes())}`;
}

module.exports = {
	Time_HH_MM: MyTime,
	MyTime: MyTime
}
