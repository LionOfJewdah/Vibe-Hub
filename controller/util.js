// Utilities I use variously in backend logic
function pad2(num) {
	num = num + '';
	return num.length >= 2 ? num : new Array(3 - num.length).join('0') + num;
}

function MyTime(time) {
	time = time || new Date();
	return `${pad2(time.getHours())}_${pad2(time.getMinutes())}`;
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; ++index) {
		await callback(array[index], index, array);
	}
}

const image_regex = /\.(gif|jpe?g|tiff|png|bmp|webp)$/i;

module.exports = {
	Time_HH_MM: MyTime,
	MyTime: MyTime,
	asyncForEach,
	image_regex
};
