'use strict';
const Config = require('../config');
const MyTime = require('./util').Time_HH_MM;
const Detect = require('./detect');
const fs = require('fs'), path = require('path');
const rimraf = require('rimraf');
const cron = require('node-schedule');

const uploadDir = Config.UploadFolder;

class PeriodicEvents {
	constructor(database) {
		this.database = database;
		console.log("PeriodicEvents.start() called.")
		setTimeout(() => {
			deleteOldFiles(uploadDir, 600);
			setInterval(deleteOldFiles.bind(this, uploadDir, 600),
				SecondsToMilliseconds(300));
		}, SecondsToMilliseconds(10));

		this.yoloJob = cron.scheduleJob("0 * * * * *",
			this.DetectThisMinute.bind(this));
	}

	DetectThisMinute(scheduledTime) {
		scheduledTime = scheduledTime || new Date();
		const aMinuteAgo = scheduledTime.valueOf() - SecondsToMilliseconds(60);
		const time_dir = MyTime(new Date(aMinuteAgo));
		const directory = path.resolve(uploadDir, time_dir);
		IfDirectoryExistsDo(directory,
			Detect.Folder.bind(this, this.database.InsertCameraData));
	}

}

const SecondsToMilliseconds = (seconds) => seconds * 1000;

function IfDirectoryExistsDo(directory, callback) {
	const ENOENT = -2;
	fs.stat(directory, (err, stats) => {
		if (err) {
			if (err.errno == ENOENT) {
				return;
			}
			throw err;
		}
		callback(directory);
	});
}

function deleteOldFiles(dir, ageInSeconds = 600) {
	console.log(`[${new Date()}]:`,
		"Attempting to delete old files in", dir);
	fs.readdir(dir, (error, files) => { files.forEach(deleteIfShould); });

	function deleteIfShould(file, index) {
		if (file && file[0] == '.') {
			return;
		}
		function statCallback(err, stat) {
			var endTime, now;
			if (err) { return console.error(err); }
			now = new Date().getTime();
			endTime = new Date(stat.ctime).getTime()
						+ SecondsToMilliseconds(ageInSeconds);
			if (now > endTime) {
				return rimraf(path.join(dir, file), function(err) {
					if (err) { return console.error(err); }
					console.log('successfully deleted', file);
				});
			}
		}
		fs.stat(path.join(dir, file), statCallback);
	}
}

function Start(database) {
	return new PeriodicEvents(database);
}

module.exports = {
	start: Start
};
