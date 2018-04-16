// controller/detect.js
// plans detections

const Config = require('../config/config');
const fs = require('fs');
const readdir = require('readdir-enhanced');
const child_process = require('child_process');
const node_path = require('path');
/*
const transformStream = require('stream').Transform;

class NewLineInserter extends transformStream {
	constructor(options) {
		super(options);
	}
	// better to stream than not, but need new lines :(
};
*/

const image_regex = /\.(gif|jpe?g|tiff|png|bmp|webp)$/i;
const uploadPath = node_path.resolve(Config.UploadFolder);
const readdir_options = { 
	filter: image_regex,
	basePath: uploadPath
};

/*
readdir(uploadPath, readdir_options).then(function(files) {
	console.log(files)
}).catch(function(err) {
	console.error('Fuck. ' + err.toString())
})
*/
function detect(confidence_threshold = 0.25) {
	const home_dir = require('os').homedir(),
		darknetExec = '/usr/local/bin/darknet',
		cv_dir = `${home_dir}/computer_vision`,
		darknet_dir = `${cv_dir}/darknet`,
		yolo_config = `${darknet_dir}/cfg/yolov3.cfg`,
		weights = `${darknet_dir}/yolov3.weights`,
		image_dir = `${cv_dir}/images`;

	const yolo_args = ['detect', yolo_config, weights, 
		'-thresh', confidence_threshold];
	const queue_file = 'plan.queue';
	const yolo_process = child_process.spawn(darknetExec, yolo_args, {
		cwd: Config.UploadFolder
	});
	//const plan = fs.createReadStream(queue_file);
	//plan.pipe(yolo_process.stdin);
	// const image_stream = readdir.stream(uploadPath, readdir_options);
	// image_stream.pipe(yolo_process.stdin);
	readdir(uploadPath, readdir_options).then(function(files) {
		files.forEach((file) => { yolo_process.stdin.write(`${file}\n`); });
	}).catch(function(err) {
		console.error('Fuck. ' + err.toString())
	}).then(function() {
		yolo_process.stdin.end();
	});
	yolo_process.stdout.on('data', (data) => {
		var payload = JSON.parse(data);
		console.log(`stdout: ${JSON.stringify(payload)}`);
	});

	yolo_process.on('exit', (code, signal) => {
		if (code != 0 || signal != null) {
			console.log('YOLO process exited with '
				+ `code ${code} and signal ${signal}.`);
		}
	});
}

detect()

module.exports = {
	Detect: detect
}
