(function (window) {

    'use strict';

    class WXmlHttpRequest {

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

        setHardcode(key, value) {
            this.xhr.hardcode[key] = value;
            return this;
        }
        getHardcode() {
            return this.xhr.hardcode;
        }
        deleteHardcode(key) {
            let hardcode = this.getHardcode();
            if (hardcode.hasOwnProperty(key)) delete this.xhr.hardcode[key];
            return this;
        }
        setCallbackSuccess(func) {
            this.xhr.callback.success = func;
            return this;
        }
        getCallbackSuccess() {
            return this.xhr.callback.success;
        }
        setCallbackFail(func) {
            this.xhr.callback.fail = func;
            return this;
        }
        getCallbackFail() {
            return this.xhr.callback.fail;
        }
        getXHR() {
            return this.xhr.construct;
        }
        setRequestUrl(url) {
            this.xhr.url = url;
            return this;
        }
        getRequestUrl() {
            return this.xhr.url;
        }
        setCallbackEverywhere(func) {
            this.xhr.callback.everywhere = func;
            return this;
        }
        getCallbackEverywhere() {
            return this.xhr.callback.everywhere;
        }
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
        error() {
            this.xhr.error = this.xhr.error + 1;
            if (this.xhr.error <= 4)
                setTimeout(this.request.bind(this), 1e3, this.getCallbackEverywhere());
        }
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
        handleEvent(event) {
            if (typeof this[event.type] === 'function')
                return this[event.type].call(this, event);
        }
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