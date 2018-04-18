'use strict';
const Config = require('../config');
const MyTime = require('./util').Time_HH_MM;
const Detect = require('./detect');
const database = require('../database/handle');
const fs = require('fs'), path = require('path');
const rimraf = require('rimraf');
const cron = require('node-schedule');

const uploadDir = Config.UploadFolder;

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

function DetectThisMinute(database) {
	const time = new Date();
	const aMinuteAgo = time.valueOf() - SecondsToMilliseconds(60);
	const time_dir = MyTime(new Date(aMinuteAgo));
	const directory = path.resolve(uploadDir, time_dir);
	IfDirectoryExistsDo(directory, Detect.Folder.bind(this, database.InsertCameraData));
}

function deleteOldFiles(dir, ageInSeconds = 600) {
	console.log("Attempting to delete old files in", dir);
	fs.readdir(dir, (error, files) => { files.forEach(deleteIfShould); });

	function deleteIfShould(file, index) {
		if (file && file[0] == '.') {
			return;
		}
		function statCallback(err, stat) {
			var endTime, now;
			if (err) { return console.error(err); }
			now = new Date().getTime();
			endTime = new Date(stat.ctime).getTime() + SecondsToMilliseconds(ageInSeconds);
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
	console.log("PeriodicEvents.start() called.")
	setTimeout(() => {
		deleteOldFiles(uploadDir, 600);
		setInterval(deleteOldFiles.bind(this, uploadDir, 600),
			SecondsToMilliseconds(300));
	}, SecondsToMilliseconds(10));

	cron.scheduleJob("0 * * * * *", DetectThisMinute.bind(this, database));
}

module.exports = {
	start: Start
};
