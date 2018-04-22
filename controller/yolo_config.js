// YOLO-specific config
'use strict'

const path = require('path');
const home_dir = require('os').homedir(),
	darknet_dir = path.resolve(home_dir, 'computer_vision/darknet'),
	darknetExec = path.resolve(darknet_dir, 'darknet'),
	yolo_config = path.resolve(darknet_dir, 'cfg/yolov3.cfg'),
	weights = path.resolve(darknet_dir, 'yolov3.weights');

const confidence_threshold = 0.25;

function OnYoloExit(code, signal) {
	if (code != 0 || signal != null) {
		console.log('YOLO process exited with '
			+ `code ${code} and signal ${signal}.`);
	}
}

const yolo_args = ['detect', yolo_config, weights,
	'-thresh', confidence_threshold];

module.exports = {
	darknetExec,
	yolo_args,
	OnYoloExit,
	resultDir: './public/results'
};
