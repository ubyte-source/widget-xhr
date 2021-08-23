(function (window) {

    'use strict';

    class WXmlHttpRequest {

        constructor() {
            this.xhr = {
                url: null,
                hardcode: {},
                construct: new XMLHttpRequest(),
                callback: {
                    fail: null,
                    success: null,
                    everywhere: null
                }
            };
            this.xhr.construct.onreadystatechange = this.result.bind(this);
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
        request(everywhere_function) {
            let url = this.getRequestUrl();
            if (url === null) return;
            let xhr = this.getXHR();
            xhr.open('POST', url, !0);
            this.setCallbackEverywhere(everywhere_function);
            let data = new FormData(), values = this.getHardcode();
            for (let i in values) data.append(i, values[i]);
            xhr.send(data);
            return;
        }
        result() {
            let xhr = this.getXHR();
            if (XMLHttpRequest.DONE !== xhr.readyState
                || 200 !== xhr.status) return;
            let json;
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