#!/usr/bin/env node
'use strict';
const server = require('./server');
const FrontEndModule = require('./frontEndHandler');
const BarEndModule = require('./barDataReceiver');
const database = require('./database/handle');
const backEndServer  = BarEndModule(server, database, require('./routes/backEnd'));
const frontEndServer = FrontEndModule(server, database, require('./routes/frontEnd'));
