// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {default as path} from 'path';

import {XVIZProviderSession} from './xviz-provider-session';
import {XVIZJSONProvider} from "@xviz/io";

// Setup the source and return an XVIZSession or null
export class XVIZProviderHandler {
    constructor(options) {
        this.options = options;

        this.sessionCount = 0;
    }

    async newSession(socket, req, source) {
        let provider = null;

        // TODO: reconsile cli options with request options
        provider = new XVIZJSONProvider({source, options: {...req.params, logger: this.options.logger}});

        if (provider) {
            return new XVIZProviderSession(socket, req, provider, {
                ...this.options,
                id: this.sessionCount++
            });
        }

        this.options.logger.log('[> Provider] no provider found');
        return null;

    }
}
