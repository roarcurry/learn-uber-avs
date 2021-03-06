// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {XVIZLiveLoader} from 'streetscape.gl';

import {getQueryVariable} from "./utils";

export default new XVIZLiveLoader({
  // vehicleNo: getQueryVariable('vehicleNo') ? getQueryVariable('vehicleNo') : '湘A18916',
  host: getQueryVariable('host') ? getQueryVariable('host') : '172.16.1.1',
  port: getQueryVariable('port') ? getQueryVariable('port') : '8888',


  // logGuid: 'mock',
  bufferLength: 10,
  serverConfig: {
    defaultLogLength: 30,
    // serverUrl: 'ws://localhost:8081'
    serverUrl: 'ws://localhost:3000'
    // serverUrl: 'ws://172.18.1.76:8081'
    // serverUrl: 'ws://172.18.1.76:8090'
  },
  worker: true,
  maxConcurrency: 4,
  session_type: 'live'
});
