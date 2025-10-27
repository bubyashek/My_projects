import {
  __commonJS
} from "./chunk-CX3I3NQG.js";

// node_modules/rollbar/dist/rollbar.umd.min.js
var require_rollbar_umd_min = __commonJS({
  "node_modules/rollbar/dist/rollbar.umd.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.rollbar = e() : t.rollbar = e();
    }(exports, () => {
      return t = { 12: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        t2.exports = function(t3, e3, r2) {
          var o, i, s, a, u = n.isType(t3, "object"), c = n.isType(t3, "array"), l = [];
          if (r2 = r2 || { obj: [], mapped: [] }, u) {
            if (a = r2.obj.indexOf(t3), u && -1 !== a) return r2.mapped[a] || r2.obj[a];
            r2.obj.push(t3), a = r2.obj.length - 1;
          }
          if (u) for (o in t3) Object.prototype.hasOwnProperty.call(t3, o) && l.push(o);
          else if (c) for (s = 0; s < t3.length; ++s) l.push(s);
          var p = u ? {} : [], h = true;
          for (s = 0; s < l.length; ++s) i = t3[o = l[s]], p[o] = e3(o, i, r2), h = h && p[o] === t3[o];
          return u && !h && (r2.mapped[a] = p), h ? t3 : p;
        };
      }, 61: (t2) => {
        "use strict";
        t2.exports = { parse: function(t3) {
          var e2, r, n = { protocol: null, auth: null, host: null, path: null, hash: null, href: t3, hostname: null, port: null, pathname: null, search: null, query: null };
          if (-1 !== (e2 = t3.indexOf("//")) ? (n.protocol = t3.substring(0, e2), r = e2 + 2) : r = 0, -1 !== (e2 = t3.indexOf("@", r)) && (n.auth = t3.substring(r, e2), r = e2 + 1), -1 === (e2 = t3.indexOf("/", r))) {
            if (-1 === (e2 = t3.indexOf("?", r))) return -1 === (e2 = t3.indexOf("#", r)) ? n.host = t3.substring(r) : (n.host = t3.substring(r, e2), n.hash = t3.substring(e2)), n.hostname = n.host.split(":")[0], n.port = n.host.split(":")[1], n.port && (n.port = parseInt(n.port, 10)), n;
            n.host = t3.substring(r, e2), n.hostname = n.host.split(":")[0], n.port = n.host.split(":")[1], n.port && (n.port = parseInt(n.port, 10)), r = e2;
          } else n.host = t3.substring(r, e2), n.hostname = n.host.split(":")[0], n.port = n.host.split(":")[1], n.port && (n.port = parseInt(n.port, 10)), r = e2;
          if (-1 === (e2 = t3.indexOf("#", r)) ? n.path = t3.substring(r) : (n.path = t3.substring(r, e2), n.hash = t3.substring(e2)), n.path) {
            var o = n.path.split("?");
            n.pathname = o[0], n.query = o[1], n.search = n.query ? "?" + n.query : null;
          }
          return n;
        } };
      }, 67: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(91), i = { hostname: "api.rollbar.com", path: "/api/1/item/", search: null, version: "1", protocol: "https:", port: 443 };
        function s(t3, e3, r2, n2, o2) {
          this.options = t3, this.transport = e3, this.url = r2, this.truncation = n2, this.jsonBackup = o2, this.accessToken = t3.accessToken, this.transportOptions = a(t3, r2);
        }
        function a(t3, e3) {
          return o.getTransportFromOptions(t3, i, e3);
        }
        s.prototype.postItem = function(t3, e3) {
          var r2 = o.transportOptions(this.transportOptions, "POST"), n2 = o.buildPayload(this.accessToken, t3, this.jsonBackup), i2 = this;
          setTimeout(function() {
            i2.transport.post(i2.accessToken, r2, n2, e3);
          }, 0);
        }, s.prototype.buildJsonPayload = function(t3, e3) {
          var r2, i2 = o.buildPayload(this.accessToken, t3, this.jsonBackup);
          return (r2 = this.truncation ? this.truncation.truncate(i2) : n.stringify(i2)).error ? (e3 && e3(r2.error), null) : r2.value;
        }, s.prototype.postJsonPayload = function(t3, e3) {
          var r2 = o.transportOptions(this.transportOptions, "POST");
          this.transport.postJsonPayload(this.accessToken, r2, t3, e3);
        }, s.prototype.configure = function(t3) {
          var e3 = this.oldOptions;
          return this.options = n.merge(e3, t3), this.transportOptions = a(this.options, this.url), void 0 !== this.options.accessToken && (this.accessToken = this.options.accessToken), this;
        }, t2.exports = s;
      }, 91: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        t2.exports = { buildPayload: function(t3, e3, r2) {
          if (!n.isType(e3.context, "string")) {
            var o = n.stringify(e3.context, r2);
            o.error ? e3.context = "Error: could not serialize 'context'" : e3.context = o.value || "", e3.context.length > 255 && (e3.context = e3.context.substr(0, 255));
          }
          return { access_token: t3, data: e3 };
        }, getTransportFromOptions: function(t3, e3, r2) {
          var n2 = e3.hostname, o = e3.protocol, i = e3.port, s = e3.path, a = e3.search, u = t3.timeout, c = function(t4) {
            var e4 = "undefined" != typeof window && window || "undefined" != typeof self && self, r3 = t4.defaultTransport || "xhr";
            return void 0 === e4.fetch && (r3 = "xhr"), void 0 === e4.XMLHttpRequest && (r3 = "fetch"), r3;
          }(t3), l = t3.proxy;
          if (t3.endpoint) {
            var p = r2.parse(t3.endpoint);
            n2 = p.hostname, o = p.protocol, i = p.port, s = p.pathname, a = p.search;
          }
          return { timeout: u, hostname: n2, protocol: o, port: i, path: s, search: a, proxy: l, transport: c };
        }, transportOptions: function(t3, e3) {
          var r2 = t3.protocol || "https:", n2 = t3.port || ("http:" === r2 ? 80 : "https:" === r2 ? 443 : void 0), o = t3.hostname, i = t3.path, s = t3.timeout, a = t3.transport;
          return t3.search && (i += t3.search), t3.proxy && (i = r2 + "//" + o + i, o = t3.proxy.host || t3.proxy.hostname, n2 = t3.proxy.port, r2 = t3.proxy.protocol || r2), { timeout: s, protocol: r2, hostname: o, path: i, port: n2, method: e3, transport: a };
        }, appendPathToPath: function(t3, e3) {
          var r2 = /\/$/.test(t3), n2 = /^\//.test(e3);
          return r2 && n2 ? e3 = e3.substring(1) : r2 || n2 || (e3 = "/" + e3), t3 + e3;
        } };
      }, 108: function(t2, e2) {
        var r, n, o;
        !function() {
          "use strict";
          n = [], void 0 === (o = "function" == typeof (r = function() {
            function t3(t4) {
              return !isNaN(parseFloat(t4)) && isFinite(t4);
            }
            function e3(t4) {
              return t4.charAt(0).toUpperCase() + t4.substring(1);
            }
            function r2(t4) {
              return function() {
                return this[t4];
              };
            }
            var n2 = ["isConstructor", "isEval", "isNative", "isToplevel"], o2 = ["columnNumber", "lineNumber"], i = ["fileName", "functionName", "source"], s = ["args"], a = ["evalOrigin"], u = n2.concat(o2, i, s, a);
            function c(t4) {
              if (t4) for (var r3 = 0; r3 < u.length; r3++) void 0 !== t4[u[r3]] && this["set" + e3(u[r3])](t4[u[r3]]);
            }
            c.prototype = { getArgs: function() {
              return this.args;
            }, setArgs: function(t4) {
              if ("[object Array]" !== Object.prototype.toString.call(t4)) throw new TypeError("Args must be an Array");
              this.args = t4;
            }, getEvalOrigin: function() {
              return this.evalOrigin;
            }, setEvalOrigin: function(t4) {
              if (t4 instanceof c) this.evalOrigin = t4;
              else {
                if (!(t4 instanceof Object)) throw new TypeError("Eval Origin must be an Object or StackFrame");
                this.evalOrigin = new c(t4);
              }
            }, toString: function() {
              var t4 = this.getFileName() || "", e4 = this.getLineNumber() || "", r3 = this.getColumnNumber() || "", n3 = this.getFunctionName() || "";
              return this.getIsEval() ? t4 ? "[eval] (" + t4 + ":" + e4 + ":" + r3 + ")" : "[eval]:" + e4 + ":" + r3 : n3 ? n3 + " (" + t4 + ":" + e4 + ":" + r3 + ")" : t4 + ":" + e4 + ":" + r3;
            } }, c.fromString = function(t4) {
              var e4 = t4.indexOf("("), r3 = t4.lastIndexOf(")"), n3 = t4.substring(0, e4), o3 = t4.substring(e4 + 1, r3).split(","), i2 = t4.substring(r3 + 1);
              if (0 === i2.indexOf("@")) var s2 = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(i2, ""), a2 = s2[1], u2 = s2[2], l2 = s2[3];
              return new c({ functionName: n3, args: o3 || void 0, fileName: a2, lineNumber: u2 || void 0, columnNumber: l2 || void 0 });
            };
            for (var l = 0; l < n2.length; l++) c.prototype["get" + e3(n2[l])] = r2(n2[l]), c.prototype["set" + e3(n2[l])] = /* @__PURE__ */ function(t4) {
              return function(e4) {
                this[t4] = Boolean(e4);
              };
            }(n2[l]);
            for (var p = 0; p < o2.length; p++) c.prototype["get" + e3(o2[p])] = r2(o2[p]), c.prototype["set" + e3(o2[p])] = /* @__PURE__ */ function(e4) {
              return function(r3) {
                if (!t3(r3)) throw new TypeError(e4 + " must be a Number");
                this[e4] = Number(r3);
              };
            }(o2[p]);
            for (var h = 0; h < i.length; h++) c.prototype["get" + e3(i[h])] = r2(i[h]), c.prototype["set" + e3(i[h])] = /* @__PURE__ */ function(t4) {
              return function(e4) {
                this[t4] = String(e4);
              };
            }(i[h]);
            return c;
          }) ? r.apply(e2, n) : r) || (t2.exports = o);
        }();
      }, 175: (t2) => {
        "use strict";
        var e2 = { ieVersion: function() {
          var t3;
          if ("undefined" == typeof document) return t3;
          for (var e3 = 3, r = document.createElement("div"), n = r.getElementsByTagName("i"); r.innerHTML = "<!--[if gt IE " + ++e3 + "]><i></i><![endif]-->", n[0]; ) ;
          return e3 > 4 ? e3 : t3;
        } };
        t2.exports = e2;
      }, 197: (t2, e2, r) => {
        "use strict";
        var n = r(335), o = r(539), i = r(67), s = r(306), a = r(796), u = r(497), c = r(61), l = r(203), p = r(962), h = r(584), f = r(581), d = r(342);
        function m(t3, e3) {
          this.options = o.handleOptions(x, t3, null, s), this.options._configuredOptions = t3;
          var r2 = this.components.telemeter, a2 = this.components.instrumenter, d2 = this.components.polyfillJSON;
          this.wrapGlobals = this.components.wrapGlobals, this.scrub = this.components.scrub;
          var m2 = this.components.truncation, g2 = new u(m2), v2 = new i(this.options, g2, c, m2);
          r2 && (this.telemeter = new r2(this.options)), this.client = e3 || new n(this.options, v2, s, this.telemeter, "browser");
          var y2 = b(), w2 = "undefined" != typeof document && document;
          this.isChrome = y2.chrome && y2.chrome.runtime, this.anonymousErrorsPending = 0, function(t4, e4, r3) {
            t4.addTransform(l.handleDomException).addTransform(l.handleItemWithError).addTransform(l.ensureItemHasSomethingToSay).addTransform(l.addBaseInfo).addTransform(l.addRequestInfo(r3)).addTransform(l.addClientInfo(r3)).addTransform(l.addPluginInfo(r3)).addTransform(l.addBody).addTransform(p.addMessageWithError).addTransform(p.addTelemetryData).addTransform(p.addConfigToPayload).addTransform(l.addScrubber(e4.scrub)).addTransform(p.addPayloadOptions).addTransform(p.userTransform(s)).addTransform(p.addConfiguredOptions).addTransform(p.addDiagnosticKeys).addTransform(p.itemToPayload);
          }(this.client.notifier, this, y2), this.client.queue.addPredicate(f.checkLevel).addPredicate(h.checkIgnore).addPredicate(f.userCheckIgnore(s)).addPredicate(f.urlIsNotBlockListed(s)).addPredicate(f.urlIsSafeListed(s)).addPredicate(f.messageIsIgnored(s)), this.setupUnhandledCapture(), a2 && (this.instrumenter = new a2(this.options, this.client.telemeter, this, y2, w2), this.instrumenter.instrument()), o.setupJSON(d2), this.rollbar = this;
        }
        var g = null;
        function v(t3) {
          var e3 = "Rollbar is not initialized";
          s.error(e3), t3 && t3(new Error(e3));
        }
        function y(t3) {
          for (var e3 = 0, r2 = t3.length; e3 < r2; ++e3) if (o.isFunction(t3[e3])) return t3[e3];
        }
        function b() {
          return "undefined" != typeof window && window || "undefined" != typeof self && self;
        }
        m.init = function(t3, e3) {
          return g ? g.global(t3).configure(t3) : g = new m(t3, e3);
        }, m.prototype.components = {}, m.setComponents = function(t3) {
          m.prototype.components = t3;
        }, m.prototype.global = function(t3) {
          return this.client.global(t3), this;
        }, m.global = function(t3) {
          if (g) return g.global(t3);
          v();
        }, m.prototype.configure = function(t3, e3) {
          var r2 = this.options, n2 = {};
          return e3 && (n2 = { payload: e3 }), this.options = o.handleOptions(r2, t3, n2, s), this.options._configuredOptions = o.handleOptions(r2._configuredOptions, t3, n2), this.client.configure(this.options, e3), this.instrumenter && this.instrumenter.configure(this.options), this.setupUnhandledCapture(), this;
        }, m.configure = function(t3, e3) {
          if (g) return g.configure(t3, e3);
          v();
        }, m.prototype.lastError = function() {
          return this.client.lastError;
        }, m.lastError = function() {
          if (g) return g.lastError();
          v();
        }, m.prototype.log = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.log(t3), { uuid: e3 };
        }, m.log = function() {
          if (g) return g.log.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.debug = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.debug(t3), { uuid: e3 };
        }, m.debug = function() {
          if (g) return g.debug.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.info = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.info(t3), { uuid: e3 };
        }, m.info = function() {
          if (g) return g.info.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.warn = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.warn(t3), { uuid: e3 };
        }, m.warn = function() {
          if (g) return g.warn.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.warning = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.warning(t3), { uuid: e3 };
        }, m.warning = function() {
          if (g) return g.warning.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.error = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.error(t3), { uuid: e3 };
        }, m.error = function() {
          if (g) return g.error.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.critical = function() {
          var t3 = this._createItem(arguments), e3 = t3.uuid;
          return this.client.critical(t3), { uuid: e3 };
        }, m.critical = function() {
          if (g) return g.critical.apply(g, arguments);
          v(y(arguments));
        }, m.prototype.buildJsonPayload = function(t3) {
          return this.client.buildJsonPayload(t3);
        }, m.buildJsonPayload = function() {
          if (g) return g.buildJsonPayload.apply(g, arguments);
          v();
        }, m.prototype.sendJsonPayload = function(t3) {
          return this.client.sendJsonPayload(t3);
        }, m.sendJsonPayload = function() {
          if (g) return g.sendJsonPayload.apply(g, arguments);
          v();
        }, m.prototype.setupUnhandledCapture = function() {
          var t3 = b();
          this.unhandledExceptionsInitialized || (this.options.captureUncaught || this.options.handleUncaughtExceptions) && (a.captureUncaughtExceptions(t3, this), this.wrapGlobals && this.options.wrapGlobalEventHandlers && this.wrapGlobals(t3, this), this.unhandledExceptionsInitialized = true), this.unhandledRejectionsInitialized || (this.options.captureUnhandledRejections || this.options.handleUnhandledRejections) && (a.captureUnhandledRejections(t3, this), this.unhandledRejectionsInitialized = true);
        }, m.prototype.handleUncaughtException = function(t3, e3, r2, n2, i2, s2) {
          if (this.options.captureUncaught || this.options.handleUncaughtExceptions) {
            if (this.options.inspectAnonymousErrors && this.isChrome && null === i2 && "" === e3) return "anonymous";
            var a2, u2 = o.makeUnhandledStackInfo(t3, e3, r2, n2, i2, "onerror", "uncaught exception", d);
            o.isError(i2) ? (a2 = this._createItem([t3, i2, s2]))._unhandledStackInfo = u2 : o.isError(e3) ? (a2 = this._createItem([t3, e3, s2]))._unhandledStackInfo = u2 : (a2 = this._createItem([t3, s2])).stackInfo = u2, a2.level = this.options.uncaughtErrorLevel, a2._isUncaught = true, this.client.log(a2);
          }
        }, m.prototype.handleAnonymousErrors = function() {
          if (this.options.inspectAnonymousErrors && this.isChrome) {
            var t3 = this;
            try {
              Error.prepareStackTrace = function(e3, r2) {
                if (t3.options.inspectAnonymousErrors && t3.anonymousErrorsPending) {
                  if (t3.anonymousErrorsPending -= 1, !e3) return;
                  e3._isAnonymous = true, t3.handleUncaughtException(e3.message, null, null, null, e3);
                }
                return e3.stack;
              };
            } catch (t4) {
              this.options.inspectAnonymousErrors = false, this.error("anonymous error handler failed", t4);
            }
          }
        }, m.prototype.handleUnhandledRejection = function(t3, e3) {
          if (this.options.captureUnhandledRejections || this.options.handleUnhandledRejections) {
            var r2 = "unhandled rejection was null or undefined!";
            if (t3) if (t3.message) r2 = t3.message;
            else {
              var n2 = o.stringify(t3);
              n2.value && (r2 = n2.value);
            }
            var i2, s2 = t3 && t3._rollbarContext || e3 && e3._rollbarContext;
            o.isError(t3) ? i2 = this._createItem([r2, t3, s2]) : (i2 = this._createItem([r2, t3, s2])).stackInfo = o.makeUnhandledStackInfo(r2, "", 0, 0, null, "unhandledrejection", "", d), i2.level = this.options.uncaughtErrorLevel, i2._isUncaught = true, i2._originalArgs = i2._originalArgs || [], i2._originalArgs.push(e3), this.client.log(i2);
          }
        }, m.prototype.wrap = function(t3, e3, r2) {
          try {
            var n2;
            if (n2 = o.isFunction(e3) ? e3 : function() {
              return e3 || {};
            }, !o.isFunction(t3)) return t3;
            if (t3._isWrap) return t3;
            if (!t3._rollbar_wrapped && (t3._rollbar_wrapped = function() {
              r2 && o.isFunction(r2) && r2.apply(this, arguments);
              try {
                return t3.apply(this, arguments);
              } catch (r3) {
                var e4 = r3;
                throw e4 && window._rollbarWrappedError !== e4 && (o.isType(e4, "string") && (e4 = new String(e4)), e4._rollbarContext = n2() || {}, e4._rollbarContext._wrappedSource = t3.toString(), window._rollbarWrappedError = e4), e4;
              }
            }, t3._rollbar_wrapped._isWrap = true, t3.hasOwnProperty)) for (var i2 in t3) t3.hasOwnProperty(i2) && "_rollbar_wrapped" !== i2 && (t3._rollbar_wrapped[i2] = t3[i2]);
            return t3._rollbar_wrapped;
          } catch (e4) {
            return t3;
          }
        }, m.wrap = function(t3, e3) {
          if (g) return g.wrap(t3, e3);
          v();
        }, m.prototype.captureEvent = function() {
          var t3 = o.createTelemetryEvent(arguments);
          return this.client.captureEvent(t3.type, t3.metadata, t3.level);
        }, m.captureEvent = function() {
          if (g) return g.captureEvent.apply(g, arguments);
          v();
        }, m.prototype.captureDomContentLoaded = function(t3, e3) {
          return e3 || (e3 = /* @__PURE__ */ new Date()), this.client.captureDomContentLoaded(e3);
        }, m.prototype.captureLoad = function(t3, e3) {
          return e3 || (e3 = /* @__PURE__ */ new Date()), this.client.captureLoad(e3);
        }, m.prototype.loadFull = function() {
          s.info("Unexpected Rollbar.loadFull() called on a Notifier instance. This can happen when Rollbar is loaded multiple times.");
        }, m.prototype._createItem = function(t3) {
          return o.createItem(t3, s, this);
        };
        var w = r(441), _ = r(537), x = { version: w.version, scrubFields: _.scrubFields, logLevel: w.logLevel, reportLevel: w.reportLevel, uncaughtErrorLevel: w.uncaughtErrorLevel, endpoint: w.endpoint, verbose: false, enabled: true, transmit: true, sendConfig: false, includeItemsInTelemetry: true, captureIp: true, inspectAnonymousErrors: true, ignoreDuplicateErrors: true, wrapGlobalEventHandlers: false };
        t2.exports = m;
      }, 203: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(342), i = r(306);
        function s(t3, e3, r2) {
          var o2 = t3.message, i2 = t3.custom;
          o2 || (o2 = "Item sent with null or missing arguments.");
          var s2 = { body: o2 };
          i2 && (s2.extra = n.merge(i2)), n.set(t3, "data.body", { message: s2 }), r2(null, t3);
        }
        function a(t3) {
          var e3 = t3.stackInfo.stack;
          return e3 && 0 === e3.length && t3._unhandledStackInfo && t3._unhandledStackInfo.stack && (e3 = t3._unhandledStackInfo.stack), e3;
        }
        function u(t3, e3, r2) {
          var i2 = t3 && t3.data.description, s2 = t3 && t3.custom, u2 = a(t3), l = o.guessErrorClass(e3.message), p = { exception: { class: c(e3, l[0], r2), message: l[1] } };
          if (i2 && (p.exception.description = i2), u2) {
            var h, f, d, m, g, v, y, b;
            for (0 === u2.length && (p.exception.stack = e3.rawStack, p.exception.raw = String(e3.rawException)), p.frames = [], y = 0; y < u2.length; ++y) f = { filename: (h = u2[y]).url ? n.sanitizeUrl(h.url) : "(unknown)", lineno: h.line || null, method: h.func && "?" !== h.func ? h.func : "[anonymous]", colno: h.column }, r2.sendFrameUrl && (f.url = h.url), f.method && f.method.endsWith && f.method.endsWith("_rollbar_wrapped") || (d = m = g = null, (v = h.context ? h.context.length : 0) && (b = Math.floor(v / 2), m = h.context.slice(0, b), d = h.context[b], g = h.context.slice(b)), d && (f.code = d), (m || g) && (f.context = {}, m && m.length && (f.context.pre = m), g && g.length && (f.context.post = g)), h.args && (f.args = h.args), p.frames.push(f));
            p.frames.reverse(), s2 && (p.extra = n.merge(s2));
          }
          return p;
        }
        function c(t3, e3, r2) {
          return t3.name ? t3.name : r2.guessErrorClass ? e3 : "(unknown)";
        }
        t2.exports = { handleDomException: function(t3, e3, r2) {
          if (t3.err && "DOMException" === o.Stack(t3.err).name) {
            var n2 = new Error();
            n2.name = t3.err.name, n2.message = t3.err.message, n2.stack = t3.err.stack, n2.nested = t3.err, t3.err = n2;
          }
          r2(null, t3);
        }, handleItemWithError: function(t3, e3, r2) {
          if (t3.data = t3.data || {}, t3.err) try {
            t3.stackInfo = t3.err._savedStackTrace || o.parse(t3.err, t3.skipFrames), e3.addErrorContext && function(t4) {
              var e4 = [], r3 = t4.err;
              for (e4.push(r3); r3.nested || r3.cause; ) r3 = r3.nested || r3.cause, e4.push(r3);
              n.addErrorContext(t4, e4);
            }(t3);
          } catch (e4) {
            i.error("Error while parsing the error object.", e4);
            try {
              t3.message = t3.err.message || t3.err.description || t3.message || String(t3.err);
            } catch (e5) {
              t3.message = String(t3.err) || String(e5);
            }
            delete t3.err;
          }
          r2(null, t3);
        }, ensureItemHasSomethingToSay: function(t3, e3, r2) {
          t3.message || t3.stackInfo || t3.custom || r2(new Error("No message, stack info, or custom data"), null), r2(null, t3);
        }, addBaseInfo: function(t3, e3, r2) {
          var o2 = e3.payload && e3.payload.environment || e3.environment;
          t3.data = n.merge(t3.data, { environment: o2, level: t3.level, endpoint: e3.endpoint, platform: "browser", framework: "browser-js", language: "javascript", server: {}, uuid: t3.uuid, notifier: { name: "rollbar-browser-js", version: e3.version }, custom: t3.custom }), r2(null, t3);
        }, addRequestInfo: function(t3) {
          return function(e3, r2, o2) {
            var i2 = {};
            t3 && t3.location && (i2.url = t3.location.href, i2.query_string = t3.location.search);
            var s2 = "$remote_ip";
            r2.captureIp ? true !== r2.captureIp && (s2 += "_anonymize") : s2 = null, s2 && (i2.user_ip = s2), Object.keys(i2).length > 0 && n.set(e3, "data.request", i2), o2(null, e3);
          };
        }, addClientInfo: function(t3) {
          return function(e3, r2, o2) {
            if (!t3) return o2(null, e3);
            var i2 = t3.navigator || {}, s2 = t3.screen || {};
            n.set(e3, "data.client", { runtime_ms: e3.timestamp - t3._rollbarStartTime, timestamp: Math.round(e3.timestamp / 1e3), javascript: { browser: i2.userAgent, language: i2.language, cookie_enabled: i2.cookieEnabled, screen: { width: s2.width, height: s2.height } } }), o2(null, e3);
          };
        }, addPluginInfo: function(t3) {
          return function(e3, r2, o2) {
            if (!t3 || !t3.navigator) return o2(null, e3);
            for (var i2, s2 = [], a2 = t3.navigator.plugins || [], u2 = 0, c2 = a2.length; u2 < c2; ++u2) i2 = a2[u2], s2.push({ name: i2.name, description: i2.description });
            n.set(e3, "data.client.javascript.plugins", s2), o2(null, e3);
          };
        }, addBody: function(t3, e3, r2) {
          t3.stackInfo ? t3.stackInfo.traceChain ? function(t4, e4, r3) {
            for (var o2 = t4.stackInfo.traceChain, i2 = [], s2 = o2.length, a2 = 0; a2 < s2; a2++) {
              var c2 = u(t4, o2[a2], e4);
              i2.push(c2);
            }
            n.set(t4, "data.body", { trace_chain: i2 }), r3(null, t4);
          }(t3, e3, r2) : function(t4, e4, r3) {
            var i2 = a(t4);
            if (i2) {
              var l = u(t4, t4.stackInfo, e4);
              n.set(t4, "data.body", { trace: l }), r3(null, t4);
            } else {
              var p = t4.stackInfo, h = o.guessErrorClass(p.message), f = c(p, h[0], e4), d = h[1];
              t4.message = f + ": " + d, s(t4, 0, r3);
            }
          }(t3, e3, r2) : s(t3, 0, r2);
        }, addScrubber: function(t3) {
          return function(e3, r2, n2) {
            if (t3) {
              var o2 = r2.scrubFields || [], i2 = r2.scrubPaths || [];
              e3.data = t3(e3.data, o2, i2);
            }
            n2(null, e3);
          };
        } };
      }, 215: (t2) => {
        "use strict";
        var e2 = Object.prototype.hasOwnProperty, r = Object.prototype.toString, n = function(t3) {
          if (!t3 || "[object Object]" !== r.call(t3)) return false;
          var n2, o = e2.call(t3, "constructor"), i = t3.constructor && t3.constructor.prototype && e2.call(t3.constructor.prototype, "isPrototypeOf");
          if (t3.constructor && !o && !i) return false;
          for (n2 in t3) ;
          return void 0 === n2 || e2.call(t3, n2);
        };
        t2.exports = function t3() {
          var e3, r2, o, i, s, a = /* @__PURE__ */ Object.create(null), u = null, c = arguments.length;
          for (e3 = 0; e3 < c; e3++) if (null != (u = arguments[e3])) for (s in u) r2 = a[s], a !== (o = u[s]) && (o && n(o) ? (i = r2 && n(r2) ? r2 : {}, a[s] = t3(i, o)) : void 0 !== o && (a[s] = o));
          return a;
        };
      }, 263: function(t2, e2, r) {
        var n, o, i;
        !function() {
          "use strict";
          o = [r(108)], void 0 === (i = "function" == typeof (n = function(t3) {
            var e3 = /(^|@)\S+:\d+/, r2 = /^\s*at .*(\S+:\d+|\(native\))/m, n2 = /^(eval@)?(\[native code])?$/;
            return { parse: function(t4) {
              if (void 0 !== t4.stacktrace || void 0 !== t4["opera#sourceloc"]) return this.parseOpera(t4);
              if (t4.stack && t4.stack.match(r2)) return this.parseV8OrIE(t4);
              if (t4.stack) return this.parseFFOrSafari(t4);
              throw new Error("Cannot parse given Error object");
            }, extractLocation: function(t4) {
              if (-1 === t4.indexOf(":")) return [t4];
              var e4 = /(.+?)(?::(\d+))?(?::(\d+))?$/.exec(t4.replace(/[()]/g, ""));
              return [e4[1], e4[2] || void 0, e4[3] || void 0];
            }, parseV8OrIE: function(e4) {
              return e4.stack.split("\n").filter(function(t4) {
                return !!t4.match(r2);
              }, this).map(function(e5) {
                e5.indexOf("(eval ") > -1 && (e5 = e5.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(\),.*$)/g, ""));
                var r3 = e5.replace(/^\s+/, "").replace(/\(eval code/g, "("), n3 = r3.match(/ (\((.+):(\d+):(\d+)\)$)/), o2 = (r3 = n3 ? r3.replace(n3[0], "") : r3).split(/\s+/).slice(1), i2 = this.extractLocation(n3 ? n3[1] : o2.pop()), s = o2.join(" ") || void 0, a = ["eval", "<anonymous>"].indexOf(i2[0]) > -1 ? void 0 : i2[0];
                return new t3({ functionName: s, fileName: a, lineNumber: i2[1], columnNumber: i2[2], source: e5 });
              }, this);
            }, parseFFOrSafari: function(e4) {
              return e4.stack.split("\n").filter(function(t4) {
                return !t4.match(n2);
              }, this).map(function(e5) {
                if (e5.indexOf(" > eval") > -1 && (e5 = e5.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1")), -1 === e5.indexOf("@") && -1 === e5.indexOf(":")) return new t3({ functionName: e5 });
                var r3 = /((.*".+"[^@]*)?[^@]*)(?:@)/, n3 = e5.match(r3), o2 = n3 && n3[1] ? n3[1] : void 0, i2 = this.extractLocation(e5.replace(r3, ""));
                return new t3({ functionName: o2, fileName: i2[0], lineNumber: i2[1], columnNumber: i2[2], source: e5 });
              }, this);
            }, parseOpera: function(t4) {
              return !t4.stacktrace || t4.message.indexOf("\n") > -1 && t4.message.split("\n").length > t4.stacktrace.split("\n").length ? this.parseOpera9(t4) : t4.stack ? this.parseOpera11(t4) : this.parseOpera10(t4);
            }, parseOpera9: function(e4) {
              for (var r3 = /Line (\d+).*script (?:in )?(\S+)/i, n3 = e4.message.split("\n"), o2 = [], i2 = 2, s = n3.length; i2 < s; i2 += 2) {
                var a = r3.exec(n3[i2]);
                a && o2.push(new t3({ fileName: a[2], lineNumber: a[1], source: n3[i2] }));
              }
              return o2;
            }, parseOpera10: function(e4) {
              for (var r3 = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i, n3 = e4.stacktrace.split("\n"), o2 = [], i2 = 0, s = n3.length; i2 < s; i2 += 2) {
                var a = r3.exec(n3[i2]);
                a && o2.push(new t3({ functionName: a[3] || void 0, fileName: a[2], lineNumber: a[1], source: n3[i2] }));
              }
              return o2;
            }, parseOpera11: function(r3) {
              return r3.stack.split("\n").filter(function(t4) {
                return !!t4.match(e3) && !t4.match(/^Error created at/);
              }, this).map(function(e4) {
                var r4, n3 = e4.split("@"), o2 = this.extractLocation(n3.pop()), i2 = n3.shift() || "", s = i2.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
                i2.match(/\(([^)]*)\)/) && (r4 = i2.replace(/^[^(]+\(([^)]*)\)$/, "$1"));
                var a = void 0 === r4 || "[arguments not available]" === r4 ? void 0 : r4.split(",");
                return new t3({ functionName: s, args: a, fileName: o2[0], lineNumber: o2[1], columnNumber: o2[2], source: e4 });
              }, this);
            } };
          }) ? n.apply(e2, o) : n) || (t2.exports = i);
        }();
      }, 306: (t2, e2, r) => {
        "use strict";
        r(738);
        var n = r(175), o = r(539);
        t2.exports = { error: function() {
          var t3 = Array.prototype.slice.call(arguments, 0);
          t3.unshift("Rollbar:"), n.ieVersion() <= 8 ? console.error(o.formatArgsAsString(t3)) : console.error.apply(console, t3);
        }, info: function() {
          var t3 = Array.prototype.slice.call(arguments, 0);
          t3.unshift("Rollbar:"), n.ieVersion() <= 8 ? console.info(o.formatArgsAsString(t3)) : console.info.apply(console, t3);
        }, log: function() {
          var t3 = Array.prototype.slice.call(arguments, 0);
          t3.unshift("Rollbar:"), n.ieVersion() <= 8 ? console.log(o.formatArgsAsString(t3)) : console.log.apply(console, t3);
        } };
      }, 335: (t2, e2, r) => {
        "use strict";
        var n = r(513), o = r(744), i = r(777), s = r(539);
        function a(t3, e3, r2, n2, l) {
          this.options = s.merge(t3), this.logger = r2, a.rateLimiter.configureGlobal(this.options), a.rateLimiter.setPlatformOptions(l, this.options), this.api = e3, this.queue = new o(a.rateLimiter, e3, r2, this.options);
          var p = this.options.tracer || null;
          c(p) ? (this.tracer = p, this.options.tracer = "opentracing-tracer-enabled", this.options._configuredOptions.tracer = "opentracing-tracer-enabled") : this.tracer = null, this.notifier = new i(this.queue, this.options), this.telemeter = n2, u(t3), this.lastError = null, this.lastErrorHash = "none";
        }
        function u(t3) {
          t3.stackTraceLimit && (Error.stackTraceLimit = t3.stackTraceLimit);
        }
        function c(t3) {
          if (!t3) return false;
          if (!t3.scope || "function" != typeof t3.scope) return false;
          var e3 = t3.scope();
          return !(!e3 || !e3.active || "function" != typeof e3.active);
        }
        a.rateLimiter = new n({ maxItems: 0, itemsPerMinute: 60 }), a.prototype.global = function(t3) {
          return a.rateLimiter.configureGlobal(t3), this;
        }, a.prototype.configure = function(t3, e3) {
          var r2 = this.options, n2 = {};
          e3 && (n2 = { payload: e3 }), this.options = s.merge(r2, t3, n2);
          var o2 = this.options.tracer || null;
          return c(o2) ? (this.tracer = o2, this.options.tracer = "opentracing-tracer-enabled", this.options._configuredOptions.tracer = "opentracing-tracer-enabled") : this.tracer = null, this.notifier && this.notifier.configure(this.options), this.telemeter && this.telemeter.configure(this.options), u(t3), this.global(this.options), c(t3.tracer) && (this.tracer = t3.tracer), this;
        }, a.prototype.log = function(t3) {
          var e3 = this._defaultLogLevel();
          return this._log(e3, t3);
        }, a.prototype.debug = function(t3) {
          this._log("debug", t3);
        }, a.prototype.info = function(t3) {
          this._log("info", t3);
        }, a.prototype.warn = function(t3) {
          this._log("warning", t3);
        }, a.prototype.warning = function(t3) {
          this._log("warning", t3);
        }, a.prototype.error = function(t3) {
          this._log("error", t3);
        }, a.prototype.critical = function(t3) {
          this._log("critical", t3);
        }, a.prototype.wait = function(t3) {
          this.queue.wait(t3);
        }, a.prototype.captureEvent = function(t3, e3, r2) {
          return this.telemeter && this.telemeter.captureEvent(t3, e3, r2);
        }, a.prototype.captureDomContentLoaded = function(t3) {
          return this.telemeter && this.telemeter.captureDomContentLoaded(t3);
        }, a.prototype.captureLoad = function(t3) {
          return this.telemeter && this.telemeter.captureLoad(t3);
        }, a.prototype.buildJsonPayload = function(t3) {
          return this.api.buildJsonPayload(t3);
        }, a.prototype.sendJsonPayload = function(t3) {
          this.api.postJsonPayload(t3);
        }, a.prototype._log = function(t3, e3) {
          var r2;
          if (e3.callback && (r2 = e3.callback, delete e3.callback), this.options.ignoreDuplicateErrors && this._sameAsLastError(e3)) {
            if (r2) {
              var n2 = new Error("ignored identical item");
              n2.item = e3, r2(n2);
            }
          } else try {
            this._addTracingInfo(e3), e3.level = e3.level || t3, this.telemeter && this.telemeter._captureRollbarItem(e3), e3.telemetryEvents = this.telemeter && this.telemeter.copyEvents() || [], this.notifier.log(e3, r2);
          } catch (t4) {
            r2 && r2(t4), this.logger.error(t4);
          }
        }, a.prototype._defaultLogLevel = function() {
          return this.options.logLevel || "debug";
        }, a.prototype._sameAsLastError = function(t3) {
          if (!t3._isUncaught) return false;
          var e3 = function(t4) {
            var e4 = t4.message || "", r2 = (t4.err || {}).stack || String(t4.err);
            return e4 + "::" + r2;
          }(t3);
          return this.lastErrorHash === e3 || (this.lastError = t3.err, this.lastErrorHash = e3, false);
        }, a.prototype._addTracingInfo = function(t3) {
          if (this.tracer) {
            var e3 = this.tracer.scope().active();
            if (function(t4) {
              if (!t4 || !t4.context || "function" != typeof t4.context) return false;
              var e4 = t4.context();
              return !!(e4 && e4.toSpanId && e4.toTraceId && "function" == typeof e4.toSpanId && "function" == typeof e4.toTraceId);
            }(e3)) {
              e3.setTag("rollbar.error_uuid", t3.uuid), e3.setTag("rollbar.has_error", true), e3.setTag("error", true), e3.setTag("rollbar.item_url", `https://rollbar.com/item/uuid/?uuid=${t3.uuid}`), e3.setTag("rollbar.occurrence_url", `https://rollbar.com/occurrence/uuid/?uuid=${t3.uuid}`);
              var r2 = e3.context().toSpanId(), n2 = e3.context().toTraceId();
              t3.custom ? (t3.custom.opentracing_span_id = r2, t3.custom.opentracing_trace_id = n2) : t3.custom = { opentracing_span_id: r2, opentracing_trace_id: n2 };
            }
          }
        }, t2.exports = a;
      }, 342: (t2, e2, r) => {
        "use strict";
        var n = r(263), o = new RegExp("^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ");
        function i() {
          return null;
        }
        function s(t3) {
          var e3 = {};
          return e3._stackFrame = t3, e3.url = t3.fileName, e3.line = t3.lineNumber, e3.func = t3.functionName, e3.column = t3.columnNumber, e3.args = t3.args, e3.context = null, e3;
        }
        function a(t3, e3) {
          return { stack: function() {
            var r3 = [];
            e3 = e3 || 0;
            try {
              r3 = n.parse(t3);
            } catch (t4) {
              r3 = [];
            }
            for (var o3 = [], i3 = e3; i3 < r3.length; i3++) o3.push(new s(r3[i3]));
            return o3;
          }(), message: t3.message, name: (r2 = t3, o2 = r2.name && r2.name.length && r2.name, i2 = r2.constructor.name && r2.constructor.name.length && r2.constructor.name, o2 && i2 ? "Error" === o2 ? i2 : o2 : o2 || i2), rawStack: t3.stack, rawException: t3 };
          var r2, o2, i2;
        }
        t2.exports = { guessFunctionName: function() {
          return "?";
        }, guessErrorClass: function(t3) {
          if (!t3 || !t3.match) return ["Unknown error. There was no error message to display.", ""];
          var e3 = t3.match(o), r2 = "(unknown)";
          return e3 && (r2 = e3[e3.length - 1], t3 = (t3 = t3.replace((e3[e3.length - 2] || "") + r2 + ":", "")).replace(/(^[\s]+|[\s]+$)/g, "")), [r2, t3];
        }, gatherContext: i, parse: function(t3, e3) {
          var r2 = t3;
          if (r2.nested || r2.cause) {
            for (var n2 = []; r2; ) n2.push(new a(r2, e3)), r2 = r2.nested || r2.cause, e3 = 0;
            return n2[0].traceChain = n2, n2[0];
          }
          return new a(r2, e3);
        }, Stack: a, Frame: s };
      }, 352: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = 100;
        function i(t3) {
          this.queue = [], this.options = n.merge(t3);
          var e3 = this.options.maxTelemetryEvents || o;
          this.maxQueueSize = Math.max(0, Math.min(e3, o));
        }
        function s(t3, e3) {
          return e3 || ({ error: "error", manual: "info" }[t3] || "info");
        }
        i.prototype.configure = function(t3) {
          var e3 = this.options;
          this.options = n.merge(e3, t3);
          var r2 = this.options.maxTelemetryEvents || o, i2 = Math.max(0, Math.min(r2, o)), s2 = 0;
          this.queue.length > i2 && (s2 = this.queue.length - i2), this.maxQueueSize = i2, this.queue.splice(0, s2);
        }, i.prototype.copyEvents = function() {
          var t3 = Array.prototype.slice.call(this.queue, 0);
          if (n.isFunction(this.options.filterTelemetry)) try {
            for (var e3 = t3.length; e3--; ) this.options.filterTelemetry(t3[e3]) && t3.splice(e3, 1);
          } catch (t4) {
            this.options.filterTelemetry = null;
          }
          return t3;
        }, i.prototype.capture = function(t3, e3, r2, o2, i2) {
          var a = { level: s(t3, r2), type: t3, timestamp_ms: i2 || n.now(), body: e3, source: "client" };
          o2 && (a.uuid = o2);
          try {
            if (n.isFunction(this.options.filterTelemetry) && this.options.filterTelemetry(a)) return false;
          } catch (t4) {
            this.options.filterTelemetry = null;
          }
          return this.push(a), a;
        }, i.prototype.captureEvent = function(t3, e3, r2, n2) {
          return this.capture(t3, e3, r2, n2);
        }, i.prototype.captureError = function(t3, e3, r2, n2) {
          var o2 = { message: t3.message || String(t3) };
          return t3.stack && (o2.stack = t3.stack), this.capture("error", o2, e3, r2, n2);
        }, i.prototype.captureLog = function(t3, e3, r2, n2) {
          return this.capture("log", { message: t3 }, e3, r2, n2);
        }, i.prototype.captureNetwork = function(t3, e3, r2, n2) {
          e3 = e3 || "xhr", t3.subtype = t3.subtype || e3, n2 && (t3.request = n2);
          var o2 = this.levelFromStatus(t3.status_code);
          return this.capture("network", t3, o2, r2);
        }, i.prototype.levelFromStatus = function(t3) {
          return t3 >= 200 && t3 < 400 ? "info" : 0 === t3 || t3 >= 400 ? "error" : "info";
        }, i.prototype.captureDom = function(t3, e3, r2, n2, o2) {
          var i2 = { subtype: t3, element: e3 };
          return void 0 !== r2 && (i2.value = r2), void 0 !== n2 && (i2.checked = n2), this.capture("dom", i2, "info", o2);
        }, i.prototype.captureNavigation = function(t3, e3, r2) {
          return this.capture("navigation", { from: t3, to: e3 }, "info", r2);
        }, i.prototype.captureDomContentLoaded = function(t3) {
          return this.capture("navigation", { subtype: "DOMContentLoaded" }, "info", void 0, t3 && t3.getTime());
        }, i.prototype.captureLoad = function(t3) {
          return this.capture("navigation", { subtype: "load" }, "info", void 0, t3 && t3.getTime());
        }, i.prototype.captureConnectivityChange = function(t3, e3) {
          return this.captureNetwork({ change: t3 }, "connectivity", e3);
        }, i.prototype._captureRollbarItem = function(t3) {
          if (this.options.includeItemsInTelemetry) return t3.err ? this.captureError(t3.err, t3.level, t3.uuid, t3.timestamp) : t3.message ? this.captureLog(t3.message, t3.level, t3.uuid, t3.timestamp) : t3.custom ? this.capture("log", t3.custom, t3.level, t3.uuid, t3.timestamp) : void 0;
        }, i.prototype.push = function(t3) {
          this.queue.push(t3), this.queue.length > this.maxQueueSize && this.queue.shift();
        }, t2.exports = i;
      }, 356: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(12);
        function i(t3, e3) {
          var r2 = e3.split("."), o2 = r2.length - 1;
          try {
            for (var i2 = 0; i2 <= o2; ++i2) i2 < o2 ? t3 = t3[r2[i2]] : t3[r2[i2]] = n.redact();
          } catch (t4) {
          }
        }
        t2.exports = function(t3, e3, r2) {
          if (e3 = e3 || [], r2) for (var s = 0; s < r2.length; ++s) i(t3, r2[s]);
          var a = function(t4) {
            for (var e4, r3 = [], n2 = 0; n2 < t4.length; ++n2) e4 = "^\\[?(%5[bB])?" + t4[n2] + "\\[?(%5[bB])?\\]?(%5[dD])?$", r3.push(new RegExp(e4, "i"));
            return r3;
          }(e3), u = function(t4) {
            for (var e4, r3 = [], n2 = 0; n2 < t4.length; ++n2) e4 = "\\[?(%5[bB])?" + t4[n2] + "\\[?(%5[bB])?\\]?(%5[dD])?", r3.push(new RegExp("(" + e4 + "=)([^&\\n]+)", "igm"));
            return r3;
          }(e3);
          function c(t4, e4) {
            return e4 + n.redact();
          }
          return o(t3, function t4(e4, r3, i2) {
            var s2 = function(t5, e5) {
              var r4;
              for (r4 = 0; r4 < a.length; ++r4) if (a[r4].test(t5)) {
                e5 = n.redact();
                break;
              }
              return e5;
            }(e4, r3);
            return s2 === r3 ? n.isType(r3, "object") || n.isType(r3, "array") ? o(r3, t4, i2) : function(t5) {
              var e5;
              if (n.isType(t5, "string")) for (e5 = 0; e5 < u.length; ++e5) t5 = t5.replace(u[e5], c);
              return t5;
            }(s2) : s2;
          });
        };
      }, 364: (t2) => {
        "use strict";
        t2.exports = function(t3, e2, r, n, o) {
          var i = t3[e2];
          t3[e2] = r(i), n && n[o].push([t3, e2, i]);
        };
      }, 424: (t2) => {
        "use strict";
        function e2(t3, e3, r) {
          if (e3.hasOwnProperty && e3.hasOwnProperty("addEventListener")) {
            for (var n = e3.addEventListener; n._rollbarOldAdd && n.belongsToShim; ) n = n._rollbarOldAdd;
            var o = function(e4, r2, o2) {
              n.call(this, e4, t3.wrap(r2), o2);
            };
            o._rollbarOldAdd = n, o.belongsToShim = r, e3.addEventListener = o;
            for (var i = e3.removeEventListener; i._rollbarOldRemove && i.belongsToShim; ) i = i._rollbarOldRemove;
            var s = function(t4, e4, r2) {
              i.call(this, t4, e4 && e4._rollbar_wrapped || e4, r2);
            };
            s._rollbarOldRemove = i, s.belongsToShim = r, e3.removeEventListener = s;
          }
        }
        t2.exports = function(t3, r, n) {
          if (t3) {
            var o, i, s = "EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");
            for (o = 0; o < s.length; ++o) t3[i = s[o]] && t3[i].prototype && e2(r, t3[i].prototype, n);
          }
        };
      }, 435: (t2, e2, r) => {
        "use strict";
        var n = r(538);
        t2.exports = n;
      }, 440: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(306);
        function i(t3, e3) {
          var r2 = new Error(t3);
          return r2.code = e3 || "ENOTFOUND", r2;
        }
        t2.exports = function(t3, e3, r2, s, a, u, c) {
          var l;
          if (!(l = u ? u() : function() {
            var t4, e4, r3 = [function() {
              return new XMLHttpRequest();
            }, function() {
              return new ActiveXObject("Msxml2.XMLHTTP");
            }, function() {
              return new ActiveXObject("Msxml3.XMLHTTP");
            }, function() {
              return new ActiveXObject("Microsoft.XMLHTTP");
            }], n2 = r3.length;
            for (e4 = 0; e4 < n2; e4++) try {
              t4 = r3[e4]();
              break;
            } catch (t5) {
            }
            return t4;
          }())) return a(new Error("No way to send a request"));
          try {
            try {
              var p = function() {
                try {
                  if (p && 4 === l.readyState) {
                    p = void 0;
                    var t4 = n.jsonParse(l.responseText);
                    if ((s2 = l) && s2.status && 200 === s2.status) return void a(t4.error, t4.value);
                    if (function(t5) {
                      return t5 && n.isType(t5.status, "number") && t5.status >= 400 && t5.status < 600;
                    }(l)) {
                      if (403 === l.status) {
                        var e4 = t4.value && t4.value.message;
                        o.error(e4);
                      }
                      a(new Error(String(l.status)));
                    } else a(i("XHR response had no status code (likely connection failure)"));
                  }
                } catch (t5) {
                  var r3;
                  r3 = t5 && t5.stack ? t5 : new Error(t5), a(r3);
                }
                var s2;
              };
              l.open(r2, e3, true), l.setRequestHeader && (l.setRequestHeader("Content-Type", "application/json"), l.setRequestHeader("X-Rollbar-Access-Token", t3)), n.isFiniteNumber(c) && (l.timeout = c), l.onreadystatechange = p, l.send(s);
            } catch (t4) {
              if ("undefined" != typeof XDomainRequest) {
                if (!window || !window.location) return a(new Error("No window available during request, unknown environment"));
                "http:" === window.location.href.substring(0, 5) && "https" === e3.substring(0, 5) && (e3 = "http" + e3.substring(5));
                var h = new XDomainRequest();
                h.onprogress = function() {
                }, h.ontimeout = function() {
                  a(i("Request timed out", "ETIMEDOUT"));
                }, h.onerror = function() {
                  a(new Error("Error during request"));
                }, h.onload = function() {
                  var t5 = n.jsonParse(h.responseText);
                  a(t5.error, t5.value);
                }, h.open(r2, e3, true), h.send(s);
              } else a(new Error("Cannot find a method to transport a request"));
            }
          } catch (t4) {
            a(t4);
          }
        };
      }, 441: (t2) => {
        "use strict";
        t2.exports = { version: "2.26.5", endpoint: "api.rollbar.com/api/1/item/", logLevel: "debug", reportLevel: "debug", uncaughtErrorLevel: "error", maxItems: 0, itemsPerMin: 60 };
      }, 497: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(534), i = r(440);
        function s(t3) {
          this.truncation = t3;
        }
        s.prototype.get = function(t3, e3, r2, o2, i2) {
          o2 && n.isFunction(o2) || (o2 = function() {
          }), n.addParamsAndAccessTokenToPath(t3, e3, r2);
          var s2 = n.formatUrl(e3);
          this._makeZoneRequest(t3, s2, "GET", null, o2, i2, e3.timeout, e3.transport);
        }, s.prototype.post = function(t3, e3, r2, o2, i2) {
          if (o2 && n.isFunction(o2) || (o2 = function() {
          }), !r2) return o2(new Error("Cannot send empty request"));
          var s2;
          if ((s2 = this.truncation ? this.truncation.truncate(r2) : n.stringify(r2)).error) return o2(s2.error);
          var a = s2.value, u = n.formatUrl(e3);
          this._makeZoneRequest(t3, u, "POST", a, o2, i2, e3.timeout, e3.transport);
        }, s.prototype.postJsonPayload = function(t3, e3, r2, o2, i2) {
          o2 && n.isFunction(o2) || (o2 = function() {
          });
          var s2 = n.formatUrl(e3);
          this._makeZoneRequest(t3, s2, "POST", r2, o2, i2, e3.timeout, e3.transport);
        }, s.prototype._makeZoneRequest = function() {
          var t3 = "undefined" != typeof window && window || void 0 !== n2 && n2, e3 = t3 && t3.Zone && t3.Zone.root, r2 = Array.prototype.slice.call(arguments);
          if (e3) {
            var n2 = this;
            e3.run(function() {
              n2._makeRequest.apply(void 0, r2);
            });
          } else this._makeRequest.apply(void 0, r2);
        }, s.prototype._makeRequest = function(t3, e3, r2, n2, s2, a, u, c) {
          if ("undefined" != typeof RollbarProxy) return function(t4, e4) {
            new RollbarProxy().sendJsonPayload(t4, function(t5) {
            }, function(t5) {
              e4(new Error(t5));
            });
          }(n2, s2);
          "fetch" === c ? o(t3, e3, r2, n2, s2, u) : i(t3, e3, r2, n2, s2, a, u);
        }, t2.exports = s;
      }, 513: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        function o(t3) {
          this.startTime = n.now(), this.counter = 0, this.perMinCounter = 0, this.platform = null, this.platformOptions = {}, this.configureGlobal(t3);
        }
        function i(t3, e3, r2) {
          return !t3.ignoreRateLimit && e3 >= 1 && r2 > e3;
        }
        function s(t3, e3, r2, n2, o2, i2, s2) {
          var a = null;
          return r2 && (r2 = new Error(r2)), r2 || n2 || (a = function(t4, e4, r3, n3, o3) {
            var i3 = e4.environment || e4.payload && e4.payload.environment, s3 = { body: { message: { body: o3 ? "item per minute limit reached, ignoring errors until timeout" : "maxItems has been hit, ignoring errors until reset.", extra: { maxItems: r3, itemsPerMinute: n3 } } }, language: "javascript", environment: i3, notifier: { version: e4.notifier && e4.notifier.version || e4.version } };
            return "browser" === t4 ? (s3.platform = "browser", s3.framework = "browser-js", s3.notifier.name = "rollbar-browser-js") : "server" === t4 ? (s3.framework = e4.framework || "node-js", s3.notifier.name = e4.notifier.name) : "react-native" === t4 && (s3.framework = e4.framework || "react-native", s3.notifier.name = e4.notifier.name), s3;
          }(t3, e3, o2, i2, s2)), { error: r2, shouldSend: n2, payload: a };
        }
        o.globalSettings = { startTime: n.now(), maxItems: void 0, itemsPerMinute: void 0 }, o.prototype.configureGlobal = function(t3) {
          void 0 !== t3.startTime && (o.globalSettings.startTime = t3.startTime), void 0 !== t3.maxItems && (o.globalSettings.maxItems = t3.maxItems), void 0 !== t3.itemsPerMinute && (o.globalSettings.itemsPerMinute = t3.itemsPerMinute);
        }, o.prototype.shouldSend = function(t3, e3) {
          var r2 = (e3 = e3 || n.now()) - this.startTime;
          (r2 < 0 || r2 >= 6e4) && (this.startTime = e3, this.perMinCounter = 0);
          var a = o.globalSettings.maxItems, u = o.globalSettings.itemsPerMinute;
          if (i(t3, a, this.counter)) return s(this.platform, this.platformOptions, a + " max items reached", false);
          if (i(t3, u, this.perMinCounter)) return s(this.platform, this.platformOptions, u + " items per minute reached", false);
          this.counter++, this.perMinCounter++;
          var c = !i(t3, a, this.counter), l = c;
          return c = c && !i(t3, u, this.perMinCounter), s(this.platform, this.platformOptions, null, c, a, u, l);
        }, o.prototype.setPlatformOptions = function(t3, e3) {
          this.platform = t3, this.platformOptions = e3;
        }, t2.exports = o;
      }, 534: (t2, e2, r) => {
        "use strict";
        var n = r(306), o = r(539);
        t2.exports = function(t3, e3, r2, i, s, a) {
          var u, c;
          o.isFiniteNumber(a) && (u = new AbortController(), c = setTimeout(function() {
            u.abort();
          }, a)), fetch(e3, { method: r2, headers: { "Content-Type": "application/json", "X-Rollbar-Access-Token": t3, signal: u && u.signal }, body: i }).then(function(t4) {
            return c && clearTimeout(c), t4.json();
          }).then(function(t4) {
            s(null, t4);
          }).catch(function(t4) {
            n.error(t4.message), s(t4);
          });
        };
      }, 537: (t2) => {
        "use strict";
        t2.exports = { scrubFields: ["pw", "pass", "passwd", "password", "secret", "confirm_password", "confirmPassword", "password_confirmation", "passwordConfirmation", "access_token", "accessToken", "X-Rollbar-Access-Token", "secret_key", "secretKey", "secretToken", "cc-number", "card number", "cardnumber", "cardnum", "ccnum", "ccnumber", "cc num", "creditcardnumber", "credit card number", "newcreditcardnumber", "new credit card", "creditcardno", "credit card no", "card#", "card #", "cc-csc", "cvc", "cvc2", "cvv2", "ccv2", "security code", "card verification", "name on credit card", "name on card", "nameoncard", "cardholder", "card holder", "name des karteninhabers", "ccname", "card type", "cardtype", "cc type", "cctype", "payment type", "expiration date", "expirationdate", "expdate", "cc-exp", "ccmonth", "ccyear"] };
      }, 538: (t2) => {
        t2.exports = function(t3) {
          var e2, r, n, o, i, s, a, u, c, l, p, h, f, d = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
          function m(t4) {
            return t4 < 10 ? "0" + t4 : t4;
          }
          function g() {
            return this.valueOf();
          }
          function v(t4) {
            return d.lastIndex = 0, d.test(t4) ? '"' + t4.replace(d, function(t5) {
              var e3 = n[t5];
              return "string" == typeof e3 ? e3 : "\\u" + ("0000" + t5.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + t4 + '"';
          }
          function y(t4, n2) {
            var i2, s2, a2, u2, c2, l2 = e2, p2 = n2[t4];
            switch (p2 && "object" == typeof p2 && "function" == typeof p2.toJSON && (p2 = p2.toJSON(t4)), "function" == typeof o && (p2 = o.call(n2, t4, p2)), typeof p2) {
              case "string":
                return v(p2);
              case "number":
                return isFinite(p2) ? String(p2) : "null";
              case "boolean":
              case "null":
                return String(p2);
              case "object":
                if (!p2) return "null";
                if (e2 += r, c2 = [], "[object Array]" === Object.prototype.toString.apply(p2)) {
                  for (u2 = p2.length, i2 = 0; i2 < u2; i2 += 1) c2[i2] = y(i2, p2) || "null";
                  return a2 = 0 === c2.length ? "[]" : e2 ? "[\n" + e2 + c2.join(",\n" + e2) + "\n" + l2 + "]" : "[" + c2.join(",") + "]", e2 = l2, a2;
                }
                if (o && "object" == typeof o) for (u2 = o.length, i2 = 0; i2 < u2; i2 += 1) "string" == typeof o[i2] && (a2 = y(s2 = o[i2], p2)) && c2.push(v(s2) + (e2 ? ": " : ":") + a2);
                else for (s2 in p2) Object.prototype.hasOwnProperty.call(p2, s2) && (a2 = y(s2, p2)) && c2.push(v(s2) + (e2 ? ": " : ":") + a2);
                return a2 = 0 === c2.length ? "{}" : e2 ? "{\n" + e2 + c2.join(",\n" + e2) + "\n" + l2 + "}" : "{" + c2.join(",") + "}", e2 = l2, a2;
            }
          }
          "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + m(this.getUTCMonth() + 1) + "-" + m(this.getUTCDate()) + "T" + m(this.getUTCHours()) + ":" + m(this.getUTCMinutes()) + ":" + m(this.getUTCSeconds()) + "Z" : null;
          }, Boolean.prototype.toJSON = g, Number.prototype.toJSON = g, String.prototype.toJSON = g), "function" != typeof t3.stringify && (n = { "\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, t3.stringify = function(t4, n2, i2) {
            var s2;
            if (e2 = "", r = "", "number" == typeof i2) for (s2 = 0; s2 < i2; s2 += 1) r += " ";
            else "string" == typeof i2 && (r = i2);
            if (o = n2, n2 && "function" != typeof n2 && ("object" != typeof n2 || "number" != typeof n2.length)) throw new Error("JSON.stringify");
            return y("", { "": t4 });
          }), "function" != typeof t3.parse && (t3.parse = (l = { "\\": "\\", '"': '"', "/": "/", t: "	", n: "\n", r: "\r", f: "\f", b: "\b" }, p = { go: function() {
            i = "ok";
          }, firstokey: function() {
            u = c, i = "colon";
          }, okey: function() {
            u = c, i = "colon";
          }, ovalue: function() {
            i = "ocomma";
          }, firstavalue: function() {
            i = "acomma";
          }, avalue: function() {
            i = "acomma";
          } }, h = { go: function() {
            i = "ok";
          }, ovalue: function() {
            i = "ocomma";
          }, firstavalue: function() {
            i = "acomma";
          }, avalue: function() {
            i = "acomma";
          } }, f = { "{": { go: function() {
            s.push({ state: "ok" }), a = {}, i = "firstokey";
          }, ovalue: function() {
            s.push({ container: a, state: "ocomma", key: u }), a = {}, i = "firstokey";
          }, firstavalue: function() {
            s.push({ container: a, state: "acomma" }), a = {}, i = "firstokey";
          }, avalue: function() {
            s.push({ container: a, state: "acomma" }), a = {}, i = "firstokey";
          } }, "}": { firstokey: function() {
            var t4 = s.pop();
            c = a, a = t4.container, u = t4.key, i = t4.state;
          }, ocomma: function() {
            var t4 = s.pop();
            a[u] = c, c = a, a = t4.container, u = t4.key, i = t4.state;
          } }, "[": { go: function() {
            s.push({ state: "ok" }), a = [], i = "firstavalue";
          }, ovalue: function() {
            s.push({ container: a, state: "ocomma", key: u }), a = [], i = "firstavalue";
          }, firstavalue: function() {
            s.push({ container: a, state: "acomma" }), a = [], i = "firstavalue";
          }, avalue: function() {
            s.push({ container: a, state: "acomma" }), a = [], i = "firstavalue";
          } }, "]": { firstavalue: function() {
            var t4 = s.pop();
            c = a, a = t4.container, u = t4.key, i = t4.state;
          }, acomma: function() {
            var t4 = s.pop();
            a.push(c), c = a, a = t4.container, u = t4.key, i = t4.state;
          } }, ":": { colon: function() {
            if (Object.hasOwnProperty.call(a, u)) throw new SyntaxError("Duplicate key '" + u + '"');
            i = "ovalue";
          } }, ",": { ocomma: function() {
            a[u] = c, i = "okey";
          }, acomma: function() {
            a.push(c), i = "avalue";
          } }, true: { go: function() {
            c = true, i = "ok";
          }, ovalue: function() {
            c = true, i = "ocomma";
          }, firstavalue: function() {
            c = true, i = "acomma";
          }, avalue: function() {
            c = true, i = "acomma";
          } }, false: { go: function() {
            c = false, i = "ok";
          }, ovalue: function() {
            c = false, i = "ocomma";
          }, firstavalue: function() {
            c = false, i = "acomma";
          }, avalue: function() {
            c = false, i = "acomma";
          } }, null: { go: function() {
            c = null, i = "ok";
          }, ovalue: function() {
            c = null, i = "ocomma";
          }, firstavalue: function() {
            c = null, i = "acomma";
          }, avalue: function() {
            c = null, i = "acomma";
          } } }, function(t4, e3) {
            var r2, n2, o2 = /^[\u0020\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;
            i = "go", s = [];
            try {
              for (; r2 = o2.exec(t4); ) r2[1] ? f[r2[1]][i]() : r2[2] ? (c = +r2[2], h[i]()) : (n2 = r2[3], c = n2.replace(/\\(?:u(.{4})|([^u]))/g, function(t5, e4, r3) {
                return e4 ? String.fromCharCode(parseInt(e4, 16)) : l[r3];
              }), p[i]()), t4 = t4.slice(r2[0].length);
            } catch (t5) {
              i = t5;
            }
            if ("ok" !== i || /[^\u0020\t\n\r]/.test(t4)) throw i instanceof SyntaxError ? i : new SyntaxError("JSON");
            return "function" == typeof e3 ? function t5(r3, n3) {
              var o3, i2, s2 = r3[n3];
              if (s2 && "object" == typeof s2) for (o3 in c) Object.prototype.hasOwnProperty.call(s2, o3) && (void 0 !== (i2 = t5(s2, o3)) ? s2[o3] = i2 : delete s2[o3]);
              return e3.call(r3, n3, s2);
            }({ "": c }, "") : c;
          }));
        };
      }, 539: (t2, e2, r) => {
        "use strict";
        var n = r(215), o = {};
        function i(t3, e3) {
          return e3 === s(t3);
        }
        function s(t3) {
          var e3 = typeof t3;
          return "object" !== e3 ? e3 : t3 ? t3 instanceof Error ? "error" : {}.toString.call(t3).match(/\s([a-zA-Z]+)/)[1].toLowerCase() : "null";
        }
        function a(t3) {
          return i(t3, "function");
        }
        function u(t3) {
          var e3 = Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?"), r2 = RegExp("^" + e3 + "$");
          return c(t3) && r2.test(t3);
        }
        function c(t3) {
          var e3 = typeof t3;
          return null != t3 && ("object" == e3 || "function" == e3);
        }
        function l() {
          var t3 = y();
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e3) {
            var r2 = (t3 + 16 * Math.random()) % 16 | 0;
            return t3 = Math.floor(t3 / 16), ("x" === e3 ? r2 : 7 & r2 | 8).toString(16);
          });
        }
        var p = { strictMode: false, key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"], q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g }, parser: { strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ } };
        function h(t3, e3) {
          var r2, n2;
          try {
            r2 = o.stringify(t3);
          } catch (o2) {
            if (e3 && a(e3)) try {
              r2 = e3(t3);
            } catch (t4) {
              n2 = t4;
            }
            else n2 = o2;
          }
          return { error: n2, value: r2 };
        }
        function f(t3, e3) {
          return function(r2, n2) {
            try {
              e3(r2, n2);
            } catch (e4) {
              t3.error(e4);
            }
          };
        }
        function d(t3) {
          return function t4(e3, r2) {
            var n2, o2, a2, u2 = {};
            try {
              for (o2 in e3) (n2 = e3[o2]) && (i(n2, "object") || i(n2, "array")) ? r2.includes(n2) ? u2[o2] = "Removed circular reference: " + s(n2) : ((a2 = r2.slice()).push(n2), u2[o2] = t4(n2, a2)) : u2[o2] = n2;
            } catch (t5) {
              u2 = "Failed cloning custom data: " + t5.message;
            }
            return u2;
          }(t3, [t3]);
        }
        var m = ["log", "network", "dom", "navigation", "error", "manual"], g = ["critical", "error", "warning", "info", "debug"];
        function v(t3, e3) {
          for (var r2 = 0; r2 < t3.length; ++r2) if (t3[r2] === e3) return true;
          return false;
        }
        function y() {
          return Date.now ? +Date.now() : +/* @__PURE__ */ new Date();
        }
        t2.exports = { addParamsAndAccessTokenToPath: function(t3, e3, r2) {
          (r2 = r2 || {}).access_token = t3;
          var n2, o2 = [];
          for (n2 in r2) Object.prototype.hasOwnProperty.call(r2, n2) && o2.push([n2, r2[n2]].join("="));
          var i2 = "?" + o2.sort().join("&");
          (e3 = e3 || {}).path = e3.path || "";
          var s2, a2 = e3.path.indexOf("?"), u2 = e3.path.indexOf("#");
          -1 !== a2 && (-1 === u2 || u2 > a2) ? (s2 = e3.path, e3.path = s2.substring(0, a2) + i2 + "&" + s2.substring(a2 + 1)) : -1 !== u2 ? (s2 = e3.path, e3.path = s2.substring(0, u2) + i2 + s2.substring(u2)) : e3.path = e3.path + i2;
        }, createItem: function(t3, e3, r2, n2, o2) {
          for (var i2, a2, u2, c2, p2, h2, m2 = [], g2 = [], v2 = 0, b = t3.length; v2 < b; ++v2) {
            var w = s(h2 = t3[v2]);
            switch (g2.push(w), w) {
              case "undefined":
                break;
              case "string":
                i2 ? m2.push(h2) : i2 = h2;
                break;
              case "function":
                c2 = f(e3, h2);
                break;
              case "date":
                m2.push(h2);
                break;
              case "error":
              case "domexception":
              case "exception":
                a2 ? m2.push(h2) : a2 = h2;
                break;
              case "object":
              case "array":
                if (h2 instanceof Error || "undefined" != typeof DOMException && h2 instanceof DOMException) {
                  a2 ? m2.push(h2) : a2 = h2;
                  break;
                }
                if (n2 && "object" === w && !p2) {
                  for (var _ = 0, x = n2.length; _ < x; ++_) if (void 0 !== h2[n2[_]]) {
                    p2 = h2;
                    break;
                  }
                  if (p2) break;
                }
                u2 ? m2.push(h2) : u2 = h2;
                break;
              default:
                if (h2 instanceof Error || "undefined" != typeof DOMException && h2 instanceof DOMException) {
                  a2 ? m2.push(h2) : a2 = h2;
                  break;
                }
                m2.push(h2);
            }
          }
          u2 && (u2 = d(u2)), m2.length > 0 && (u2 || (u2 = d({})), u2.extraArgs = d(m2));
          var k = { message: i2, err: a2, custom: u2, timestamp: y(), callback: c2, notifier: r2, diagnostic: {}, uuid: l() };
          return function(t4, e4) {
            e4 && void 0 !== e4.level && (t4.level = e4.level, delete e4.level), e4 && void 0 !== e4.skipFrames && (t4.skipFrames = e4.skipFrames, delete e4.skipFrames);
          }(k, u2), n2 && p2 && (k.request = p2), o2 && (k.lambdaContext = o2), k._originalArgs = t3, k.diagnostic.original_arg_types = g2, k;
        }, addErrorContext: function(t3, e3) {
          var r2 = t3.data.custom || {}, o2 = false;
          try {
            for (var i2 = 0; i2 < e3.length; ++i2) e3[i2].hasOwnProperty("rollbarContext") && (r2 = n(r2, d(e3[i2].rollbarContext)), o2 = true);
            o2 && (t3.data.custom = r2);
          } catch (e4) {
            t3.diagnostic.error_context = "Failed: " + e4.message;
          }
        }, createTelemetryEvent: function(t3) {
          for (var e3, r2, n2, o2, i2 = 0, a2 = t3.length; i2 < a2; ++i2) switch (s(o2 = t3[i2])) {
            case "string":
              !e3 && v(m, o2) ? e3 = o2 : !n2 && v(g, o2) && (n2 = o2);
              break;
            case "object":
              r2 = o2;
          }
          return { type: e3 || "manual", metadata: r2 || {}, level: n2 };
        }, filterIp: function(t3, e3) {
          if (t3 && t3.user_ip && true !== e3) {
            var r2 = t3.user_ip;
            if (e3) try {
              var n2;
              if (-1 !== r2.indexOf(".")) (n2 = r2.split(".")).pop(), n2.push("0"), r2 = n2.join(".");
              else if (-1 !== r2.indexOf(":")) {
                if ((n2 = r2.split(":")).length > 2) {
                  var o2 = n2.slice(0, 3), i2 = o2[2].indexOf("/");
                  -1 !== i2 && (o2[2] = o2[2].substring(0, i2)), r2 = o2.concat("0000:0000:0000:0000:0000").join(":");
                }
              } else r2 = null;
            } catch (t4) {
              r2 = null;
            }
            else r2 = null;
            t3.user_ip = r2;
          }
        }, formatArgsAsString: function(t3) {
          var e3, r2, n2, o2 = [];
          for (e3 = 0, r2 = t3.length; e3 < r2; ++e3) {
            switch (s(n2 = t3[e3])) {
              case "object":
                (n2 = (n2 = h(n2)).error || n2.value).length > 500 && (n2 = n2.substr(0, 497) + "...");
                break;
              case "null":
                n2 = "null";
                break;
              case "undefined":
                n2 = "undefined";
                break;
              case "symbol":
                n2 = n2.toString();
            }
            o2.push(n2);
          }
          return o2.join(" ");
        }, formatUrl: function(t3, e3) {
          if (!(e3 = e3 || t3.protocol) && t3.port && (80 === t3.port ? e3 = "http:" : 443 === t3.port && (e3 = "https:")), e3 = e3 || "https:", !t3.hostname) return null;
          var r2 = e3 + "//" + t3.hostname;
          return t3.port && (r2 = r2 + ":" + t3.port), t3.path && (r2 += t3.path), r2;
        }, get: function(t3, e3) {
          if (t3) {
            var r2 = e3.split("."), n2 = t3;
            try {
              for (var o2 = 0, i2 = r2.length; o2 < i2; ++o2) n2 = n2[r2[o2]];
            } catch (t4) {
              n2 = void 0;
            }
            return n2;
          }
        }, handleOptions: function(t3, e3, r2, o2) {
          var i2 = n(t3, e3, r2);
          return i2 = function(t4, e4) {
            return t4.hostWhiteList && !t4.hostSafeList && (t4.hostSafeList = t4.hostWhiteList, t4.hostWhiteList = void 0, e4 && e4.log("hostWhiteList is deprecated. Use hostSafeList.")), t4.hostBlackList && !t4.hostBlockList && (t4.hostBlockList = t4.hostBlackList, t4.hostBlackList = void 0, e4 && e4.log("hostBlackList is deprecated. Use hostBlockList.")), t4;
          }(i2, o2), !e3 || e3.overwriteScrubFields || e3.scrubFields && (i2.scrubFields = (t3.scrubFields || []).concat(e3.scrubFields)), i2;
        }, isError: function(t3) {
          return i(t3, "error") || i(t3, "exception");
        }, isFiniteNumber: function(t3) {
          return Number.isFinite(t3);
        }, isFunction: a, isIterable: function(t3) {
          var e3 = s(t3);
          return "object" === e3 || "array" === e3;
        }, isNativeFunction: u, isObject: c, isString: function(t3) {
          return "string" == typeof t3 || t3 instanceof String;
        }, isType: i, isPromise: function(t3) {
          return c(t3) && i(t3.then, "function");
        }, jsonParse: function(t3) {
          var e3, r2;
          try {
            e3 = o.parse(t3);
          } catch (t4) {
            r2 = t4;
          }
          return { error: r2, value: e3 };
        }, LEVELS: { debug: 0, info: 1, warning: 2, error: 3, critical: 4 }, makeUnhandledStackInfo: function(t3, e3, r2, n2, o2, i2, s2, a2) {
          var u2 = { url: e3 || "", line: r2, column: n2 };
          u2.func = a2.guessFunctionName(u2.url, u2.line), u2.context = a2.gatherContext(u2.url, u2.line);
          var c2 = "undefined" != typeof document && document && document.location && document.location.href, l2 = "undefined" != typeof window && window && window.navigator && window.navigator.userAgent;
          return { mode: i2, message: o2 ? String(o2) : t3 || s2, url: c2, stack: [u2], useragent: l2 };
        }, merge: n, now: y, redact: function() {
          return "********";
        }, RollbarJSON: o, sanitizeUrl: function(t3) {
          var e3 = function(t4) {
            if (i(t4, "string")) {
              for (var e4 = p, r2 = e4.parser[e4.strictMode ? "strict" : "loose"].exec(t4), n2 = {}, o2 = 0, s2 = e4.key.length; o2 < s2; ++o2) n2[e4.key[o2]] = r2[o2] || "";
              return n2[e4.q.name] = {}, n2[e4.key[12]].replace(e4.q.parser, function(t5, r3, o3) {
                r3 && (n2[e4.q.name][r3] = o3);
              }), n2;
            }
          }(t3);
          return e3 ? ("" === e3.anchor && (e3.source = e3.source.replace("#", "")), t3 = e3.source.replace("?" + e3.query, "")) : "(unknown)";
        }, set: function(t3, e3, r2) {
          if (t3) {
            Object.setPrototypeOf(t3, null);
            var n2 = e3.split("."), o2 = n2.length;
            if (!(o2 < 1)) if (1 !== o2) try {
              for (var i2 = t3[n2[0]] || {}, s2 = i2, a2 = 1; a2 < o2 - 1; ++a2) i2[n2[a2]] = i2[n2[a2]] || {}, i2 = i2[n2[a2]];
              i2[n2[o2 - 1]] = r2, t3[n2[0]] = s2;
            } catch (t4) {
              return;
            }
            else t3[n2[0]] = r2;
          }
        }, setupJSON: function(t3) {
          a(o.stringify) && a(o.parse) || (i(JSON, "undefined") || (t3 ? (u(JSON.stringify) && (o.stringify = JSON.stringify), u(JSON.parse) && (o.parse = JSON.parse)) : (a(JSON.stringify) && (o.stringify = JSON.stringify), a(JSON.parse) && (o.parse = JSON.parse))), a(o.stringify) && a(o.parse) || t3 && t3(o));
        }, stringify: h, maxByteSize: function(t3) {
          for (var e3 = 0, r2 = t3.length, n2 = 0; n2 < r2; n2++) {
            var o2 = t3.charCodeAt(n2);
            o2 < 128 ? e3 += 1 : o2 < 2048 ? e3 += 2 : o2 < 65536 && (e3 += 3);
          }
          return e3;
        }, typeName: s, uuid4: l };
      }, 554: (t2, e2, r) => {
        "use strict";
        var n = r(944), o = "undefined" != typeof window && window._rollbarConfig, i = o && o.globalAlias || "Rollbar", s = "undefined" != typeof window && window[i] && "function" == typeof window[i].shimId && void 0 !== window[i].shimId();
        if ("undefined" == typeof window || window._rollbarStartTime || (window._rollbarStartTime = (/* @__PURE__ */ new Date()).getTime()), !s && o) {
          var a = new n(o);
          window[i] = a;
        } else "undefined" != typeof window ? (window.rollbar = n, window._rollbarDidLoad = true) : "undefined" != typeof self && (self.rollbar = n, self._rollbarDidLoad = true);
        t2.exports = n;
      }, 581: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        function o(t3, e3, r2) {
          if (!t3) return !r2;
          var o2, i2, s = t3.frames;
          if (!s || 0 === s.length) return !r2;
          for (var a = e3.length, u = s.length, c = 0; c < u; c++) {
            if (o2 = s[c].filename, !n.isType(o2, "string")) return !r2;
            for (var l = 0; l < a; l++) if (i2 = e3[l], new RegExp(i2).test(o2)) return true;
          }
          return false;
        }
        function i(t3, e3, r2, i2) {
          var s, a, u = false;
          "blocklist" === r2 && (u = true);
          try {
            if (s = u ? e3.hostBlockList : e3.hostSafeList, a = n.get(t3, "body.trace_chain") || [n.get(t3, "body.trace")], !s || 0 === s.length) return !u;
            if (0 === a.length || !a[0]) return !u;
            for (var c = a.length, l = 0; l < c; l++) if (o(a[l], s, u)) return true;
          } catch (t4) {
            u ? e3.hostBlockList = null : e3.hostSafeList = null;
            var p = u ? "hostBlockList" : "hostSafeList";
            return i2.error("Error while reading your configuration's " + p + " option. Removing custom " + p + ".", t4), !u;
          }
          return false;
        }
        t2.exports = { checkLevel: function(t3, e3) {
          var r2 = t3.level, o2 = n.LEVELS[r2] || 0, i2 = e3.reportLevel;
          return !(o2 < (n.LEVELS[i2] || 0));
        }, userCheckIgnore: function(t3) {
          return function(e3, r2) {
            var o2 = !!e3._isUncaught;
            delete e3._isUncaught;
            var i2 = e3._originalArgs;
            delete e3._originalArgs;
            try {
              n.isFunction(r2.onSendCallback) && r2.onSendCallback(o2, i2, e3);
            } catch (e4) {
              r2.onSendCallback = null, t3.error("Error while calling onSendCallback, removing", e4);
            }
            try {
              if (n.isFunction(r2.checkIgnore) && r2.checkIgnore(o2, i2, e3)) return false;
            } catch (e4) {
              r2.checkIgnore = null, t3.error("Error while calling custom checkIgnore(), removing", e4);
            }
            return true;
          };
        }, urlIsNotBlockListed: function(t3) {
          return function(e3, r2) {
            return !i(e3, r2, "blocklist", t3);
          };
        }, urlIsSafeListed: function(t3) {
          return function(e3, r2) {
            return i(e3, r2, "safelist", t3);
          };
        }, messageIsIgnored: function(t3) {
          return function(e3, r2) {
            var o2, i2, s, a, u, c;
            try {
              if (!(s = r2.ignoredMessages) || 0 === s.length) return true;
              if (c = function(t4) {
                var e4 = t4.body, r3 = [];
                if (e4.trace_chain) for (var o3 = e4.trace_chain, i3 = 0; i3 < o3.length; i3++) {
                  var s2 = o3[i3];
                  r3.push(n.get(s2, "exception.message"));
                }
                return e4.trace && r3.push(n.get(e4, "trace.exception.message")), e4.message && r3.push(n.get(e4, "message.body")), r3;
              }(e3), 0 === c.length) return true;
              for (a = s.length, o2 = 0; o2 < a; o2++) for (u = new RegExp(s[o2], "gi"), i2 = 0; i2 < c.length; i2++) if (u.test(c[i2])) return false;
            } catch (e4) {
              r2.ignoredMessages = null, t3.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.");
            }
            return true;
          };
        } };
      }, 584: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        t2.exports = { checkIgnore: function(t3, e3) {
          return !n.get(e3, "plugins.jquery.ignoreAjaxErrors") || !n.get(t3, "body.message.extra.isAjax");
        } };
      }, 683: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(974), i = r(364), s = r(356), a = r(61), u = r(790), c = { network: true, networkResponseHeaders: false, networkResponseBody: false, networkRequestHeaders: false, networkRequestBody: false, networkErrorOnHttp5xx: false, networkErrorOnHttp4xx: false, networkErrorOnHttp0: false, log: true, dom: true, navigation: true, connectivity: true, contentSecurityPolicy: true, errorOnContentSecurityPolicy: false };
        function l(t3, e3) {
          for (var r2; t3[e3].length; ) (r2 = t3[e3].shift())[0][r2[1]] = r2[2];
        }
        function p(t3, e3, r2, o2, i2) {
          this.options = t3;
          var s2 = t3.autoInstrument;
          false === t3.enabled || false === s2 ? this.autoInstrument = {} : (n.isType(s2, "object") || (s2 = c), this.autoInstrument = n.merge(c, s2)), this.scrubTelemetryInputs = !!t3.scrubTelemetryInputs, this.telemetryScrubber = t3.telemetryScrubber, this.defaultValueScrubber = function(t4) {
            for (var e4 = [], r3 = 0; r3 < t4.length; ++r3) e4.push(new RegExp(t4[r3], "i"));
            return function(t5) {
              var r4 = function(t6) {
                if (!t6 || !t6.attributes) return null;
                for (var e5 = t6.attributes, r5 = 0; r5 < e5.length; ++r5) if ("name" === e5[r5].key) return e5[r5].value;
                return null;
              }(t5);
              if (!r4) return false;
              for (var n2 = 0; n2 < e4.length; ++n2) if (e4[n2].test(r4)) return true;
              return false;
            };
          }(t3.scrubFields), this.telemeter = e3, this.rollbar = r2, this.diagnostic = r2.client.notifier.diagnostic, this._window = o2 || {}, this._document = i2 || {}, this.replacements = { network: [], log: [], navigation: [], connectivity: [] }, this.eventRemovers = { dom: [], connectivity: [], contentsecuritypolicy: [] }, this._location = this._window.location, this._lastHref = this._location && this._location.href;
        }
        function h(t3) {
          return "undefined" != typeof URL && t3 instanceof URL;
        }
        p.prototype.configure = function(t3) {
          this.options = n.merge(this.options, t3);
          var e3 = t3.autoInstrument, r2 = n.merge(this.autoInstrument);
          false === t3.enabled || false === e3 ? this.autoInstrument = {} : (n.isType(e3, "object") || (e3 = c), this.autoInstrument = n.merge(c, e3)), this.instrument(r2), void 0 !== t3.scrubTelemetryInputs && (this.scrubTelemetryInputs = !!t3.scrubTelemetryInputs), void 0 !== t3.telemetryScrubber && (this.telemetryScrubber = t3.telemetryScrubber);
        }, p.prototype.instrument = function(t3) {
          !this.autoInstrument.network || t3 && t3.network ? !this.autoInstrument.network && t3 && t3.network && this.deinstrumentNetwork() : this.instrumentNetwork(), !this.autoInstrument.log || t3 && t3.log ? !this.autoInstrument.log && t3 && t3.log && this.deinstrumentConsole() : this.instrumentConsole(), !this.autoInstrument.dom || t3 && t3.dom ? !this.autoInstrument.dom && t3 && t3.dom && this.deinstrumentDom() : this.instrumentDom(), !this.autoInstrument.navigation || t3 && t3.navigation ? !this.autoInstrument.navigation && t3 && t3.navigation && this.deinstrumentNavigation() : this.instrumentNavigation(), !this.autoInstrument.connectivity || t3 && t3.connectivity ? !this.autoInstrument.connectivity && t3 && t3.connectivity && this.deinstrumentConnectivity() : this.instrumentConnectivity(), !this.autoInstrument.contentSecurityPolicy || t3 && t3.contentSecurityPolicy ? !this.autoInstrument.contentSecurityPolicy && t3 && t3.contentSecurityPolicy && this.deinstrumentContentSecurityPolicy() : this.instrumentContentSecurityPolicy();
        }, p.prototype.deinstrumentNetwork = function() {
          l(this.replacements, "network");
        }, p.prototype.instrumentNetwork = function() {
          var t3 = this;
          function e3(e4, r3) {
            e4 in r3 && n.isFunction(r3[e4]) && i(r3, e4, function(e5) {
              return t3.rollbar.wrap(e5);
            });
          }
          if ("XMLHttpRequest" in this._window) {
            var r2 = this._window.XMLHttpRequest.prototype;
            i(r2, "open", function(t4) {
              return function(e4, r3) {
                var o2 = h(r3);
                return (n.isType(r3, "string") || o2) && (r3 = o2 ? r3.toString() : r3, this.__rollbar_xhr ? (this.__rollbar_xhr.method = e4, this.__rollbar_xhr.url = r3, this.__rollbar_xhr.status_code = null, this.__rollbar_xhr.start_time_ms = n.now(), this.__rollbar_xhr.end_time_ms = null) : this.__rollbar_xhr = { method: e4, url: r3, status_code: null, start_time_ms: n.now(), end_time_ms: null }), t4.apply(this, arguments);
              };
            }, this.replacements, "network"), i(r2, "setRequestHeader", function(e4) {
              return function(r3, o2) {
                return this.__rollbar_xhr || (this.__rollbar_xhr = {}), n.isType(r3, "string") && n.isType(o2, "string") && (t3.autoInstrument.networkRequestHeaders && (this.__rollbar_xhr.request_headers || (this.__rollbar_xhr.request_headers = {}), this.__rollbar_xhr.request_headers[r3] = o2), "content-type" === r3.toLowerCase() && (this.__rollbar_xhr.request_content_type = o2)), e4.apply(this, arguments);
              };
            }, this.replacements, "network"), i(r2, "send", function(r3) {
              return function(o2) {
                var s2 = this;
                function a2() {
                  if (s2.__rollbar_xhr && (null === s2.__rollbar_xhr.status_code && (s2.__rollbar_xhr.status_code = 0, t3.autoInstrument.networkRequestBody && (s2.__rollbar_xhr.request = o2), s2.__rollbar_event = t3.captureNetwork(s2.__rollbar_xhr, "xhr", void 0)), s2.readyState < 2 && (s2.__rollbar_xhr.start_time_ms = n.now()), s2.readyState > 3)) {
                    s2.__rollbar_xhr.end_time_ms = n.now();
                    var e4 = null;
                    if (s2.__rollbar_xhr.response_content_type = s2.getResponseHeader("Content-Type"), t3.autoInstrument.networkResponseHeaders) {
                      var r4 = t3.autoInstrument.networkResponseHeaders;
                      e4 = {};
                      try {
                        var i2, a3;
                        if (true === r4) {
                          var u2 = s2.getAllResponseHeaders();
                          if (u2) {
                            var c2, l2, p2 = u2.trim().split(/[\r\n]+/);
                            for (a3 = 0; a3 < p2.length; a3++) i2 = (c2 = p2[a3].split(": ")).shift(), l2 = c2.join(": "), e4[i2] = l2;
                          }
                        } else for (a3 = 0; a3 < r4.length; a3++) e4[i2 = r4[a3]] = s2.getResponseHeader(i2);
                      } catch (t4) {
                      }
                    }
                    var h2 = null;
                    if (t3.autoInstrument.networkResponseBody) try {
                      h2 = s2.responseText;
                    } catch (t4) {
                    }
                    var f = null;
                    (h2 || e4) && (f = {}, h2 && (t3.isJsonContentType(s2.__rollbar_xhr.response_content_type) ? f.body = t3.scrubJson(h2) : f.body = h2), e4 && (f.headers = e4)), f && (s2.__rollbar_xhr.response = f);
                    try {
                      var d = s2.status;
                      d = 1223 === d ? 204 : d, s2.__rollbar_xhr.status_code = d, s2.__rollbar_event.level = t3.telemeter.levelFromStatus(d), t3.errorOnHttpStatus(s2.__rollbar_xhr);
                    } catch (t4) {
                    }
                  }
                }
                return e3("onload", s2), e3("onerror", s2), e3("onprogress", s2), "onreadystatechange" in s2 && n.isFunction(s2.onreadystatechange) ? i(s2, "onreadystatechange", function(e4) {
                  return t3.rollbar.wrap(e4, void 0, a2);
                }) : s2.onreadystatechange = a2, s2.__rollbar_xhr && t3.trackHttpErrors() && (s2.__rollbar_xhr.stack = new Error().stack), r3.apply(this, arguments);
              };
            }, this.replacements, "network");
          }
          "fetch" in this._window && i(this._window, "fetch", function(e4) {
            return function(r3, i2) {
              for (var s2 = new Array(arguments.length), a2 = 0, u2 = s2.length; a2 < u2; a2++) s2[a2] = arguments[a2];
              var c2, l2 = s2[0], p2 = "GET", f = h(l2);
              n.isType(l2, "string") || f ? c2 = f ? l2.toString() : l2 : l2 && (c2 = l2.url, l2.method && (p2 = l2.method)), s2[1] && s2[1].method && (p2 = s2[1].method);
              var d = { method: p2, url: c2, status_code: null, start_time_ms: n.now(), end_time_ms: null };
              if (s2[1] && s2[1].headers) {
                var m = o(s2[1].headers);
                d.request_content_type = m.get("Content-Type"), t3.autoInstrument.networkRequestHeaders && (d.request_headers = t3.fetchHeaders(m, t3.autoInstrument.networkRequestHeaders));
              }
              return t3.autoInstrument.networkRequestBody && (s2[1] && s2[1].body ? d.request = s2[1].body : s2[0] && !n.isType(s2[0], "string") && s2[0].body && (d.request = s2[0].body)), t3.captureNetwork(d, "fetch", void 0), t3.trackHttpErrors() && (d.stack = new Error().stack), e4.apply(this, s2).then(function(e5) {
                d.end_time_ms = n.now(), d.status_code = e5.status, d.response_content_type = e5.headers.get("Content-Type");
                var r4 = null;
                t3.autoInstrument.networkResponseHeaders && (r4 = t3.fetchHeaders(e5.headers, t3.autoInstrument.networkResponseHeaders));
                var o2 = null;
                return t3.autoInstrument.networkResponseBody && "function" == typeof e5.text && (o2 = e5.clone().text()), (r4 || o2) && (d.response = {}, o2 && ("function" == typeof o2.then ? o2.then(function(e6) {
                  e6 && t3.isJsonContentType(d.response_content_type) ? d.response.body = t3.scrubJson(e6) : d.response.body = e6;
                }) : d.response.body = o2), r4 && (d.response.headers = r4)), t3.errorOnHttpStatus(d), e5;
              });
            };
          }, this.replacements, "network");
        }, p.prototype.captureNetwork = function(t3, e3, r2) {
          return t3.request && this.isJsonContentType(t3.request_content_type) && (t3.request = this.scrubJson(t3.request)), this.telemeter.captureNetwork(t3, e3, r2);
        }, p.prototype.isJsonContentType = function(t3) {
          return !!(t3 && n.isType(t3, "string") && t3.toLowerCase().includes("json"));
        }, p.prototype.scrubJson = function(t3) {
          return JSON.stringify(s(JSON.parse(t3), this.options.scrubFields));
        }, p.prototype.fetchHeaders = function(t3, e3) {
          var r2 = {};
          try {
            var n2;
            if (true === e3) {
              if ("function" == typeof t3.entries) for (var o2 = t3.entries(), i2 = o2.next(); !i2.done; ) r2[i2.value[0]] = i2.value[1], i2 = o2.next();
            } else for (n2 = 0; n2 < e3.length; n2++) {
              var s2 = e3[n2];
              r2[s2] = t3.get(s2);
            }
          } catch (t4) {
          }
          return r2;
        }, p.prototype.trackHttpErrors = function() {
          return this.autoInstrument.networkErrorOnHttp5xx || this.autoInstrument.networkErrorOnHttp4xx || this.autoInstrument.networkErrorOnHttp0;
        }, p.prototype.errorOnHttpStatus = function(t3) {
          var e3 = t3.status_code;
          if (e3 >= 500 && this.autoInstrument.networkErrorOnHttp5xx || e3 >= 400 && this.autoInstrument.networkErrorOnHttp4xx || 0 === e3 && this.autoInstrument.networkErrorOnHttp0) {
            var r2 = new Error("HTTP request failed with Status " + e3);
            r2.stack = t3.stack, this.rollbar.error(r2, { skipFrames: 1 });
          }
        }, p.prototype.deinstrumentConsole = function() {
          if ("console" in this._window && this._window.console.log) for (var t3; this.replacements.log.length; ) t3 = this.replacements.log.shift(), this._window.console[t3[0]] = t3[1];
        }, p.prototype.instrumentConsole = function() {
          if ("console" in this._window && this._window.console.log) {
            var t3 = this, e3 = this._window.console, r2 = ["debug", "info", "warn", "error", "log"];
            try {
              for (var o2 = 0, i2 = r2.length; o2 < i2; o2++) s2(r2[o2]);
            } catch (t4) {
              this.diagnostic.instrumentConsole = { error: t4.message };
            }
          }
          function s2(r3) {
            var o3 = e3[r3], i3 = e3, s3 = "warn" === r3 ? "warning" : r3;
            e3[r3] = function() {
              var e4 = Array.prototype.slice.call(arguments), r4 = n.formatArgsAsString(e4);
              t3.telemeter.captureLog(r4, s3), o3 && Function.prototype.apply.call(o3, i3, e4);
            }, t3.replacements.log.push([r3, o3]);
          }
        }, p.prototype.deinstrumentDom = function() {
          ("addEventListener" in this._window || "attachEvent" in this._window) && this.removeListeners("dom");
        }, p.prototype.instrumentDom = function() {
          if ("addEventListener" in this._window || "attachEvent" in this._window) {
            var t3 = this.handleClick.bind(this), e3 = this.handleBlur.bind(this);
            this.addListener("dom", this._window, "click", "onclick", t3, true), this.addListener("dom", this._window, "blur", "onfocusout", e3, true);
          }
        }, p.prototype.handleClick = function(t3) {
          try {
            var e3 = u.getElementFromEvent(t3, this._document), r2 = e3 && e3.tagName, n2 = u.isDescribedElement(e3, "a") || u.isDescribedElement(e3, "button");
            r2 && (n2 || u.isDescribedElement(e3, "input", ["button", "submit"])) ? this.captureDomEvent("click", e3) : u.isDescribedElement(e3, "input", ["checkbox", "radio"]) && this.captureDomEvent("input", e3, e3.value, e3.checked);
          } catch (t4) {
          }
        }, p.prototype.handleBlur = function(t3) {
          try {
            var e3 = u.getElementFromEvent(t3, this._document);
            e3 && e3.tagName && (u.isDescribedElement(e3, "textarea") ? this.captureDomEvent("input", e3, e3.value) : u.isDescribedElement(e3, "select") && e3.options && e3.options.length ? this.handleSelectInputChanged(e3) : u.isDescribedElement(e3, "input") && !u.isDescribedElement(e3, "input", ["button", "submit", "hidden", "checkbox", "radio"]) && this.captureDomEvent("input", e3, e3.value));
          } catch (t4) {
          }
        }, p.prototype.handleSelectInputChanged = function(t3) {
          if (t3.multiple) for (var e3 = 0; e3 < t3.options.length; e3++) t3.options[e3].selected && this.captureDomEvent("input", t3, t3.options[e3].value);
          else t3.selectedIndex >= 0 && t3.options[t3.selectedIndex] && this.captureDomEvent("input", t3, t3.options[t3.selectedIndex].value);
        }, p.prototype.captureDomEvent = function(t3, e3, r2, n2) {
          if (void 0 !== r2) if (this.scrubTelemetryInputs || "password" === u.getElementType(e3)) r2 = "[scrubbed]";
          else {
            var o2 = u.describeElement(e3);
            this.telemetryScrubber ? this.telemetryScrubber(o2) && (r2 = "[scrubbed]") : this.defaultValueScrubber(o2) && (r2 = "[scrubbed]");
          }
          var i2 = u.elementArrayToString(u.treeToArray(e3));
          this.telemeter.captureDom(t3, i2, r2, n2);
        }, p.prototype.deinstrumentNavigation = function() {
          var t3 = this._window.chrome;
          !(t3 && t3.app && t3.app.runtime) && this._window.history && this._window.history.pushState && l(this.replacements, "navigation");
        }, p.prototype.instrumentNavigation = function() {
          var t3 = this._window.chrome;
          if (!(t3 && t3.app && t3.app.runtime) && this._window.history && this._window.history.pushState) {
            var e3 = this;
            i(this._window, "onpopstate", function(t4) {
              return function() {
                var r2 = e3._location.href;
                e3.handleUrlChange(e3._lastHref, r2), t4 && t4.apply(this, arguments);
              };
            }, this.replacements, "navigation"), i(this._window.history, "pushState", function(t4) {
              return function() {
                var r2 = arguments.length > 2 ? arguments[2] : void 0;
                return r2 && e3.handleUrlChange(e3._lastHref, r2 + ""), t4.apply(this, arguments);
              };
            }, this.replacements, "navigation");
          }
        }, p.prototype.handleUrlChange = function(t3, e3) {
          var r2 = a.parse(this._location.href), n2 = a.parse(e3), o2 = a.parse(t3);
          this._lastHref = e3, r2.protocol === n2.protocol && r2.host === n2.host && (e3 = n2.path + (n2.hash || "")), r2.protocol === o2.protocol && r2.host === o2.host && (t3 = o2.path + (o2.hash || "")), this.telemeter.captureNavigation(t3, e3);
        }, p.prototype.deinstrumentConnectivity = function() {
          ("addEventListener" in this._window || "body" in this._document) && (this._window.addEventListener ? this.removeListeners("connectivity") : l(this.replacements, "connectivity"));
        }, p.prototype.instrumentConnectivity = function() {
          if ("addEventListener" in this._window || "body" in this._document) if (this._window.addEventListener) this.addListener("connectivity", this._window, "online", void 0, function() {
            this.telemeter.captureConnectivityChange("online");
          }.bind(this), true), this.addListener("connectivity", this._window, "offline", void 0, function() {
            this.telemeter.captureConnectivityChange("offline");
          }.bind(this), true);
          else {
            var t3 = this;
            i(this._document.body, "ononline", function(e3) {
              return function() {
                t3.telemeter.captureConnectivityChange("online"), e3 && e3.apply(this, arguments);
              };
            }, this.replacements, "connectivity"), i(this._document.body, "onoffline", function(e3) {
              return function() {
                t3.telemeter.captureConnectivityChange("offline"), e3 && e3.apply(this, arguments);
              };
            }, this.replacements, "connectivity");
          }
        }, p.prototype.handleCspEvent = function(t3) {
          var e3 = "Security Policy Violation: blockedURI: " + t3.blockedURI + ", violatedDirective: " + t3.violatedDirective + ", effectiveDirective: " + t3.effectiveDirective + ", ";
          t3.sourceFile && (e3 += "location: " + t3.sourceFile + ", line: " + t3.lineNumber + ", col: " + t3.columnNumber + ", "), e3 += "originalPolicy: " + t3.originalPolicy, this.telemeter.captureLog(e3, "error"), this.handleCspError(e3);
        }, p.prototype.handleCspError = function(t3) {
          this.autoInstrument.errorOnContentSecurityPolicy && this.rollbar.error(t3);
        }, p.prototype.deinstrumentContentSecurityPolicy = function() {
          "addEventListener" in this._document && this.removeListeners("contentsecuritypolicy");
        }, p.prototype.instrumentContentSecurityPolicy = function() {
          if ("addEventListener" in this._document) {
            var t3 = this.handleCspEvent.bind(this);
            this.addListener("contentsecuritypolicy", this._document, "securitypolicyviolation", null, t3, false);
          }
        }, p.prototype.addListener = function(t3, e3, r2, n2, o2, i2) {
          e3.addEventListener ? (e3.addEventListener(r2, o2, i2), this.eventRemovers[t3].push(function() {
            e3.removeEventListener(r2, o2, i2);
          })) : n2 && (e3.attachEvent(n2, o2), this.eventRemovers[t3].push(function() {
            e3.detachEvent(n2, o2);
          }));
        }, p.prototype.removeListeners = function(t3) {
          for (; this.eventRemovers[t3].length; ) this.eventRemovers[t3].shift()();
        }, t2.exports = p;
      }, 738: function() {
        !function(t2) {
          "use strict";
          t2.console || (t2.console = {});
          for (var e2, r, n = t2.console, o = function() {
          }, i = ["memory"], s = "assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(","); e2 = i.pop(); ) n[e2] || (n[e2] = {});
          for (; r = s.pop(); ) n[r] || (n[r] = o);
        }("undefined" == typeof window ? this : window);
      }, 744: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        function o(t3, e3, r2, n2) {
          this.rateLimiter = t3, this.api = e3, this.logger = r2, this.options = n2, this.predicates = [], this.pendingItems = [], this.pendingRequests = [], this.retryQueue = [], this.retryHandle = null, this.waitCallback = null, this.waitIntervalID = null;
        }
        o.prototype.configure = function(t3) {
          this.api && this.api.configure(t3);
          var e3 = this.options;
          return this.options = n.merge(e3, t3), this;
        }, o.prototype.addPredicate = function(t3) {
          return n.isFunction(t3) && this.predicates.push(t3), this;
        }, o.prototype.addPendingItem = function(t3) {
          this.pendingItems.push(t3);
        }, o.prototype.removePendingItem = function(t3) {
          var e3 = this.pendingItems.indexOf(t3);
          -1 !== e3 && this.pendingItems.splice(e3, 1);
        }, o.prototype.addItem = function(t3, e3, r2, o2) {
          e3 && n.isFunction(e3) || (e3 = function() {
          });
          var i2 = this._applyPredicates(t3);
          if (i2.stop) return this.removePendingItem(o2), void e3(i2.err);
          if (this._maybeLog(t3, r2), this.removePendingItem(o2), this.options.transmit) {
            this.pendingRequests.push(t3);
            try {
              this._makeApiRequest(t3, function(r3, n2) {
                this._dequeuePendingRequest(t3), e3(r3, n2);
              }.bind(this));
            } catch (r3) {
              this._dequeuePendingRequest(t3), e3(r3);
            }
          } else e3(new Error("Transmit disabled"));
        }, o.prototype.wait = function(t3) {
          n.isFunction(t3) && (this.waitCallback = t3, this._maybeCallWait() || (this.waitIntervalID && (this.waitIntervalID = clearInterval(this.waitIntervalID)), this.waitIntervalID = setInterval(function() {
            this._maybeCallWait();
          }.bind(this), 500)));
        }, o.prototype._applyPredicates = function(t3) {
          for (var e3 = null, r2 = 0, n2 = this.predicates.length; r2 < n2; r2++) if (!(e3 = this.predicates[r2](t3, this.options)) || void 0 !== e3.err) return { stop: true, err: e3.err };
          return { stop: false, err: null };
        }, o.prototype._makeApiRequest = function(t3, e3) {
          var r2 = this.rateLimiter.shouldSend(t3);
          r2.shouldSend ? this.api.postItem(t3, function(r3, n2) {
            r3 ? this._maybeRetry(r3, t3, e3) : e3(r3, n2);
          }.bind(this)) : r2.error ? e3(r2.error) : this.api.postItem(r2.payload, e3);
        };
        var i = ["ECONNRESET", "ENOTFOUND", "ESOCKETTIMEDOUT", "ETIMEDOUT", "ECONNREFUSED", "EHOSTUNREACH", "EPIPE", "EAI_AGAIN"];
        o.prototype._maybeRetry = function(t3, e3, r2) {
          var o2 = false;
          if (this.options.retryInterval) {
            for (var s = 0, a = i.length; s < a; s++) if (t3.code === i[s]) {
              o2 = true;
              break;
            }
            o2 && n.isFiniteNumber(this.options.maxRetries) && (e3.retries = e3.retries ? e3.retries + 1 : 1, e3.retries > this.options.maxRetries && (o2 = false));
          }
          o2 ? this._retryApiRequest(e3, r2) : r2(t3);
        }, o.prototype._retryApiRequest = function(t3, e3) {
          this.retryQueue.push({ item: t3, callback: e3 }), this.retryHandle || (this.retryHandle = setInterval(function() {
            for (; this.retryQueue.length; ) {
              var t4 = this.retryQueue.shift();
              this._makeApiRequest(t4.item, t4.callback);
            }
          }.bind(this), this.options.retryInterval));
        }, o.prototype._dequeuePendingRequest = function(t3) {
          var e3 = this.pendingRequests.indexOf(t3);
          -1 !== e3 && (this.pendingRequests.splice(e3, 1), this._maybeCallWait());
        }, o.prototype._maybeLog = function(t3, e3) {
          if (this.logger && this.options.verbose) {
            var r2 = e3;
            if (r2 = (r2 = r2 || n.get(t3, "body.trace.exception.message")) || n.get(t3, "body.trace_chain.0.exception.message")) return void this.logger.error(r2);
            (r2 = n.get(t3, "body.message.body")) && this.logger.log(r2);
          }
        }, o.prototype._maybeCallWait = function() {
          return !(!n.isFunction(this.waitCallback) || 0 !== this.pendingItems.length || 0 !== this.pendingRequests.length || (this.waitIntervalID && (this.waitIntervalID = clearInterval(this.waitIntervalID)), this.waitCallback(), 0));
        }, t2.exports = o;
      }, 777: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        function o(t3, e3) {
          this.queue = t3, this.options = e3, this.transforms = [], this.diagnostic = {};
        }
        o.prototype.configure = function(t3) {
          this.queue && this.queue.configure(t3);
          var e3 = this.options;
          return this.options = n.merge(e3, t3), this;
        }, o.prototype.addTransform = function(t3) {
          return n.isFunction(t3) && this.transforms.push(t3), this;
        }, o.prototype.log = function(t3, e3) {
          if (e3 && n.isFunction(e3) || (e3 = function() {
          }), !this.options.enabled) return e3(new Error("Rollbar is not enabled"));
          this.queue.addPendingItem(t3);
          var r2 = t3.err;
          this._applyTransforms(t3, function(n2, o2) {
            if (n2) return this.queue.removePendingItem(t3), e3(n2, null);
            this.queue.addItem(o2, e3, r2, t3);
          }.bind(this));
        }, o.prototype._applyTransforms = function(t3, e3) {
          var r2 = -1, n2 = this.transforms.length, o2 = this.transforms, i = this.options, s = function(t4, a) {
            t4 ? e3(t4, null) : ++r2 !== n2 ? o2[r2](a, i, s) : e3(null, a);
          };
          s(null, t3);
        }, t2.exports = o;
      }, 790: (t2) => {
        "use strict";
        function e2(t3) {
          return (t3.getAttribute("type") || "").toLowerCase();
        }
        function r(t3) {
          if (!t3 || !t3.tagName) return "";
          var e3 = [t3.tagName];
          t3.id && e3.push("#" + t3.id), t3.classes && e3.push("." + t3.classes.join("."));
          for (var r2 = 0; r2 < t3.attributes.length; r2++) e3.push("[" + t3.attributes[r2].key + '="' + t3.attributes[r2].value + '"]');
          return e3.join("");
        }
        function n(t3) {
          if (!t3 || !t3.tagName) return null;
          var e3, r2, n2, o, i = {};
          i.tagName = t3.tagName.toLowerCase(), t3.id && (i.id = t3.id), (e3 = t3.className) && "string" == typeof e3 && (i.classes = e3.split(/\s+/));
          var s = ["type", "name", "title", "alt"];
          for (i.attributes = [], o = 0; o < s.length; o++) r2 = s[o], (n2 = t3.getAttribute(r2)) && i.attributes.push({ key: r2, value: n2 });
          return i;
        }
        t2.exports = { describeElement: n, descriptionToString: r, elementArrayToString: function(t3) {
          for (var e3, n2, o = [], i = 0, s = t3.length - 1; s >= 0; s--) {
            if (e3 = r(t3[s]), n2 = i + 3 * o.length + e3.length, s < t3.length - 1 && n2 >= 83) {
              o.unshift("...");
              break;
            }
            o.unshift(e3), i += e3.length;
          }
          return o.join(" > ");
        }, treeToArray: function(t3) {
          for (var e3, r2 = [], o = 0; t3 && o < 5 && "html" !== (e3 = n(t3)).tagName; o++) r2.unshift(e3), t3 = t3.parentNode;
          return r2;
        }, getElementFromEvent: function(t3, e3) {
          return t3.target ? t3.target : e3 && e3.elementFromPoint ? e3.elementFromPoint(t3.clientX, t3.clientY) : void 0;
        }, isDescribedElement: function(t3, r2, n2) {
          if (t3.tagName.toLowerCase() !== r2.toLowerCase()) return false;
          if (!n2) return true;
          t3 = e2(t3);
          for (var o = 0; o < n2.length; o++) if (n2[o] === t3) return true;
          return false;
        }, getElementType: e2 };
      }, 796: (t2) => {
        "use strict";
        t2.exports = { captureUncaughtExceptions: function(t3, e2, r) {
          if (t3) {
            var n;
            if ("function" == typeof e2._rollbarOldOnError) n = e2._rollbarOldOnError;
            else if (t3.onerror) {
              for (n = t3.onerror; n._rollbarOldOnError; ) n = n._rollbarOldOnError;
              e2._rollbarOldOnError = n;
            }
            e2.handleAnonymousErrors();
            var o = function() {
              var r2 = Array.prototype.slice.call(arguments, 0);
              !function(t4, e3, r3, n2) {
                t4._rollbarWrappedError && (n2[4] || (n2[4] = t4._rollbarWrappedError), n2[5] || (n2[5] = t4._rollbarWrappedError._rollbarContext), t4._rollbarWrappedError = null);
                var o2 = e3.handleUncaughtException.apply(e3, n2);
                r3 && r3.apply(t4, n2), "anonymous" === o2 && (e3.anonymousErrorsPending += 1);
              }(t3, e2, n, r2);
            };
            r && (o._rollbarOldOnError = n), t3.onerror = o;
          }
        }, captureUnhandledRejections: function(t3, e2, r) {
          if (t3) {
            "function" == typeof t3._rollbarURH && t3._rollbarURH.belongsToShim && t3.removeEventListener("unhandledrejection", t3._rollbarURH);
            var n = function(t4) {
              var r2, n2, o;
              try {
                r2 = t4.reason;
              } catch (t5) {
                r2 = void 0;
              }
              try {
                n2 = t4.promise;
              } catch (t5) {
                n2 = "[unhandledrejection] error getting `promise` from event";
              }
              try {
                o = t4.detail, !r2 && o && (r2 = o.reason, n2 = o.promise);
              } catch (t5) {
              }
              r2 || (r2 = "[unhandledrejection] error getting `reason` from event"), e2 && e2.handleUnhandledRejection && e2.handleUnhandledRejection(r2, n2);
            };
            n.belongsToShim = r, t3._rollbarURH = n, t3.addEventListener("unhandledrejection", n);
          }
        } };
      }, 888: (t2, e2, r) => {
        "use strict";
        var n = r(539), o = r(12);
        function i(t3, e3) {
          return [t3, n.stringify(t3, e3)];
        }
        function s(t3, e3) {
          var r2 = t3.length;
          return r2 > 2 * e3 ? t3.slice(0, e3).concat(t3.slice(r2 - e3)) : t3;
        }
        function a(t3, e3, r2) {
          r2 = void 0 === r2 ? 30 : r2;
          var o2, i2 = t3.data.body;
          if (i2.trace_chain) for (var a2 = i2.trace_chain, u2 = 0; u2 < a2.length; u2++) o2 = s(o2 = a2[u2].frames, r2), a2[u2].frames = o2;
          else i2.trace && (o2 = s(o2 = i2.trace.frames, r2), i2.trace.frames = o2);
          return [t3, n.stringify(t3, e3)];
        }
        function u(t3, e3) {
          return e3 && e3.length > t3 ? e3.slice(0, t3 - 3).concat("...") : e3;
        }
        function c(t3, e3, r2) {
          return e3 = o(e3, function e4(r3, i2, s2) {
            switch (n.typeName(i2)) {
              case "string":
                return u(t3, i2);
              case "object":
              case "array":
                return o(i2, e4, s2);
              default:
                return i2;
            }
          }), [e3, n.stringify(e3, r2)];
        }
        function l(t3) {
          return t3.exception && (delete t3.exception.description, t3.exception.message = u(255, t3.exception.message)), t3.frames = s(t3.frames, 1), t3;
        }
        function p(t3, e3) {
          var r2 = t3.data.body;
          if (r2.trace_chain) for (var o2 = r2.trace_chain, i2 = 0; i2 < o2.length; i2++) o2[i2] = l(o2[i2]);
          else r2.trace && (r2.trace = l(r2.trace));
          return [t3, n.stringify(t3, e3)];
        }
        function h(t3, e3) {
          return n.maxByteSize(t3) > e3;
        }
        t2.exports = { truncate: function(t3, e3, r2) {
          r2 = void 0 === r2 ? 524288 : r2;
          for (var n2, o2, s2, u2 = [i, a, c.bind(null, 1024), c.bind(null, 512), c.bind(null, 256), p]; n2 = u2.shift(); ) if (t3 = (o2 = n2(t3, e3))[0], (s2 = o2[1]).error || !h(s2.value, r2)) return s2;
          return s2;
        }, raw: i, truncateFrames: a, truncateStrings: c, maybeTruncateValue: u };
      }, 944: (t2, e2, r) => {
        "use strict";
        var n = r(197), o = r(352), i = r(683), s = r(435), a = r(424), u = r(356), c = r(888);
        n.setComponents({ telemeter: o, instrumenter: i, polyfillJSON: s, wrapGlobals: a, scrub: u, truncation: c }), t2.exports = n;
      }, 962: (t2, e2, r) => {
        "use strict";
        var n = r(539);
        function o(t3, e3) {
          n.isFunction(t3[e3]) && (t3[e3] = t3[e3].toString());
        }
        t2.exports = { itemToPayload: function(t3, e3, r2) {
          var n2 = t3.data;
          t3._isUncaught && (n2._isUncaught = true), t3._originalArgs && (n2._originalArgs = t3._originalArgs), r2(null, n2);
        }, addPayloadOptions: function(t3, e3, r2) {
          var o2 = e3.payload || {};
          o2.body && delete o2.body, t3.data = n.merge(t3.data, o2), r2(null, t3);
        }, addTelemetryData: function(t3, e3, r2) {
          t3.telemetryEvents && n.set(t3, "data.body.telemetry", t3.telemetryEvents), r2(null, t3);
        }, addMessageWithError: function(t3, e3, r2) {
          if (t3.message) {
            var o2 = "data.body.trace_chain.0", i = n.get(t3, o2);
            if (i || (o2 = "data.body.trace", i = n.get(t3, o2)), i) {
              if (!i.exception || !i.exception.description) return n.set(t3, o2 + ".exception.description", t3.message), void r2(null, t3);
              var s = n.get(t3, o2 + ".extra") || {}, a = n.merge(s, { message: t3.message });
              n.set(t3, o2 + ".extra", a);
            }
            r2(null, t3);
          } else r2(null, t3);
        }, userTransform: function(t3) {
          return function(e3, r2, o2) {
            var i = n.merge(e3), s = null;
            try {
              n.isFunction(r2.transform) && (s = r2.transform(i.data, e3));
            } catch (n2) {
              return r2.transform = null, t3.error("Error while calling custom transform() function. Removing custom transform().", n2), void o2(null, e3);
            }
            n.isPromise(s) ? s.then(function(t4) {
              t4 && (i.data = t4), o2(null, i);
            }, function(t4) {
              o2(t4, e3);
            }) : o2(null, i);
          };
        }, addConfigToPayload: function(t3, e3, r2) {
          if (!e3.sendConfig) return r2(null, t3);
          var o2 = n.get(t3, "data.custom") || {};
          o2._rollbarConfig = e3, t3.data.custom = o2, r2(null, t3);
        }, addConfiguredOptions: function(t3, e3, r2) {
          var n2 = e3._configuredOptions;
          o(n2, "transform"), o(n2, "checkIgnore"), o(n2, "onSendCallback"), delete n2.accessToken, t3.data.notifier.configured_options = n2, r2(null, t3);
        }, addDiagnosticKeys: function(t3, e3, r2) {
          var o2 = n.merge(t3.notifier.client.notifier.diagnostic, t3.diagnostic);
          if (n.get(t3, "err._isAnonymous") && (o2.is_anonymous = true), t3._isUncaught && (o2.is_uncaught = t3._isUncaught), t3.err) try {
            o2.raw_error = { message: t3.err.message, name: t3.err.name, constructor_name: t3.err.constructor && t3.err.constructor.name, filename: t3.err.fileName, line: t3.err.lineNumber, column: t3.err.columnNumber, stack: t3.err.stack };
          } catch (t4) {
            o2.raw_error = { failed: String(t4) };
          }
          t3.data.notifier.diagnostic = n.merge(t3.data.notifier.diagnostic, o2), r2(null, t3);
        } };
      }, 974: (t2) => {
        "use strict";
        function e2(t3) {
          return "string" != typeof t3 && (t3 = String(t3)), t3.toLowerCase();
        }
        function r(t3) {
          this.map = {}, t3 instanceof r ? t3.forEach(function(t4, e3) {
            this.append(e3, t4);
          }, this) : Array.isArray(t3) ? t3.forEach(function(t4) {
            this.append(t4[0], t4[1]);
          }, this) : t3 && Object.getOwnPropertyNames(t3).forEach(function(e3) {
            this.append(e3, t3[e3]);
          }, this);
        }
        r.prototype.append = function(t3, r2) {
          t3 = e2(t3), r2 = function(t4) {
            return "string" != typeof t4 && (t4 = String(t4)), t4;
          }(r2);
          var n = this.map[t3];
          this.map[t3] = n ? n + ", " + r2 : r2;
        }, r.prototype.get = function(t3) {
          return t3 = e2(t3), this.has(t3) ? this.map[t3] : null;
        }, r.prototype.has = function(t3) {
          return this.map.hasOwnProperty(e2(t3));
        }, r.prototype.forEach = function(t3, e3) {
          for (var r2 in this.map) this.map.hasOwnProperty(r2) && t3.call(e3, this.map[r2], r2, this);
        }, r.prototype.entries = function() {
          var t3 = [];
          return this.forEach(function(e3, r2) {
            t3.push([r2, e3]);
          }), /* @__PURE__ */ function(t4) {
            return { next: function() {
              var e3 = t4.shift();
              return { done: void 0 === e3, value: e3 };
            } };
          }(t3);
        }, t2.exports = function(t3) {
          return "undefined" == typeof Headers ? new r(t3) : new Headers(t3);
        };
      } }, e = {}, function r(n) {
        var o = e[n];
        if (void 0 !== o) return o.exports;
        var i = e[n] = { exports: {} };
        return t[n].call(i.exports, i, i.exports, r), i.exports;
      }(554);
      var t, e;
    });
  }
});
export default require_rollbar_umd_min();
//# sourceMappingURL=rollbar.js.map
