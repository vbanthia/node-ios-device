#!/usr/bin/env node

if (process.platform !== 'darwin') {
	console.warn('Unable to build node-ios-device for ' + process.platform);
	process.exit(0);
}

var targets = [
	'0.10.48',     // 11
	// '0.12.18',  // 14 UNSUPPORTED BY Xcode 8.3
	// '1.0.4'     // 42 UNSUPPORTED BY Xcode 8.3
	// '1.8.4'     // 43 UNSUPPORTED BY Xcode 8.3
	// '2.5.0'     // 44 UNSUPPORTED BY Xcode 8.3
	'3.3.1',       // 45
	'4.8.3',       // 46
	'5.12.0',      // 47
	'6.10.3',      // 48
	'7.10.0',      // 51
	'8.0.0'        // 57
];

var path = require('path');
var nodePreGyp = path.resolve(__dirname, '..', 'node_modules', 'node-pre-gyp', 'bin', 'node-pre-gyp');
var actions = [ 'rebuild' ];

if (process.env.npm_lifecycle_event === 'prepublish') {
	var argv = JSON.parse(process.env.npm_config_argv);
	var isPublish = argv.cooked.indexOf('publish') !== -1;
	if (isPublish) {
		actions.push('package', 'publish');
	}
}

var spawnSync = require('child_process').spawnSync;
var exitCode = 0;

targets.forEach(function (target) {
	var args = [ nodePreGyp ].concat('--target=' + target, actions);
	console.log('Executing:', process.execPath, args.join(' '));
	var result = spawnSync(process.execPath, args, { stdio: 'inherit' });
	if (result.status) {
		exitCode = 1;
	}
});

process.exit(exitCode);
