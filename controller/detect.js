// controller/detect.js
// plans detections

function detect(confidence_threshold = 0.25) {
	const fs = require('fs'),
		child_process = require('child_process');

	const home_dir = require('os').homedir(),
		darknetExec = '/usr/local/bin/darknet',
		cv_dir = `${home_dir}/computer_vision`,
		darknet_dir = `${cv_dir}/darknet`,
		yolo_config = `${darknet_dir}/cfg/yolov3.cfg`,
		weights = `${darknet_dir}/yolov3.weights`,
		image_dir = `${cv_dir}/images`;

	const confidence_threshold = 0.25;
	const yolo_args = ['detect', yolo_config, weights, 
		'-thresh', confidence_threshold];
	const queue_file = 'plan.queue';
	const yolo_process = child_process.spawn(darknetExec, yolo_args, {
		cwd: `${__dirname}/public`
	});
	const plan = fs.createReadStream(queue_file);
	plan.pipe(yolo_process.stdin);

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

module.exports = {
	Detect: detect
}
