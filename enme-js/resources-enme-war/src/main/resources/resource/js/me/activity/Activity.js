/*
 * Copyright 2013 encuestame
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/***
 *  @author juanpicado19D0Tgm@ilDOTcom
 *  @version 1.146
 *  @module Activity
 *  @namespace Notifications
 *  @class Activity
 */
define(["dojo",
        "dojo/dom",
        'dojo/_base/unload',
        'dojox/cometd',
         "me/core/enme",
        'dojo/domReady!'], function(
            dojo,
            dom,
            unloader,
            cometd,
            _ENME) {

        // Disconnect when the page unloads
        unloader.addOnUnload(function() {
            cometd.disconnect(true);
        });

        /**
         * Create a Activity Object..
         * @param _options a list of options to customize the connection with cometd server
         * @param wekbsocketSupport enable the websocket support
         * @constructor Activity
         */
        var Activity = function (_options, wekbsocketSupport) {
            this.options = _options;
            this.options.websocket = wekbsocketSupport || false;
            this.cometd = cometd;
            this._connected = false;
        };


        /**
         * Connect
         * @method
         */
        Activity.prototype.connect = function () {
            var parent = this;
            this.cometd.websocketEnabled = this.options.websocket;
            this.cometd .configure({
                    url: this.options.url,
                    logLevel: this.options.logLevel,
                    maxConnections : this.options.maxConnections,
                    maxNetworkDelay : this.options.maxNetworkDelay
            });

            /**
             * Function that manages the connection status with the Bayeux server
             * @method _metaConnect
             */
            var _metaConnect = function(message) {
                // check if the cometd server is disconected
                if (parent.cometd.isDisconnected()) {
                    parent._connected = false;
                    parent._connectionClosed();
                    return;
                }

                var wasConnected = parent._connected;
                parent._connected = message.successful === true;
                if (!wasConnected && parent._connected) {
                     parent._connectionEstablished();
                } else if (wasConnected && !parent._connected) {
                     parent._connectionBroken();
                }
            };

            /**
             * Function invoked when first contacting the server and when the server has lost the state of this client
             * @method _metaHandshake
             */
            var _metaHandshake = function(handshake) {
                if (handshake.successful === true) {
                    parent.clientId = handshake.clientId;
                    cometd.batch(function() {
                        cometd.subscribe('/service/notification/status', function(message) {
                           dojo.publish('/notifications/service/messages', message.data);
                        });
                        // Publish on a service channel since the message is for the server only
                        cometd.publish('/service/notification/status', { r: '0' });
                    });
                }
            };
            this.cometd .addListener('/meta/handshake', _metaHandshake);
            this.cometd .addListener('/meta/connect', _metaConnect);
            this.cometd .handshake();
        };

        /**
         * This method is triggered when the connection with cometd server re established
         * @method _connectionEstablished
         */
        Activity.prototype._connectionEstablished = function () {
                //_ENME.log('CometD Connection Established');
                dojo.publish('/activity/connection/established');
        };

        /**
         * This method is triggered when the connection with cometd server is broken
         * @method _connectionBroken
         */
        Activity.prototype._connectionBroken = function () {
                //_ENME.log('CometD Connection Broken');
                dojo.publish('/activity/connection/broken');
        };

        /**
         * This method is triggered when the connection with cometd server is closed
         * @method _connectionClosed
         */
        Activity.prototype._connectionClosed = function() {
                //_ENME.log('<div>CometD Connection Closed');
                dojo.publish('/activity/connection/closed');
        };

        return Activity;
    }
);