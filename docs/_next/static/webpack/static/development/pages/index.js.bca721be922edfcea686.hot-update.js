webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/RouteGrid/sorting.ts":
/*!*********************************************!*\
  !*** ./src/components/RouteGrid/sorting.ts ***!
  \*********************************************/
/*! exports provided: sortFunctions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sortFunctions\", function() { return sortFunctions; });\nvar colorLines = [\"red\", \"green\", \"blue\", \"orange\", \"silver\"];\nvar keyBusRoutes = [1, 15, 22, 23, 28, 32, 39, 57, 66, 71, 73, 77, 111, 116, 117].map(String);\n\nvar kind = function kind(r) {\n  if (colorLines.includes(r.id.toLowerCase())) {\n    return 0;\n  } else if (keyBusRoutes.includes(r.id)) {\n    return 1;\n  } else if (r.id.startsWith(\"CR-\")) {\n    return 2;\n  }\n\n  return 3;\n};\n\nvar lowestServiceFraction = function lowestServiceFraction(r) {\n  return r.serviceFraction;\n};\n\nvar highestServiceFraction = function highestServiceFraction(r) {\n  return -r.serviceFraction;\n};\n\nvar lowestTotalTrips = function lowestTotalTrips(r) {\n  return r.serviceRegimes.current.weekday.cancelled ? Infinity : r.totalTrips;\n};\n\nvar highestTotalTrips = function highestTotalTrips(r) {\n  return -r.totalTrips;\n};\n\nvar lowestRidershipFraction = function lowestRidershipFraction(r) {\n  var ridershipHistory = r.ridershipHistory;\n\n  if (ridershipHistory) {\n    return ridershipHistory[0] / ridershipHistory[ridershipHistory.length - 1];\n  }\n\n  return Infinity;\n};\n\nvar highestRidershipFraction = function highestRidershipFraction(r) {\n  var ridershipHistory = r.ridershipHistory;\n\n  if (ridershipHistory) {\n    return -lowestRidershipFraction(r);\n  }\n\n  return Infinity;\n};\n\nvar lowestTotalRidership = function lowestTotalRidership(r) {\n  var ridershipHistory = r.ridershipHistory;\n\n  if (ridershipHistory) {\n    return ridershipHistory[ridershipHistory.length - 1];\n  }\n\n  return Infinity;\n};\n\nvar highestTotalRidership = function highestTotalRidership(r) {\n  var ridershipHistory = r.ridershipHistory;\n\n  if (ridershipHistory) {\n    return -lowestTotalRidership(r);\n  }\n\n  return Infinity;\n};\n\nvar sortFunctions = {\n  kind: kind,\n  lowestServiceFraction: lowestServiceFraction,\n  highestServiceFraction: highestServiceFraction,\n  lowestTotalTrips: lowestTotalTrips,\n  highestTotalTrips: highestTotalTrips,\n  lowestRidershipFraction: lowestRidershipFraction,\n  highestRidershipFraction: highestRidershipFraction,\n  lowestTotalRidership: lowestTotalRidership,\n  highestTotalRidership: highestTotalRidership\n};\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Sb3V0ZUdyaWQvc29ydGluZy50cz9lNjZlIl0sIm5hbWVzIjpbImNvbG9yTGluZXMiLCJrZXlCdXNSb3V0ZXMiLCJtYXAiLCJTdHJpbmciLCJraW5kIiwiciIsImluY2x1ZGVzIiwiaWQiLCJ0b0xvd2VyQ2FzZSIsInN0YXJ0c1dpdGgiLCJsb3dlc3RTZXJ2aWNlRnJhY3Rpb24iLCJzZXJ2aWNlRnJhY3Rpb24iLCJoaWdoZXN0U2VydmljZUZyYWN0aW9uIiwibG93ZXN0VG90YWxUcmlwcyIsInNlcnZpY2VSZWdpbWVzIiwiY3VycmVudCIsIndlZWtkYXkiLCJjYW5jZWxsZWQiLCJJbmZpbml0eSIsInRvdGFsVHJpcHMiLCJoaWdoZXN0VG90YWxUcmlwcyIsImxvd2VzdFJpZGVyc2hpcEZyYWN0aW9uIiwicmlkZXJzaGlwSGlzdG9yeSIsImxlbmd0aCIsImhpZ2hlc3RSaWRlcnNoaXBGcmFjdGlvbiIsImxvd2VzdFRvdGFsUmlkZXJzaGlwIiwiaGlnaGVzdFRvdGFsUmlkZXJzaGlwIiwic29ydEZ1bmN0aW9ucyJdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQTtBQUFBLElBQU1BLFVBQVUsR0FBRyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLE1BQWpCLEVBQXlCLFFBQXpCLEVBQW1DLFFBQW5DLENBQW5CO0FBQ0EsSUFBTUMsWUFBWSxHQUFHLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixFQUFoQixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixFQUE1QixFQUFnQyxFQUFoQyxFQUFvQyxFQUFwQyxFQUF3QyxFQUF4QyxFQUE0QyxFQUE1QyxFQUFnRCxHQUFoRCxFQUFxRCxHQUFyRCxFQUEwRCxHQUExRCxFQUErREMsR0FBL0QsQ0FBbUVDLE1BQW5FLENBQXJCOztBQUVBLElBQU1DLElBQUksR0FBRyxTQUFQQSxJQUFPLENBQUNDLENBQUQsRUFBa0I7QUFDM0IsTUFB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QjtBQU96QkcsMEJBQXdCLEVBQXhCQSx3QkFQeUI7QUFRekJDLHNCQUFvQixFQUFwQkEsb0JBUnlCO0FBU3pCQyx1QkFBcUIsRUFBckJBO0FBVHlCLENBQXRCIiwiZmlsZSI6Ii4vc3JjL2NvbXBvbmVudHMvUm91dGVHcmlkL3NvcnRpbmcudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZURhdGEgfSBmcm9tIFwidHlwZXNcIjtcblxuY29uc3QgY29sb3JMaW5lcyA9IFtcInJlZFwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiLCBcIm9yYW5nZVwiLCBcInNpbHZlclwiXTtcbmNvbnN0IGtleUJ1c1JvdXRlcyA9IFsxLCAxNSwgMjIsIDIzLCAyOCwgMzIsIDM5LCA1NywgNjYsIDcxLCA3MywgNzcsIDExMSwgMTE2LCAxMTddLm1hcChTdHJpbmcpO1xuXG5jb25zdCBraW5kID0gKHI6IFJvdXRlRGF0YSkgPT4ge1xuICAgIGlmIChjb2xvckxpbmVzLmluY2x1ZGVzKHIuaWQudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmIChrZXlCdXNSb3V0ZXMuaW5jbHVkZXMoci5pZCkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChyLmlkLnN0YXJ0c1dpdGgoXCJDUi1cIikpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIHJldHVybiAzO1xufTtcblxuY29uc3QgbG93ZXN0U2VydmljZUZyYWN0aW9uID0gKHI6IFJvdXRlRGF0YSkgPT4gci5zZXJ2aWNlRnJhY3Rpb247XG5jb25zdCBoaWdoZXN0U2VydmljZUZyYWN0aW9uID0gKHI6IFJvdXRlRGF0YSkgPT4gLXIuc2VydmljZUZyYWN0aW9uO1xuXG5jb25zdCBsb3dlc3RUb3RhbFRyaXBzID0gKHI6IFJvdXRlRGF0YSkgPT5cbiAgICByLnNlcnZpY2VSZWdpbWVzLmN1cnJlbnQud2Vla2RheS5jYW5jZWxsZWQgPyBJbmZpbml0eSA6IHIudG90YWxUcmlwcztcbmNvbnN0IGhpZ2hlc3RUb3RhbFRyaXBzID0gKHI6IFJvdXRlRGF0YSkgPT4gLXIudG90YWxUcmlwcztcblxuY29uc3QgbG93ZXN0UmlkZXJzaGlwRnJhY3Rpb24gPSAocjogUm91dGVEYXRhKSA9PiB7XG4gICAgY29uc3QgeyByaWRlcnNoaXBIaXN0b3J5IH0gPSByO1xuICAgIGlmIChyaWRlcnNoaXBIaXN0b3J5KSB7XG4gICAgICAgIHJldHVybiByaWRlcnNoaXBIaXN0b3J5WzBdIC8gcmlkZXJzaGlwSGlzdG9yeVtyaWRlcnNoaXBIaXN0b3J5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4gSW5maW5pdHk7XG59O1xuXG5jb25zdCBoaWdoZXN0UmlkZXJzaGlwRnJhY3Rpb24gPSAocjogUm91dGVEYXRhKSA9PiB7XG4gICAgY29uc3QgeyByaWRlcnNoaXBIaXN0b3J5IH0gPSByO1xuICAgIGlmIChyaWRlcnNoaXBIaXN0b3J5KSB7XG4gICAgICAgIHJldHVybiAtbG93ZXN0UmlkZXJzaGlwRnJhY3Rpb24ocik7XG4gICAgfVxuICAgIHJldHVybiBJbmZpbml0eTtcbn07XG5cbmNvbnN0IGxvd2VzdFRvdGFsUmlkZXJzaGlwID0gKHI6IFJvdXRlRGF0YSkgPT4ge1xuICAgIGNvbnN0IHsgcmlkZXJzaGlwSGlzdG9yeSB9ID0gcjtcbiAgICBpZiAocmlkZXJzaGlwSGlzdG9yeSkge1xuICAgICAgICByZXR1cm4gcmlkZXJzaGlwSGlzdG9yeVtyaWRlcnNoaXBIaXN0b3J5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4gSW5maW5pdHk7XG59O1xuXG5jb25zdCBoaWdoZXN0VG90YWxSaWRlcnNoaXAgPSAocjogUm91dGVEYXRhKSA9PiB7XG4gICAgY29uc3QgeyByaWRlcnNoaXBIaXN0b3J5IH0gPSByO1xuICAgIGlmIChyaWRlcnNoaXBIaXN0b3J5KSB7XG4gICAgICAgIHJldHVybiAtbG93ZXN0VG90YWxSaWRlcnNoaXAocik7XG4gICAgfVxuICAgIHJldHVybiBJbmZpbml0eTtcbn07XG5cbmV4cG9ydCBjb25zdCBzb3J0RnVuY3Rpb25zID0ge1xuICAgIGtpbmQsXG4gICAgbG93ZXN0U2VydmljZUZyYWN0aW9uLFxuICAgIGhpZ2hlc3RTZXJ2aWNlRnJhY3Rpb24sXG4gICAgbG93ZXN0VG90YWxUcmlwcyxcbiAgICBoaWdoZXN0VG90YWxUcmlwcyxcbiAgICBsb3dlc3RSaWRlcnNoaXBGcmFjdGlvbixcbiAgICBoaWdoZXN0UmlkZXJzaGlwRnJhY3Rpb24sXG4gICAgbG93ZXN0VG90YWxSaWRlcnNoaXAsXG4gICAgaGlnaGVzdFRvdGFsUmlkZXJzaGlwLFxufTtcblxuZXhwb3J0IHR5cGUgU29ydEZuID0gKHI6IFJvdXRlRGF0YSkgPT4gbnVtYmVyO1xuZXhwb3J0IHR5cGUgU29ydCA9IGtleW9mIHR5cGVvZiBzb3J0RnVuY3Rpb25zO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/RouteGrid/sorting.ts\n");

/***/ })

})