(function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.VMoney = t() : e.VMoney = t()
})(this, function() {
    return function(e) {
        function t(i) {
            if (n[i]) return n[i].exports;
            var r = n[i] = {
                i: i,
                l: !1,
                exports: {}
            };
            return e[i].call(r.exports, r, r.exports, t), r.l = !0, r.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.i = function(e) {
            return e
        }, t.d = function(e, n, i) {
            t.o(e, n) || Object.defineProperty(e, n, {
                configurable: !1,
                enumerable: !0,
                get: i
            })
        }, t.n = function(e) {
            var n = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return t.d(n, "a", n), n
        }, t.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = ".", t(t.s = 9)
    }([function(e, t, n) {
        "use strict";
        t.a = {
            prefix: "",
            suffix: "",
            thousands: ",",
            decimal: ".",
            precision: 0,
            blank: !1
        }
    }, function(e, t, n) {
        "use strict";
        var i = n(2),
        r = n(5),
        u = n(0);
        t.a = function(e, t) {
            if (t.value) {
                var o = n.i(r.a)(u.a, t.value);
                if ("INPUT" !== e.tagName.toLocaleUpperCase()) {
                    var a = e.getElementsByTagName("input");
                    1 !== a.length || (e = a[0])
                }
                e.onkeydown = function(t) {
                    var r = 8 == t.which || 46 == t.which,
                    u = e.value.length - e.selectionEnd == 0;
                    o.blank && r && u && 0 === n.i(i.a)(e.value, 0) && (e.value = "", e.dispatchEvent(n.i(i.b)("change")))
                }, e.oninput = function() {
                    var t = e.value.length - e.selectionEnd;
                    e.value = n.i(i.c)(e.value, o), t = Math.max(t, o.suffix.length), t = e.value.length - t, t = Math.max(t, o.prefix.length + 1), n.i(i.d)(e, t), e.dispatchEvent(n.i(i.b)("change"))
                }, e.onfocus = function() {
                    n.i(i.d)(e, e.value.length - o.suffix.length)
                }, e.oninput(), e.dispatchEvent(n.i(i.b)("input"))
            }
        }
    }, function(e, t, n) {
        "use strict";

        function i(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : v.a;
            if (t.blank && "" == e ) return "";
            "number" == typeof e && (e = e.toFixed(o(t.precision)));
            var n = "",
            i = u(e),
            r = c(i, t.precision),
            a = d(r).split("."),
            l = a[0],
            p = a[1];
            return l = f(l, t.thousands), t.prefix + n + s(l, p, t.decimal) + t.suffix
        }

        function r(e, t) {
            var n = e.indexOf("-") >= 0 ? -1 : 1,
            i = u(e),
            r = c(i, t);
            return parseFloat(r) * n
        }

        function u(e) {
            return d(e).replace(/\D+/g, "") || "0"
        }

        function o(e) {
            return a(0, e, 20)
        }

        function a(e, t, n) {
            return Math.max(e, Math.min(t, n))
        }

        function c(e, t) {
            var n = Math.pow(10, t);
            return (parseFloat(e) / n).toFixed(o(t))
        }

        function f(e, t) {
            return e.replace(/(\d)(?=(?:\d{3})+\b)/gm, "$1" + t)
        }

        function s(e, t, n) {
            return t ? e + n + t : e
        }

        function d(e) {
            return e ? e.toString() : ""
        }

        function l(e, t) {
            var n = function() {
                e.setSelectionRange(t, t)
            };
            e === document.activeElement && (n(), setTimeout(n, 1))
        }

        function p(e) {
            var t = document.createEvent("Event");
            return t.initEvent(e, !0, !0), t
        }
        n.d(t, "c", function() {
            return i
        }), n.d(t, "a", function() {
            return r
        }), n.d(t, "d", function() {
            return l
        }), n.d(t, "b", function() {
            return p
        });
        var v = n(0)
    }, function(e, t, n) {
        "use strict";

        function i(e, t) {
            t && Object.keys(t).map(function(e) {
                a.a[e] = t[e]
            }), e.directive("money", o.a), e.component("money", u.a)
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), n.d(t, "VERSION", function() {
            return c
        });
        var r = n(6),
        u = n.n(r),
        o = n(1),
        a = n(0);
        n.d(t, "Money", function() {
            return u.a
        }), n.d(t, "VMoney", function() {
            return o.a
        }), n.d(t, "options", function() {
            return a.a
        });
        var c = "0.8.1";
        t.default = i, "undefined" != typeof window && window.Vue && window.Vue.use(i)
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = n(1),
        r = n(0),
        u = n(2);
        t.default = {
            name: "Money",
            props: {
                value: {
                    required: !0,
                    type: [Number, String],
                    default: '0'
                },
                masked: {
                    type: Boolean,
                    default: !1
                },
                precision: {
                    type: Number,
                    default: function() {
                        return r.a.precision
                    }
                },
                decimal: {
                    type: String,
                    default: function() {
                        return r.a.decimal
                    }
                },
                thousands: {
                    type: String,
                    default: function() {
                        return r.a.thousands
                    }
                },
                prefix: {
                    type: String,
                    default: function() {
                        return r.a.prefix
                    }
                },
                suffix: {
                    type: String,
                    default: function() {
                        return r.a.suffix
                    }
                },
                blank: {
                    type: Boolean,
                    default: r.a.blank,
                },
                min : {
                	type : [Number, String],
                	default : 0,
                },
                max : {
                  type :  Number,

              }
          },
          directives: {
            money: i.a
        },
        data: function() {
            return {
                formattedValue: "",
            }
        },
        watch: {
            value: {
                immediate: !0,
                handler: function(e, t) {
                    var i = n.i( u.c )(e, this.$props);
                    i !== this.formattedValue && (this.formattedValue = i)
                }
            }
        },
        methods: {
            change: function(e) {
                if(this.masked){
                    this.$emit("input", this.masked ? e.target.value : Math.abs(n.i(u.a)(e.target.value, this.precision)));
                }else{
                    var val = Math.abs(n.i(u.a)(e.target.value, this.precision));
                    if( val < parseInt(this.min)){
                        e.target.value = parseInt(this.min);
                        return;
                    }
                    if( this.max != undefined && val > this.max){
                       e.target.value = this.max;
                           // return;
                       }
                       this.$emit("input", val);
                   }

            },
            increase : function(){
                this.value++;
            },
            decrease : function(){
                this.value--;
            },
            select : function(){
                this.$refs.v_money.select();
            }
        },

       }
   }, function(e, t, n) {
    "use strict";
    t.a = function(e, t) {
        return e = e || {}, t = t || {}, Object.keys(e).concat(Object.keys(t)).reduce(function(n, i) {
            return n[i] = void 0 === t[i] ? e[i] : t[i], n
        }, {})
    }
}, function(e, t, n) {
    var i = n(7)(n(4), n(8), null, null);
    e.exports = i.exports
}, function(e, t) {
    e.exports = function(e, t, n, i) {
        var r, u = e = e || {},
        o = typeof e.default;
        "object" !== o && "function" !== o || (r = e, u = e.default);
        var a = "function" == typeof u ? u.options : u;
        if (t && (a.render = t.render, a.staticRenderFns = t.staticRenderFns), n && (a._scopeId = n), i) {
            var c = a.computed || (a.computed = {});
            Object.keys(i).forEach(function(e) {
                var t = i[e];
                c[e] = function() {
                    return t
                }
            })
        }
        return {
            esModule: r,
            exports: u,
            options: a
        }
    }
}, function(e, t) {
    e.exports = {
        render: function() {
            var e = this,
            t = e.$createElement;
            return (e._self._c || t)("input", {
                directives: [{
                    name: "money",
                    rawName: "v-money",
                    value: {
                        precision: e.precision,
                        decimal: e.decimal,
                        thousands: e.thousands,
                        prefix: e.prefix,
                        suffix: e.suffix
                    },
                    expression: "{precision, decimal, thousands, prefix, suffix}"
                }],
                staticClass: "v-money",
                attrs: {
                    type: "text"
                },
                ref: 'v_money',
                domProps: {
                    value: e.formattedValue
                },
                on: {
                    change: e.change
                }
            })
        },
        staticRenderFns: []
    }
}, function(e, t, n) {
    e.exports = n(3)
}])
});
