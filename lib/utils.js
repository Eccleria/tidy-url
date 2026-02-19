"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeURL = exports.regexExtract = exports.getLinkDiff = exports.guessEncoding = exports.isB64 = exports.validateURL = exports.urlHasParams = exports.isJSON = exports.decodeBase64 = void 0;
const interface_1 = require("./interface");
/**
 * Accepts any base64 string and attempts to decode it.
 * If run through the browser `atob` will be used, otherwise
 * the code will use `Buffer.from`.
 * If there's an error the original string will be returned.
 * @param str String to be decoded
 * @returns Decoded string
 */
const decodeBase64 = (str) => {
    try {
        let result = str;
        if (typeof atob === 'undefined') {
            result = Buffer.from(str, 'base64').toString('binary');
        }
        else {
            result = atob(str);
        }
        return result;
    }
    catch (error) {
        return str;
    }
};
exports.decodeBase64 = decodeBase64;
/**
 * Checks if data is valid JSON. The result will be either `true` or `false`.
 * @param data Any string that might be JSON
 * @returns true or false
 */
const isJSON = (data) => {
    try {
        const sample = JSON.parse(data);
        if (typeof sample !== 'object')
            return false;
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isJSON = isJSON;
/**
 * Check if a domain has any URL parameters
 * @param url Any valid URL
 * @returns true / false
 */
const urlHasParams = (url) => {
    return new URL(url).searchParams.toString().length > 0;
};
exports.urlHasParams = urlHasParams;
/**
 * Determine if the input is a valid URL or not. This will only
 * accept http and https protocols.
 * @param url Any URL
 * @returns true / false
 */
const validateURL = (url) => {
    try {
        const pass = ['http:', 'https:'];
        const test = new URL(url);
        const prot = test.protocol.toLowerCase();
        if (!pass.includes(prot)) {
            throw new Error('Not acceptable protocol: ' + prot);
        }
        return true;
    }
    catch (error) {
        if (url !== 'undefined' && url !== 'null' && url.length > 0) {
            throw new Error(`Invalid URL: ` + url);
        }
        return false;
    }
};
exports.validateURL = validateURL;
/**
 * Check if a string is b64. For now this should only be
 * used in testing.
 * @param str Any possible b64 string
 * @returns true/false
 */
const isB64 = (str) => {
    try {
        const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return regex.test(str);
    }
    catch (error) {
        // Using try/catch to be safe
        return false;
    }
};
exports.isB64 = isB64;
/**
 * DO NOT USE THIS IN HANDLERS.
 * This is purely for use in testing to save time.
 * This is not reliable, there are many incorrect
 * matches and it will fail in a lot of cases.
 * Do not use it anywhere else.
 * @param str Any string
 * @returns An object with possible encodings
 */
const guessEncoding = (str) => {
    return {
        base64: (0, exports.isB64)(str),
        isJSON: (0, exports.isJSON)(str)
    };
};
exports.guessEncoding = guessEncoding;
/**
 * Calculates the difference between two links and returns an object of information.
 * @param firstURL Any valid URL
 * @param secondURL Any valid URL
 * @returns The difference between two links
 */
const getLinkDiff = (firstURL, secondURL) => {
    const oldUrl = new URL(firstURL);
    const newUrl = new URL(secondURL);
    return {
        is_new_host: oldUrl.host !== newUrl.host,
        isNewHost: oldUrl.host !== newUrl.host,
        difference: secondURL.length - firstURL.length,
        reduction: +(100 - (firstURL.length / secondURL.length) * 100).toFixed(2)
    };
};
exports.getLinkDiff = getLinkDiff;
const regexExtract = (regex, str) => {
    let matches = null;
    let result = [];
    let i = 0;
    // Limit to 10 to avoid infinite loop
    if ((matches = regex.exec(str)) !== null && i !== 10) {
        i++;
        if (matches.index === regex.lastIndex)
            regex.lastIndex++;
        matches.forEach((v) => result.push(v));
    }
    return result;
};
exports.regexExtract = regexExtract;
/**
 * These are methods that have not been written yet,
 * the original string will be returned.
 */
const _placeholder = (decoded) => decoded;
const decoders = {
    [interface_1.EEncoding.url]: (decoded) => decodeURI(decoded),
    [interface_1.EEncoding.urlc]: (decoded) => decodeURIComponent(decoded),
    [interface_1.EEncoding.base32]: _placeholder,
    [interface_1.EEncoding.base45]: _placeholder,
    [interface_1.EEncoding.base64]: (decoded) => (0, exports.decodeBase64)(decoded),
    [interface_1.EEncoding.binary]: _placeholder,
    [interface_1.EEncoding.hex]: (decoded) => {
        let hex = decoded.toString();
        let out = '';
        for (var i = 0; i < hex.length; i += 2) {
            out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return out;
    }
};
/**
 * Attempts to decode a URL or string using the selected method.
 * If the decoding fails the original string will be returned.
 * `encoding` is optional and will default to base64
 * @param str String to decode
 * @param encoding Encoding to use
 * @returns decoded string
 */
const decodeURL = (str, encoding = interface_1.EEncoding.base64) => {
    try {
        return decoders[encoding](str);
    }
    catch (error) {
        return str;
    }
};
exports.decodeURL = decodeURL;
