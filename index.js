function _instanceof(e, r) {
    return null != r &&
      "undefined" != typeof Symbol &&
      r[Symbol.hasInstance]
      ? !!r[Symbol.hasInstance](e)
      : e instanceof r;
  }
  function _classCallCheck(e, r) {
    if (!_instanceof(e, r))
      throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var n = r[t];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n);
    }
  }
  function _createClass(e, r, t) {
    return (
      r && _defineProperties(e.prototype, r),
      t && _defineProperties(e, t),
      e
    );
  }
  function _escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
  }
  var NumbersConverter = (function () {
      "use strict";
      function e() {
        _classCallCheck(this, e);
      }
      return (
        _createClass(e, null, [
          {
            key: "getRomanToArabicNumbersMap",
            value: function () {
              return {
                M: 1e3,
                CM: 900,
                D: 500,
                CD: 400,
                C: 100,
                XC: 90,
                L: 50,
                XL: 40,
                X: 10,
                IX: 9,
                V: 5,
                IV: 4,
                I: 1,
              };
            },
          },
          {
            key: "romanToArabic",
            value: function (r) {
              r = r.toUpperCase();
              var t = e.getRomanToArabicNumbersMap(),
                n = Object.keys(t)
                  .reduce(function (e, r) {
                    return e.push({ r: r, a: t[r] }), e;
                  }, [])
                  .sort(function (e, r) {
                    return r.r.length - e.r.length;
                  })
                  .reduce(function (e, r) {
                    return (e[r.r] = r.a), e;
                  }, {}),
                i = Object.keys(n),
                a = Object.values(n),
                s = 0,
                o = 0;
              for (var u in i)
                for (s = r.indexOf(i[u]); -1 != s; )
                  (o += parseInt(a[u])),
                    (s = (r = r.replace(i[u], "-")).indexOf(i[u]));
              return o;
            },
          },
          {
            key: "arabicToRoman",
            value: function (r) {
              var t = e.getRomanToArabicNumbersMap(),
                n = "";
              for (var i in t) for (; r >= t[i]; ) (n += i), (r -= t[i]);
              return n;
            },
          },
        ]),
        e
      );
    })(),
    CalculatorExpression = (function () {
      "use strict";
      function e(r, t) {
        _classCallCheck(this, e),
          (this.rawExpression = r),
          (this.allowedOperations = t || []),
          (this.attributes = {
            isInvalid: !1,
            containsRomanNumbers: !1,
            containsArabicNumbers: !1,
            romanExpression: {
              firstNumber: void 0,
              operation: void 0,
              secondNumber: void 0,
            },
            arabicExpression: {
              firstNumber: void 0,
              operation: void 0,
              secondNumber: void 0,
            },
          }),
          this.parse();
      }
      return (
        _createClass(e, [
          {
            key: "escapeRegExp",
            value: function (e) {
              return _escapeRegExp(e);
            },
          },
          {
            key: "parse",
            value: function () {
              var e = this.rawExpression,
                r = Object.keys(
                  this.converter.getRomanToArabicNumbersMap()
                ),
                t = this.allowedOperations,
                n = r.map(this.escapeRegExp.bind(this)).join(""),
                i = t.map(this.escapeRegExp.bind(this)).join("|"),
                a = "([\\-\\d]+|[\\-".concat(n, "]+)"),
                s = new RegExp(
                  "".concat(a, "\\s?(").concat(i, ")\\s?").concat(a),
                  "ium"
                );
              if ("string" == typeof e && e.length && s.test(e)) {
                var o = t
                    .reduce(function (e, r) {
                      return e.replace(
                        new RegExp(_escapeRegExp(r), "gum"),
                        ""
                      );
                    }, e)
                    .replace(
                      /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+?/gm,
                      ""
                    ),
                  u = o.replace(
                    new RegExp("[^".concat(r.join(","), "]+?"), "gium"),
                    ""
                  );
                if (
                  !o
                    .replace(
                      /(?:[\0-\/:-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+?/gm,
                      ""
                    )
                    .replace(
                      /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+?/gm,
                      ""
                    ).length != !u.length
                ) {
                  var c = 0 < u.length;
                  (this.attributes.containsRomanNumbers = c),
                    (this.attributes.containsArabicNumbers = !c);
                  var l = e.match(s)[2],
                    p = e.split(l).reduce(function (e, r) {
                      return (r = r.trim()).length && e.push(r), e;
                    }, []),
                    b = function (e) {
                      e =
                        e ||
                        function (e) {
                          return e;
                        };
                      var r = function (r) {
                        var t = e(r) + "";
                        return "-" === r.charAt(0) && "-" !== t.charAt(0)
                          ? "-" + t
                          : t;
                      };
                      return {
                        firstNumber: r(p[0]),
                        operation: l,
                        secondNumber: r(p[1]),
                      };
                    };
                  (this.attributes.romanExpression = b(
                    c ? void 0 : this.converter.arabicToRoman
                  )),
                    (this.attributes.arabicExpression = b(
                      c ? this.converter.romanToArabic : void 0
                    ));
                } else this.attributes.isInvalid = !0;
              } else this.attributes.isInvalid = !0;
            },
          },
          {
            key: "converter",
            get: function () {
              return NumbersConverter;
            },
          },
          {
            key: "isInvalid",
            get: function () {
              return this.attributes.isInvalid;
            },
          },
          {
            key: "containsRomanNumbers",
            get: function () {
              return this.attributes.containsRomanNumbers;
            },
          },
          {
            key: "containsArabicNumbers",
            get: function () {
              return this.attributes.containsArabicNumbers;
            },
          },
          {
            key: "romanExpression",
            get: function () {
              return this.attributes.romanExpression;
            },
          },
          {
            key: "arabicExpression",
            get: function () {
              return this.attributes.arabicExpression;
            },
          },
          {
            key: "expression",
            get: function () {
              return this.containsRomanNumbers
                ? this.romanExpression
                : this.arabicExpression;
            },
          },
        ]),
        e
      );
    })(),
    Calculator = (function () {
      "use strict";
      function e() {
        _classCallCheck(this, e);
      }
      return (
        _createClass(e, [
          {
            key: "calculate",
            value: function (e) {
              var r = this.allowedOperations,
                t = new CalculatorExpression(e, r);
              if (t.isInvalid) throw new Error("Invalid expression");
              var n = t.arabicExpression,
                i = n.firstNumber,
                a = n.operation,
                s = n.secondNumber;
              if (
                ((i = parseInt(i)),
                (s = parseInt(s)),
                1 > i || 10 < i || 1 > s || 10 < s)
              )
                throw new Error(
                  "All numbers must be greater than 0 and less than 11"
                );
              var o = Math.floor(this.operations[a](i, s));
              return t.containsArabicNumbers
                ? o
                : 1 > o
                ? ""
                : this.converter.arabicToRoman(o);
            },
          },
          {
            key: "operations",
            get: function () {
              return {
                "+": function (e, r) {
                  return e + r;
                },
                "-": function (e, r) {
                  return e - r;
                },
                "*": function (e, r) {
                  return e * r;
                },
                "/": function (e, r) {
                  return e / r;
                },
              };
            },
          },
          {
            key: "converter",
            get: function () {
              return NumbersConverter;
            },
          },
          {
            key: "allowedOperations",
            get: function () {
              return Object.keys(this.operations);
            },
          },
        ]),
        e
      );
    })();

  var input = document.querySelector("#input"),
    form = document.querySelector("#form"),
    resultBlock = document.querySelector("#result"),
    calculator = new Calculator();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    try {
      resultBlock.textContent = calculator.calculate(input.value);

      resultBlock.style.color = "black";
    } catch (e) {
      resultBlock.textContent = e.message;

      resultBlock.style.color = "red";
    }
  });