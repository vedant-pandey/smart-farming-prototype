/// <reference path="metron.extenders.ts" />
/// <reference path="metron.types.ts" />
/// <reference path="metron.ts" />

namespace metron {
    export namespace tools {
        export function reduceObject<T>(key: string, obj: T[]): Array<any> {
            let resp = [];
            obj.forEach(function (val, idx) {
                for (let k in val) {
                    if (k === key) {
                        resp.push(val[k]);
                    }
                }
            });
            return resp;
        }
        export function normalizeModelItems(obj: any, model: string, first: boolean = false): Array<any> {
            var result = obj;
            if (!first) {
                if (obj[model] != null) {
                    result = obj[model];
                }
            }
            else {
                if (obj[model] != null) {
                    result = obj[model][0];
                }
            }
            return result;
        }
        export function normalizeModelData(obj: any): any {
            for (let k in obj) {
                if (obj[k] == null || obj[k] === "null") {
                    delete obj[k];
                }
            }
            return obj;
        }
        export function formatOptions(attr: string, opt: OptionTypes = OptionTypes.KEYVALUE): any {
            var pairDivider;
            var optDivider;
            switch (opt) {
                case OptionTypes.QUERYSTRING:
                    pairDivider = "&";
                    optDivider = "=";
                    break;
                default:
                    pairDivider = ";";
                    optDivider = ":";
                    break;
            }
            var pairs = attr.split(pairDivider);
            if (pairs[pairs.length - 1].trim() == "") {
                pairs.pop();
            }
            var result = "";
            for (let i = 0; i < pairs.length; i++) {
                let p = pairs[i].split(optDivider);
                try {
                    result += `"${p[0].trim()}":"${p[1].trim()}"`;
                    if (i != (pairs.length - 1)) {
                        result += ",";
                    }
                }
                catch (e) {
                    throw new Error("Error: Invalid key/value pair!");
                }
            }
            var response = null;
            try {
                response = JSON.parse(`{${result}}`);
            }
            catch (e) {
                throw new Error("Error: Invalid JSON for options!");
            }
            return response;
        }
        export function cleanURL(url: string): string {
            if (url.startsWith("//")) {
                url = url.substring(1);
            }
            if (url.endsWith("?")) {
                url = url.substring(0, url.length - 1);
            }
            if (url == "/") {
                return "";
            }
            return url;
        }
        export function normalizeURL(url: string): string {
            if (url.endsWith("/")) {
                return url.substr(0, (url.length - 2));
            }
            return url;
        }
        export function loadJSON(url: string, callback: Function): void {
            if (!url.contains("://")) {
                url = `${window.location.protocol}//${normalizeURL(window.location.host)}/${url}`;
            }
            metron.web.get(`${url}`, {}, null, "JSON", function (data: JSON) {
                if (callback != null) {
                    callback(data);
                }
            });
        }
        export function getMatching(text: string, regex: RegExp) {
            let match = regex.exec(text);
            if (match[1] !== undefined) {
                if (match[1].contains("\"")) { //Edge isn't handling regex matches correctly
                    return match[1].split("\"")[0];
                }
                return match[1];
            }
            return null;
        }
        export function getDataPrimary(key: string, values: string): any {
            return values.getValueByKey(key);
        }
        export function formatMessage(message: string, length?: number): string {
            try {
                let len = (length != null && length > 0) ? length : 15;
                if (message.split(" ").length > len) {
                    return message.truncateWords(len) + "...";
                }
            }
            catch (e) {
            }
            return message;
        }
        export function formatDecimal(num: number): string {
            return num.toFixed(2);
        }
        export function formatDate(datetime: string): string {
            if (datetime != null && datetime.indexOf("T") != -1) {
                return datetime.split("T")[0];
            }
            return "";
        }
        export function formatDateTime(datetime: string): string {
            if (datetime != null) {
                let d = new Date(datetime);
                let m = d.getMonth() + 1;
                let mm = m < 10 ? "0" + m : m;
                let dd = d.getDate();
                let ddd = dd < 10 ? "0" + dd : dd;
                let y = d.getFullYear();
                let time = formatTime(d);
                return `${mm}-${ddd}-${y} ${time}`;
            }
            return "";
        }
        export function formatTime(datetime: Date): string {
            var h = datetime.getHours();
            var m = datetime.getMinutes();
            var ampm = h >= 12 ? "pm" : "am";
            h = h % 12;
            h = h ? h : 12;
            var mm = m < 10 ? "0" + m : m;
            var result = `${h}:${mm} ${ampm}`;
            return result;
        }
        export function formatBoolean(b: string): string {
            if (b.toBool()) {
                return "yes";
            }
            return "no";
        }
    }
}
