// controller/detect.js
// detects the images in a folder
'use strict';
const Config = require('../config');
const fs = require('fs');
const readdir = require('readdir-enhanced');
const child_process = require('child_process');
const node_path = require('path');
const uploadPath = node_path.resolve(Config.UploadFolder);

function detect(Process, confidence_threshold = 0.25)
{
	const home_dir = require('os').homedir(),
		darknetExec = '/usr/local/bin/darknet',
		cv_dir = `${home_dir}/computer_vision`,
		darknet_dir = `${cv_dir}/darknet`,
		yolo_config = `${darknet_dir}/cfg/yolov3.cfg`,
		weights = `${darknet_dir}/yolov3.weights`,
		image_dir = `${cv_dir}/images`;

	const image_regex = /\.(gif|jpe?g|tiff|png|bmp|webp)$/i;

	const readdir_options = { 
		filter: image_regex,
		basePath: uploadPath
	};

	const yolo_args = ['detect', yolo_config, weights, '-thresh', confidence_threshold];
	const yolo_process = child_process.spawn(darknetExec, yolo_args, {
		cwd: uploadPath
	});
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
		const payload = JSON.parse(data);
		Process(payload);
	});
	yolo_process.on('exit', (code, signal) => {
		if (code != 0 || signal != null) {
			console.log('YOLO process exited with '
				+ `code ${code} and signal ${signal}.`);
		}
	});
}

module.exports = {
	Detect: detect
}
