(function (window) {

    'use strict';

    class WXmlHttpRequest {

        /**
         * The constructor function creates an object that has a property called xhr. 
         * The xhr property is an object that has a property called construct. 
         * The construct property is an object that has a property called addEventListener. 
         * The addEventListener property is a function that has a parameter called event. 
         * The event parameter is an object that has a property called target. 
         * The target property is an object that has a property called responseText. 
         * The responseText property is a string that has a value of null. 
         * 
         * The constructor function also creates an object that has a property called xhr. 
         * The xhr property is an object that has a property called construct. 
         * The construct property is an object that has a property called addEventListener. 
         * The addEventListener property is a function that has a parameter called event. 
         * The event parameter is an object that has a property called target. 
         */

        constructor() {
            this.xhr = {
                url: null,
                error: 0,
                hardcode: {},
                construct: new XMLHttpRequest(),
                callback: {
                    fail: null,
                    success: null,
                    everywhere: null
                }
            };

            this.xhr.construct.addEventListener('load', this, false);
            this.xhr.construct.addEventListener('error', this, false);
        }

        /**
         * Set a hardcoded value for a key
         * @param key - The name of the parameter.
         * @param value - The value to set.
         * @returns The object itself.
         */

        setHardcode(key, value) {
            this.xhr.hardcode[key] = value;
            return this;
        }

        /**
         * It returns the hardcode value.
         * @returns The hardcode property of the XHR object.
         */

        getHardcode() {
            return this.xhr.hardcode;
        }

        /**
         * Delete a hardcoded value from the hardcoded object
         * @param key - The key to delete.
         * @returns The object itself.
         */

        deleteHardcode(key) {
            let hardcode = this.getHardcode();
            if (hardcode.hasOwnProperty(key)) delete this.xhr.hardcode[key];
            return this;
        }

        /**
         * Set the success callback for the XHR object
         * @param func - The function to be called when the request is successful.
         * @returns The `ajax` function is being returned.
         */

        setCallbackSuccess(func) {
            this.xhr.callback.success = func;
            return this;
        }

        /**
         * Get the callback function for the success event
         * @returns The success callback function.
         */

        getCallbackSuccess() {
            return this.xhr.callback.success;
        }

        /**
         * Set the callback function for the XHR request
         * @param func - The function to call when the request is complete.
         * @returns The XHR object.
         */

        setCallbackFail(func) {
            this.xhr.callback.fail = func;
            return this;
        }

        /**
         * It returns the callback function for the fail event.
         * @returns The callback function for the fail event.
         */

        getCallbackFail() {
            return this.xhr.callback.fail;
        }

        /**
         * It returns the XHR object.
         * @returns The constructor function of the XMLHttpRequest object.
         */

        getXHR() {
            return this.xhr.construct;
        }

        /**
         * Set the URL for the request
         * @param url - The URL to send the request to.
         * @returns The `setRequestUrl` method returns the `this` object.
         */

        setRequestUrl(url) {
            this.xhr.url = url;
            return this;
        }

        /**
         * Get the URL of the request
         * @returns The URL of the request.
         */

        getRequestUrl() {
            return this.xhr.url;
        }

        /**
         * Set a callback function that will be called for every request
         * @param func - The function to be called when the request is complete.
         * @returns The `ajax` function.
         */

        setCallbackEverywhere(func) {
            this.xhr.callback.everywhere = func;
            return this;
        }

        /**
         * *Returns* the callback function that is used to process the response from the server
         * @returns The callback function that is set to be called on every request.
         */

        getCallbackEverywhere() {
            return this.xhr.callback.everywhere;
        }

        /**
         * It sends a POST request to the server.
         * @param everywhere - Boolean. If true, the callback will be called for every request. If
         * false, the callback will only be called for the first request.
         * @returns Nothing.
         */

        request(everywhere) {
            let xhr = this.getXHR(),
                url = this.getRequestUrl();
            if (url === null) return;

            xhr.open('POST', url, !0);
            this.setCallbackEverywhere(everywhere);

            let data = new FormData(),
                values = this.getHardcode();
            for (let i in values)
                data.append(i, values[i]);

            xhr.send(data);

            return;
        }

        /**
         * If the request fails, try again
         */

        error() {
            this.xhr.error = this.xhr.error + 1;
            if (this.xhr.error <= 4)
                setTimeout(this.request.bind(this), 1e3, this.getCallbackEverywhere());
        }

        /**
         * * Load the JSON data from the server.
         * * If the JSON data is valid, call the success callback function.
         * * If the JSON data is invalid, call the fail callback function
         * @returns false.
         */

        load() {
            let json, xhr = this.getXHR();

            this.xhr.error = 0;

            try {
                json = JSON.parse(xhr.responseText);
            }
            catch (message) {
                json = {
                    'status': false,
                    'notice': message
                };
            }

            let everywhere = this.getCallbackEverywhere();
            if (typeof everywhere === 'function') everywhere.call(this, json);

            let func = json.status === true ? this.getCallbackSuccess() : this.getCallbackFail();
            if (typeof func === 'function') func.call(this, json);

            return false;
        }

        /**
         * If the event type is a function defined in the object, call that function
         * @param event - The event object that was passed to the handler.
         * @returns The callable event.
         */
        
        handleEvent(event) {
            if (typeof this[event.type] === 'function')
                return this[event.type].call(this, event);
        }

        /**
         * Collapse all nested objects into a single level object
         * @param object - The object to be collapsed.
         * @returns The object that is being collapsed.
         */
        
        static collapse(object) {
            let output = {};
            for (let item in object) if (object[item] instanceof Object) {
                output = Object.assign({}, output, WXmlHttpRequest.collapse(object[item]));
            } else {
                output[item] = object[item];
            }
            return output;
        }
    }

    window.WXmlHttpRequest = WXmlHttpRequest;

})(window);