"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TidyConfig = void 0;
class TidyConfig {
    allowAMP = false;
    allowCustomHandlers = true;
    allowRedirects = true;
    silent = true;
    /**
     * Fetch a copy of the current config.
     * You can then pass this to `setMany` if
     * you want to sync with another TidyConfig instance.
     *
     * @returns A copy of the current config
     */
    copy() {
        return {
            allowAMP: this.allowAMP,
            allowCustomHandlers: this.allowCustomHandlers,
            allowRedirects: this.allowRedirects,
            silent: this.silent
        };
    }
    /**
     * You can just use `config.key` but yeah.
     * @param key The key you're wanting to get the value of
     * @returns The value
     */
    get(key) {
        return this[key];
    }
    /**
     * Set a single config option. If you want to set multiple at once
     * use `setMany`
     * @param key Option to set
     * @param value Value to set it to
     */
    set(key, value) {
        this[key] = value;
    }
    /**
     * Set multiple config options at once by passing it an object.
     * @param obj An object containing any number of config options
     */
    setMany(obj) {
        Object.keys(obj).forEach((_key) => {
            const key = _key;
            const val = obj[key] ?? this[key];
            if (typeof this[key] === 'undefined') {
                throw new Error(`'${key}' is not a valid config key`);
            }
            this.set(key, val);
        });
    }
}
exports.TidyConfig = TidyConfig;
