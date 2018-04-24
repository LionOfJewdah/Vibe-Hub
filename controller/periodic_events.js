'use strict';
const MyTime = require('./util').Time_HH_MM;
const Detect = require('./detect');
const fs = require('fs'), path = require('path');
const rimraf = require('rimraf');
const readdir = require('readdir-enhanced');
const { uploadDir } = require('../config');
const { resultDir } = require('./yolo_config');

class PeriodicEvents {
	constructor() {
		console.log("PeriodicEvents.start() called.");
		setTimeout(() => {
			const deleteOldStuff = () => {
				deleteOldFiles(uploadDir, 600);
				deleteOldFiles(resultDir, 180);
			};
			deleteOldStuff();
			setInterval(deleteOldStuff, SecondsToMilliseconds(300));
		}, SecondsToMilliseconds(6));

	}

	DetectThisMinute(scheduledTime) {
		scheduledTime = scheduledTime || new Date();
		const aMinuteAgo = scheduledTime.valueOf() - SecondsToMilliseconds(60);
		const time_dir = MyTime(new Date(aMinuteAgo));
		const directory = path.resolve(uploadDir, time_dir);
		IfDirectoryExistsDo(directory, Detect.Folder);
	}

}

const SecondsToMilliseconds = (seconds) => seconds * 1000;

function IfDirectoryExistsDo(directory, callback) {
	const ENOENT = -2;
	fs.stat(directory, (err) => {
		if (err) {
			if (err.errno == ENOENT) {
				return;
			}
			throw err;
		}
		callback(directory);
	});
}

async function deleteOldFiles(dir, ageInSeconds = 600) {
	try {
		const files = await readdir(dir);
		files.forEach(deleteIfShould);
	} catch (err) {
		console.error("Old file cleanup error:", dir, err, err.stack);
		throw err;
	}

	async function deleteIfShould(file) {
		if (file && file[0] == '.') {
			return;
		}
		fs.stat(path.join(dir, file), statCallback);
		function statCallback(err, stat) {
			if (err) { return console.error(err); }
			var now = new Date().getTime(),
				expiration = new Date(stat.ctime).getTime()
							+ SecondsToMilliseconds(ageInSeconds);
			if (expiration < now) {
				return rimraf(path.join(dir, file), function(err) {
					if (err) { return console.error(err); }
				});
			}
		}
	}
}

function Start() {
	return new PeriodicEvents();
}

module.exports = {
	start: Start
};
