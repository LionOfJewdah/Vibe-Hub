#!/usr/bin/env node
const server = require('./server');
const Frontend_module = require('./frontEndHandler');
const Bar_end_module = require('./barDataReceiver');
const database = require('./database/handle');
const bar_end_receiver = Bar_end_module(server, database, require('./routes/backEnd'));
const frontend_server = Frontend_module(server, database, require('./routes/frontEnd'));
