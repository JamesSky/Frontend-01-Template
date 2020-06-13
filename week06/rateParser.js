const e = {
  decodeRatesData (e) {
    try {
        var t = e.substr(e.length - 4)
          , n = t.charCodeAt(0) + t.charCodeAt(1) + t.charCodeAt(2) + t.charCodeAt(3);
        n = (n = (e.length - 10) % n) > e.length - 10 - 4 ? e.length - 10 - 4 : n;
        var r = e.substr(n, 10);
        e = e.substr(0, n) + e.substr(n + 10);
        var a = this.decode64(decodeURIComponent(e));
        if (!1 === a)
            return !1;
        var i = ""
          , o = 0
          , c = 0;
        for (o = 0; o < a.length; o += 10) {
            var l = a.charAt(o)
              , s = r.charAt(c % r.length - 1 < 0 ? r.length + c % r.length - 1 : c % r.length - 1);
            i += (l = String.fromCharCode(l.charCodeAt(0) - s.charCodeAt(0))) + a.substring(o + 1, o + 10),
            c++
        }
        return i
    } catch (e) {
        return !1
    }
  },
  getUnitRate (e, t, n) {
    var r = n[e.toUpperCase()]
      , a = n[t.toUpperCase()];
    return {
        rate: a / r,
        inverse: r / a
    }
},
customizedToLocaleString (e, t, n, r, a) {
  var i = e.toString();
  0 === parseFloat(i) && (i = "0.0");
  var o = !1
    , c = [];
  -1 !== i.indexOf("e") && (o = !0,
  c = i.split("e"),
  i = c[0]);
  var l = i.length
    , s = i.indexOf(".") || i.indexOf(",");
  if (-1 !== s) {
      var u = l - s - 1;
      if (u > n && (i = i.slice(0, n - u),
      0 === n && (i = i.slice(0, -1))),
      u < t) {
          var d = new Array(t - u + 1).join("0");
          i = i.concat(d)
      }
  }
  o && c.length > 0 && (i = i + "e" + c[1]);
  return -1 !== ["de", "es", "fr", "it", "pt", "sv"].indexOf(r) ? (i = i.replace(".", ","),
  i = a ? this.groupNumber(i, ",") : i) : "ar" === r ? i = this.numberToArabic(i) : (i = i.replace(",", "."),
  i = a ? this.groupNumber(i, ".") : i),
  i
}
,
groupNumber (e, t) {
  var n = e.split(t);
  if (n[0] && n[0].length >= 4) {
      var r = "." === t ? "$1," : "$1.";
      n[0] = n[0].replace(/(\d)(?=(?:\d{3})+$)/g, r)
  }
  return n.join(t)
},
toLocaleStringSupportsLocales () {
  try {
      (0).toLocaleString("i")
  } catch (e) {
      return "RangeError" === e.name
  }
  return !1
},
toLocaleString(e, t, n, r, a) {
  return this.toLocaleStringSupportsLocales() ? e.toLocaleString(r, {
      minimumFractionDigits: t,
      maximumFractionDigits: n,
      useGrouping: a
  }) : this.customizedToLocaleString(e, t, n, r, a)
},
getFormattedRate(e, t, n, r) {
    var a, i = n - (e < 1 ? 3 : 2);
    r = r || "en";
    var o = this.toLocaleString(e, n, n, r, !1)
      , c = this.toLocaleString(e, 1, n, "en", !1);
    return o.length <= t + n - 1 && 0 !== parseFloat(c) ? a = this.toLocaleString(e, t + n - o.length, t + n - o.length, r, !1) : (a = this.getScientificNotation(e, i),
    o = 0 === parseFloat(o) ? e.toFixed(15) : o,
    "ar" === r && (a = this.numberToArabic(a),
    o = this.numberToArabic(o)),
    a = [o, a]),
    a
},
getRateDisplay (t, n) {
    return e.getFormattedRate(t, 7, 5, n)
},
  decode64(e) {
    try {
        var t, n, r, a, i, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", c = "", l = "", s = "", u = 0;
        if (/[^A-Za-z0-9+/=]/g.exec(e))
            return !1;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        do {
            r = o.indexOf(e.charAt(u++)),
            a = o.indexOf(e.charAt(u++)),
            i = o.indexOf(e.charAt(u++)),
            s = o.indexOf(e.charAt(u++)),
            t = r << 2 | a >> 4,
            n = (15 & a) << 4 | i >> 2,
            l = (3 & i) << 6 | s,
            c += String.fromCharCode(t),
            64 !== i && (c += String.fromCharCode(n)),
            64 !== s && (c += String.fromCharCode(l)),
            t = n = l = "",
            r = a = i = s = ""
        } while (u < e.length);return unescape(c)
    } catch (e) {
        return !1
    }
  }
}
console.log(
e.decodeRatesData(`nDgxMjg4LjUxOKc0wTH7OhdkUkMTUy`)
)
