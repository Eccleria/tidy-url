"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlers = void 0;
const utils_1 = require("./utils");
/**
 * This is currently experimental while I decide on how I want to restructure the main code to make it easier to follow.
 * There will need to be handlers for each process of the "clean" as well as these custom cases for sites that mix it up.
 * If you would like to help or give your thoughts feel free to open an issue on GitHub.
 */
exports.handlers = {};
exports.handlers['patchbot.io'] = {
    exec: (_str, args) => {
        try {
            const dec = args.decoded.replace(/%3D/g, '=');
            return { url: decodeURIComponent(dec.split('|')[2]) };
        }
        catch (error) {
            if (`${error}`.startsWith('URIError'))
                error = new Error('Unable to decode URI component. The URL may be invalid');
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['urldefense.proofpoint.com'] = {
    exec: (_str, args) => {
        try {
            const arg = args.urlParams.get('u');
            if (arg === null)
                throw new Error('Target parameter (u) was null');
            const url = decodeURIComponent(arg.replace(/-/g, '%')).replace(/_/g, '/').replace(/%2F/g, '/');
            return { url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['stardockentertainment.info'] = {
    exec: (str, args) => {
        try {
            const target = str.split('/').pop();
            let url = '';
            if (typeof target == 'undefined')
                throw new Error('Undefined target');
            url = (0, utils_1.decodeBase64)(target);
            if (url.includes('watch>v='))
                url = url.replace('watch>v=', 'watch?v=');
            return { url: url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['steam.gs'] = {
    exec: (str, args) => {
        try {
            const target = str.split('%3Eutm_').shift();
            let url = '';
            if (target)
                url = target;
            return { url: url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['0yxjo.mjt.lu'] = {
    exec: (str, args) => {
        try {
            const target = str.split('/').pop();
            let url = '';
            if (typeof target == 'undefined')
                throw new Error('Undefined target');
            url = (0, utils_1.decodeBase64)(target);
            return { url: url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['click.redditmail.com'] = {
    exec: (str, args) => {
        try {
            const reg = /https:\/\/click\.redditmail\.com\/CL0\/(.*?)\//gi;
            const matches = (0, utils_1.regexExtract)(reg, str);
            if (typeof matches[1] === 'undefined')
                throw new Error('regexExtract failed to find a URL');
            const url = decodeURIComponent(matches[1]);
            return { url: url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['deals.dominos.co.nz'] = {
    exec: (str, args) => {
        try {
            const target = str.split('/').pop();
            let url = '';
            if (!target)
                throw new Error('Missing target');
            url = (0, utils_1.decodeBase64)(target);
            return { url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['redirectingat.com'] = {
    exec(str, args) {
        try {
            let url = '';
            const [host, target, ..._other] = str.split('?id');
            // Make sure the redirect rule hasn't already processed this
            if (host === 'https://go.redirectingat.com/') {
                const decoded = decodeURIComponent(target);
                const corrected = new URL(`${host}?id=${decoded}`);
                const param = corrected.searchParams.get('url');
                // Make sure the decoded parameters are a valid URL
                if (param && (0, utils_1.validateURL)(param) === true) {
                    url = param;
                }
                else {
                    throw Error('Handler failed, result: ' + param);
                }
            }
            else {
                // If the host is different nothing needs to be modified
                url = args.originalURL;
            }
            return { url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
exports.handlers['twitch.tv-email'] = {
    note: 'This is used for email tracking',
    exec(str, args) {
        try {
            // This is the regex used to extract the decodable string
            const reg = /www\.twitch\.tv\/r\/e\/(.*?)\//;
            let url = '';
            // Extract the decodable string from the URL
            let data = (0, utils_1.regexExtract)(reg, str);
            // The second result is what we want
            let decode = (0, utils_1.decodeBase64)(data[1]);
            // Parse the string, this should be JSON
            let parse = JSON.parse(decode);
            /**
             * This one is a bit tricky. I don't use Twitch often so I've limited it to "twitch_favorite_up",
             * In my case this was when a streamer I follow came online.
             */
            if (parse['name'] === 'twitch_favorite_up') {
                url = 'https://www.twitch.tv/' + parse.channel;
            }
            return { url };
        }
        catch (error) {
            return { url: args.originalURL, error };
        }
    }
};
