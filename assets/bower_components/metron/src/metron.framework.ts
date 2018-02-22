/// <reference path="../node_modules/@types/rsvp/index.d.ts" />
/// <reference path="metron.extenders.ts" />
/// <reference path="metron.optional.ts" />
/// <reference path="metron.ts" />
/// <reference path="metron.lists.ts" />
/// <reference path="metron.forms.ts" />
/// <reference path="metron.tools.ts" />
/// <reference path="metron.templates.ts" />

namespace metron {
    export var globals: any = {
          actions: { }
        , forms: { }
        , lists: { }
    };
    export function onready(callback: Function) {
        document.addEventListener("DOMContentLoaded", function (e) {
            if (metron.templates.master.hasMaster(document.documentElement.outerHTML)) {
                metron.templates.master.loadMaster(document.documentElement.outerHTML);
            }
            document.selectAll("[data-m-type='markdown']").each((idx: number, elem: Element) => {
                (<HTMLElement>elem).innerHTML = metron.templates.markdown.toHTML((<HTMLElement>elem).innerHTML);
            });
            metron.fw.loadOptionalFunctionality();
            let root: string = metron.fw.getApplicationRoot(document.documentElement.outerHTML);
            let ajx = new RSVP.Promise(function (resolve, reject) {
                metron.tools.loadJSON(`${root}/metron.json`, (configData: JSON) => {
                    for (let obj in configData) {
                        if (globals[obj] == null) {
                            globals[obj] = configData[obj];
                        }
                    }
                    resolve(configData);
                });
            });
            RSVP.all([ajx]).then(function () {
                if (callback != null) {
                    callback(e);
                }
            }).catch(function (reason) {
                console.log("Error: Promise execution failed!");
            });
        });
    }
    export function load(segment: string, model: string, func: Function) {
        if (document.selectOne(`[data-m-type="${segment}"][data-m-model="${model}"]`) != null) {
            func();
        }
    }
    export function ifQuerystring(callback: Function): void {
        let qs: string = <string><any>metron.web.querystring();
        if (qs != "") {
            let parameters = metron.tools.formatOptions(qs, metron.OptionTypes.QUERYSTRING);
            if (callback != null) {
                callback(parameters);
            }
        }
    }
    export namespace fw {
        export function getApplicationRoot(page: string): string {
            let root: string = (document.selectOne("body[data-m-root]") != null) ? `${document.selectOne("body[data-m-root]").attribute("data-m-root")}` : null;
            if (root == null) {
                root = metron.tools.getMatching(page, /\{\{m:root=\"(.*)\"\}\}/g);
            }
            metron.globals["config.root"] = root;
            return root;
        }
        export function getBaseUrl(): string {
            if (metron.globals["config.baseURL"] != null) {
                return ((<string>metron.globals["config.baseURL"]).endsWith("/")) ? (<string>metron.globals["config.baseURL"]).substr(0, (<string>metron.globals["config.baseURL"]).length - 2) : `${metron.globals["config.baseURL"]}`;
            }
            return "";
        }
        export function getAppUrl(): string {
            if (metron.globals["config.baseURL"] != null) {
                let url = ((<string>metron.globals["config.baseURL"]).endsWith("/")) ? (<string>metron.globals["config.baseURL"]).substr(0, (<string>metron.globals["config.baseURL"]).length - 2) : `${metron.globals["config.baseURL"]}`;
                return (metron.globals["config.root"] != null && metron.globals["config.root"] != "") ? `${url}/${metron.globals["config.root"]}` : url;
            }
            return "";
        }
        export function getBaseAPI(): string {
            if (metron.globals["config.api.dir"] != null) {
                let url = ((<string>metron.globals["config.api.dir"]).endsWith("/")) ? (<string>metron.globals["config.api.dir"]).substr(0, (<string>metron.globals["config.api.dir"]).length - 2) : `${metron.globals["config.api.dir"]}`;
                return (metron.globals["config.root"] != null && metron.globals["config.root"] != "") ? `${metron.globals["config.root"]}/${url}` : url;
            }
            return "";
        }
        export function getAPIExtension(): string {
            if (metron.globals["config.api.extension"] != null) {
                return metron.globals["config.api.extension"];
            }
            return "";
        }
        export function getAPIURL(model: string): string {
            return `${metron.fw.getBaseUrl()}/${metron.fw.getBaseAPI()}/${model}${metron.fw.getAPIExtension()}`;
        }
        export function loadOptionalFunctionality(): void {
            if (typeof Awesomplete !== undefined) {
                document.selectAll("[data-m-autocomplete]").each((idx: number, elem: Element) => {
                    let endpoint = elem.attribute("data-m-autocomplete");
                    let label: string = elem.attribute("data-m-label");
                    let val: string = elem.attribute("data-m-value");
                    let target = elem.attribute("data-m-target");
                    let auto = new Awesomplete(elem, { minChars: 1 });
                    elem.addEvent("keydown", (e) => {
                        let elemVal = (<HTMLInputElement>elem).value;
                        if (elemVal != "" && elemVal.trim().length > 1) {
                            metron.web.get(`${metron.fw.getAPIURL(endpoint)}?${target}=${elemVal}`, {}, null, "json", (result) => {
                                auto.list = result;
                                auto.data = function (item, input) {
                                    return { value: item[val], label: `(${item[val]}) ${item[label]}` };
                                };
                            });
                        }
                    });
                });
            }
        }
    }
    metron.onready(function (e: Event) {
        let wantsAutoload: boolean = ((document.selectOne("[data-m-autoload]") != null) && (document.selectOne("[data-m-autoload]").attribute("data-m-autoload") == "true"));
        document.selectAll("[data-m-state='hide']").each((idx: number, elem: Element) => {
            elem.hide();
        });
        if (wantsAutoload) {
            metron.lists.bindAll(() => {
                metron.forms.bindAll();
            });
        }
    });
}
