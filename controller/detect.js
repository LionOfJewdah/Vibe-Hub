// controller/detect.js
// wrapper for YOLO on data receipt
// passes YOLO output to a receiver, usually the database
'use strict';

const readdir = require('readdir-enhanced');
const child_process = require('child_process');
const {
	darknetExec,
	yolo_args,
	OnYoloExit,
	resultDir 
} = require('./yolo_config');

const { image_regex } = require('./util');

class YOLO {
	constructor(handler) {
		this.dataCallback = handler;
		this.yolo_process = null;
		try {
			this._yolo_init();
		} catch (err) {
			console.error("YOLO error:", err, err.stack);
			throw err;
		}
	}

	_yolo_init() {
		this.yolo_process = child_process.spawn(darknetExec, yolo_args,
			{ cwd: resultDir }
		);
		this.yolo_process.stdout.on('data', (data) => {
			this.processYoloData(data);
		});
		const showMeOutput = (data) => { process.stdout.write(data); }
		this.yolo_process.stderr.on('data', showMeOutput);
		this.yolo_process.stdout.on('data', showMeOutput);
		this.yolo_process.on('exit', OnYoloExit);
	}

	passFileToYolo(filename) {
		this.yolo_process.stdin.write(`${filename}\n`);
	}

	async detectFolder(folder) {
		const readdir_options = {
			filter: image_regex,
			basePath: folder
		};
		try {
			const files = await readdir(folder, readdir_options);
			files.forEach(this.passFileToYolo.bind(this));
		} catch (err) {
			console.error(err, err.stack);
			return err;
		}
	}

	async detectSingle(file) {
		var self = this;
		let myPromise = new Promise(doYolo);
		return myPromise;
		function doYolo(resolve, reject) {
			try {
				self.passFileToYolo(file);
				self.yolo_process.stdout.once('data', resolve);
			} catch (err) {
				reject(err);
			}
		}
	}

	async processYoloData(jsonData) {
		try {
			const payload = JSON.parse(jsonData);
			await this.dataCallback(payload);
		} catch (err) {
			console.error("Error in parsing JSON from YOLO:",
				err, jsonData.toString());
		}
	}
}

let myYOLOWrapper = null;

function InitializeYOLO(dataCallback) {
	myYOLOWrapper = new YOLO(dataCallback);
	return myYOLOWrapper;
}

async function DetectFolder(path)
{
	return myYOLOWrapper.detectFolder(path);
}

async function DetectSingle(file)
{
	return myYOLOWrapper.detectSingle(file);
}

module.exports = {
	Init: InitializeYOLO,
	ResultFolder: resultDir,
	Folder: DetectFolder,
	Single: DetectSingle
};
