webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/RouteCard/TphChart.tsx":
/*!***********************************************!*\
  !*** ./src/components/RouteCard/TphChart.tsx ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chart.js */ \"./node_modules/chart.js/dist/Chart.js\");\n/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chart_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var chartjs_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! chartjs-color */ \"./node_modules/chartjs-color/index.js\");\n/* harmony import */ var chartjs_color__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(chartjs_color__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var time__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! time */ \"./src/time.ts\");\n/* harmony import */ var _RouteCard_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RouteCard.module.scss */ \"./src/components/RouteCard/RouteCard.module.scss\");\n/* harmony import */ var _RouteCard_module_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_RouteCard_module_scss__WEBPACK_IMPORTED_MODULE_4__);\nvar _this = undefined,\n    _jsxFileName = \"/Users/ian/transitmatters/mbta-covid-dash/src/components/RouteCard/TphChart.tsx\",\n    _s = $RefreshSig$();\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;\n\n\n\n\n\nvar lineTickValues = Object(time__WEBPACK_IMPORTED_MODULE_3__[\"getHourlyTickValues\"])(1);\n\nvar TphChart = function TphChart(props) {\n  _s();\n\n  var color = props.color,\n      baselineTph = props.baselineTph,\n      currentTph = props.currentTph,\n      highestTph = props.highestTph;\n  var canvasRef = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useRef\"])(null);\n  Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"])(function () {\n    var ctx = canvasRef.current.getContext(\"2d\");\n    var currentColor = chartjs_color__WEBPACK_IMPORTED_MODULE_2___default()(color).alpha(0.4).rgbString();\n    var chart = new chart_js__WEBPACK_IMPORTED_MODULE_1___default.a(ctx, {\n      type: \"line\",\n      data: {\n        labels: lineTickValues,\n        datasets: [{\n          label: \"Pre-COVID trips per hour\",\n          data: baselineTph,\n          steppedLine: true,\n          borderColor: color,\n          borderWidth: 2,\n          backgroundColor: \"rgba(0,0,0,0)\"\n        }, {\n          label: \"Current trips per hour\",\n          data: currentTph,\n          steppedLine: true,\n          borderWidth: 2,\n          borderColor: \"rgba(0,0,0,0)\",\n          backgroundColor: currentColor\n        }]\n      },\n      options: {\n        maintainAspectRatio: false,\n        animation: {\n          duration: 0\n        },\n        legend: {\n          position: \"top\",\n          align: \"end\",\n          labels: {\n            boxWidth: 15\n          }\n        },\n        scales: {\n          xAxes: [{\n            gridLines: {\n              display: false\n            },\n            ticks: {\n              maxTicksLimit: 12,\n              maxRotation: 0\n            }\n          }],\n          yAxes: [{\n            gridLines: {\n              display: false\n            },\n            ticks: {\n              maxTicksLimit: 4,\n              suggestedMax: highestTph\n            }\n          }]\n        },\n        tooltips: {\n          mode: \"index\",\n          intersect: false,\n          callbacks: {\n            afterLabel: function afterLabel() {\n              return \"(each direction)\";\n            }\n          }\n        },\n        elements: {\n          line: {\n            tension: 0\n          },\n          point: {\n            radius: 0\n          }\n        }\n      }\n    });\n    return function () {\n      return chart.destroy();\n    };\n  }, [baselineTph, currentTph]);\n  return __jsx(\"div\", {\n    className: _RouteCard_module_scss__WEBPACK_IMPORTED_MODULE_4___default.a.tphChartContainer,\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 94,\n      columnNumber: 9\n    }\n  }, __jsx(\"canvas\", {\n    ref: canvasRef,\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 95,\n      columnNumber: 13\n    }\n  }));\n};\n\n_s(TphChart, \"UJgi7ynoup7eqypjnwyX/s32POg=\");\n\n_c = TphChart;\n/* harmony default export */ __webpack_exports__[\"default\"] = (TphChart);\n\nvar _c;\n\n$RefreshReg$(_c, \"TphChart\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Sb3V0ZUNhcmQvVHBoQ2hhcnQudHN4P2Q3ZDUiXSwibmFtZXMiOlsibGluZVRpY2tWYWx1ZXMiLCJnZXRIb3VybHlUaWNrVmFsdWVzIiwiVHBoQ2hhcnQiLCJwcm9wcyIsImNvbG9yIiwiYmFzZWxpbmVUcGgiLCJjdXJyZW50VHBoIiwiaGlnaGVzdFRwaCIsImNhbnZhc1JlZiIsInVzZVJlZiIsInVzZUVmZmVjdCIsImN0eCIsImN1cnJlbnQiLCJnZXRDb250ZXh0IiwiY3VycmVudENvbG9yIiwiQ29sb3IiLCJhbHBoYSIsInJnYlN0cmluZyIsImNoYXJ0IiwiQ2hhcnQiLCJ0eXBlIiwiZGF0YSIsImxhYmVscyIsImRhdGFzZXRzIiwibGFiZWwiLCJzdGVwcGVkTGluZSIsImJvcmRlckNvbG9yIiwiYm9yZGVyV2lkdGgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvcHRpb25zIiwibWFpbnRhaW5Bc3BlY3RSYXRpbyIsImFuaW1hdGlvbiIsImR1cmF0aW9uIiwibGVnZW5kIiwicG9zaXRpb24iLCJhbGlnbiIsImJveFdpZHRoIiwic2NhbGVzIiwieEF4ZXMiLCJncmlkTGluZXMiLCJkaXNwbGF5IiwidGlja3MiLCJtYXhUaWNrc0xpbWl0IiwibWF4Um90YXRpb24iLCJ5QXhlcyIsInN1Z2dlc3RlZE1heCIsInRvb2x0aXBzIiwibW9kZSIsImludGVyc2VjdCIsImNhbGxiYWNrcyIsImFmdGVyTGFiZWwiLCJlbGVtZW50cyIsImxpbmUiLCJ0ZW5zaW9uIiwicG9pbnQiLCJyYWRpdXMiLCJkZXN0cm95Iiwic3R5bGVzIiwidHBoQ2hhcnRDb250YWluZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFFQSxJQUFNQSxjQUFjLEdBQUdDLGdFQUFtQixDQUFDLENBQUQsQ0FBMUM7O0FBU0EsSUFBTUMsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQ0MsS0FBRCxFQUFr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RyxFQUFFbEQsU0FBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBREosQ0FESjtBQUtILENBL0VEOztHQUFNTixROztLQUFBQSxRO0FBaUZTQSx1RUFBZiIsImZpbGUiOiIuL3NyYy9jb21wb25lbnRzL1JvdXRlQ2FyZC9UcGhDaGFydC50c3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBDaGFydCBmcm9tIFwiY2hhcnQuanNcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiY2hhcnRqcy1jb2xvclwiO1xuXG5pbXBvcnQgeyBUcmlwc1BlckhvdXIgfSBmcm9tIFwidHlwZXNcIjtcbmltcG9ydCB7IGdldEhvdXJseVRpY2tWYWx1ZXMgfSBmcm9tIFwidGltZVwiO1xuXG5pbXBvcnQgc3R5bGVzIGZyb20gXCIuL1JvdXRlQ2FyZC5tb2R1bGUuc2Nzc1wiO1xuXG5jb25zdCBsaW5lVGlja1ZhbHVlcyA9IGdldEhvdXJseVRpY2tWYWx1ZXMoMSk7XG5cbnR5cGUgUHJvcHMgPSB7XG4gICAgYmFzZWxpbmVUcGg6IFRyaXBzUGVySG91cjtcbiAgICBjdXJyZW50VHBoOiBUcmlwc1BlckhvdXI7XG4gICAgaGlnaGVzdFRwaDogbnVtYmVyO1xuICAgIGNvbG9yOiBzdHJpbmc7XG59O1xuXG5jb25zdCBUcGhDaGFydCA9IChwcm9wczogUHJvcHMpID0+IHtcbiAgICBjb25zdCB7IGNvbG9yLCBiYXNlbGluZVRwaCwgY3VycmVudFRwaCwgaGlnaGVzdFRwaCB9ID0gcHJvcHM7XG4gICAgY29uc3QgY2FudmFzUmVmID0gdXNlUmVmPEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbD4obnVsbCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBjdHggPSBjYW52YXNSZWYuY3VycmVudCEuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBjb25zdCBjdXJyZW50Q29sb3IgPSBDb2xvcihjb2xvcikuYWxwaGEoMC40KS5yZ2JTdHJpbmcoKTtcbiAgICAgICAgY29uc3QgY2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XG4gICAgICAgICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBsYWJlbHM6IGxpbmVUaWNrVmFsdWVzLFxuICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlByZS1DT1ZJRCB0cmlwcyBwZXIgaG91clwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogYmFzZWxpbmVUcGggYXMgYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcHBlZExpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkN1cnJlbnQgdHJpcHMgcGVyIGhvdXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGN1cnJlbnRUcGggYXMgYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcHBlZExpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBcInJnYmEoMCwwLDAsMClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY3VycmVudENvbG9yLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogeyBkdXJhdGlvbjogMCB9LFxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJ0b3BcIixcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwiZW5kXCIsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczogeyBib3hXaWR0aDogMTUgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjYWxlczoge1xuICAgICAgICAgICAgICAgICAgICB4QXhlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRMaW5lczogeyBkaXNwbGF5OiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFRpY2tzTGltaXQ6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhSb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgeUF4ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkTGluZXM6IHsgZGlzcGxheTogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhUaWNrc0xpbWl0OiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0ZWRNYXg6IGhpZ2hlc3RUcGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b29sdGlwczoge1xuICAgICAgICAgICAgICAgICAgICBtb2RlOiBcImluZGV4XCIsXG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMYWJlbDogKCkgPT4gXCIoZWFjaCBkaXJlY3Rpb24pXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbGVtZW50czoge1xuICAgICAgICAgICAgICAgICAgICBsaW5lOiB7IHRlbnNpb246IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IHsgcmFkaXVzOiAwIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKCkgPT4gY2hhcnQuZGVzdHJveSgpO1xuICAgIH0sIFtiYXNlbGluZVRwaCwgY3VycmVudFRwaF0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy50cGhDaGFydENvbnRhaW5lcn0+XG4gICAgICAgICAgICA8Y2FudmFzIHJlZj17Y2FudmFzUmVmfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVHBoQ2hhcnQ7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/components/RouteCard/TphChart.tsx\n");

/***/ })

})