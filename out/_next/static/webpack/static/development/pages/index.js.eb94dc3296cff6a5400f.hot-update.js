webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/RouteGrid/RouteGrid.tsx":
/*!************************************************!*\
  !*** ./src/components/RouteGrid/RouteGrid.tsx ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! components */ \"./src/components/index.ts\");\n/* harmony import */ var _useInfiniteScroll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useInfiniteScroll */ \"./src/components/RouteGrid/useInfiniteScroll.ts\");\n/* harmony import */ var _RouteGrid_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RouteGrid.module.scss */ \"./src/components/RouteGrid/RouteGrid.module.scss\");\n/* harmony import */ var _RouteGrid_module_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_RouteGrid_module_scss__WEBPACK_IMPORTED_MODULE_3__);\nvar _this = undefined,\n    _jsxFileName = \"/Users/ian/transitmatters/mbta-covid-dash/src/components/RouteGrid/RouteGrid.tsx\",\n    _s = $RefreshSig$();\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;\n\n\n\n\nvar pagination = 12;\n\nvar defaultFilter = function defaultFilter(x) {\n  return !!x;\n};\n\nvar defaultSortKey = function defaultSortKey(r) {\n  return r.id;\n};\n\nvar getDocumentElement = function getDocumentElement() {\n  if (typeof document !== \"undefined\") {\n    return document.documentElement;\n  }\n\n  return null;\n};\n\nvar RouteGrid = function RouteGrid(props) {\n  _s();\n\n  var data = props.data,\n      _props$filter = props.filter,\n      filter = _props$filter === void 0 ? defaultFilter : _props$filter;\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(pagination),\n      limit = _useState[0],\n      setLimit = _useState[1];\n\n  var availableItems = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useMemo\"])(function () {\n    return Object.values(data).filter(filter);\n  }, [data, filter]);\n  var shownItems = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useMemo\"])(function () {\n    return availableItems.slice(0, limit);\n  }, [availableItems, limit]);\n  Object(_useInfiniteScroll__WEBPACK_IMPORTED_MODULE_2__[\"useInfiniteScroll\"])({\n    element: getDocumentElement(),\n    enabled: limit < availableItems.length,\n    scrollTolerance: 1000,\n    onRequestMoreItems: function onRequestMoreItems() {\n      return setLimit(function (l) {\n        return l + pagination;\n      });\n    }\n  });\n  return __jsx(\"div\", {\n    className: _RouteGrid_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.routeGrid,\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 41,\n      columnNumber: 9\n    }\n  }, shownItems.map(function (item) {\n    return __jsx(components__WEBPACK_IMPORTED_MODULE_1__[\"RouteCard\"], {\n      routeData: item,\n      key: item.id,\n      __self: _this,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 43,\n        columnNumber: 17\n      }\n    });\n  }));\n};\n\n_s(RouteGrid, \"rGhpGVoFkOvZtpFIweXrwLnTtoc=\", false, function () {\n  return [_useInfiniteScroll__WEBPACK_IMPORTED_MODULE_2__[\"useInfiniteScroll\"]];\n});\n\n_c = RouteGrid;\n/* harmony default export */ __webpack_exports__[\"default\"] = (RouteGrid);\n\nvar _c;\n\n$RefreshReg$(_c, \"RouteGrid\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Sb3V0ZUdyaWQvUm91dGVHcmlkLnRzeD9iZDVkIl0sIm5hbWVzIjpbInBhZ2luYXRpb24iLCJkZWZhdWx0RmlsdGVyIiwieCIsImRlZmF1bHRTb3J0S2V5IiwiciIsImlkIiwiZ2V0RG9jdW1lbnRFbGVtZW50IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJSb3V0ZUdyaWQiLCJwcm9wcyIsImRhdGEiLCJmaWx0ZXIiLCJ1c2VTdGF0ZSIsImxpbWl0Iiwic2V0TGltaXQiLCJhdmFpbGFibGVJdGVtcyIsInVzZU1lbW8iLCJPYmplY3QiLCJ2YWx1ZXMiLCJzaG93bkl0ZW1zIiwic2xpY2UiLCJ1c2VJbmZpbml0ZVNjcm9sbCIsImVsZW1lbnQiLCJlbmFibGVkIiwibGVuZ3RoIiwic2Nyb2xsVG9sZXJhbmNlIiwib25SZXF1ZXN0TW9yZUl0ZW1zIiwibCIsInN0eWxlcyIsInJvdXRlR3JpZCIsIm1hcCIsIml0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFHQTtBQUNBO0FBUUEsSUFBTUEsVUFBVSxHQUFHLEVBQW5COztBQUNBLElBQU1DLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0IsQ0FBQ0MsQ0FBRDtBQUFBLFNBQU8sQ0FBQyxDQUFDQSxDQUFUO0FBQUEsQ0FBdEI7O0FBQ0EsSUFBTUMsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFDQyxDQUFEO0FBQUEsU0FBa0JBLENBQUMsQ0FBQ0MsRUFBcEI7QUFBQSxDQUF2Qjs7QUFFQSxJQUFNQyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLEdBQU07QUFDN0IsTUFBSSxPQUFPQyxRQUFQLEtBQW9CLFdBQXhCLEVBQXFDO0FBQ2pDLFdBQU9BLFFBQVEsQ0FBQ0MsZUFBaEI7QUFDSDs7QUFDRCxTQUFPLElBQVA7QUFDSCxDQUxEOztBQU9BLElBQU1DLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNDLEtBQUQsRUFBa0I7QUFBQTs7QUFBQSxNQUN4QkMsSUFEd0IsR0FDU0QsS0FEVCxDQUN4QkMsSUFEd0I7QUFBQSxzQkFDU0QsS0FEVCxDQUNsQkUsTUFEa0I7QUFBQSxNQUNsQkEsTUFEa0IsOEJBQ1RYLGFBRFM7O0FBQUEsa0JBRU5ZLHNEQUFRLENBQUNiLFVBQUQsQ0FGRjtBQUFBLE1BRXpCYyxLQUZ5QjtBQUFBLE1BRWxCQyxRQUZrQjs7QUFJaEMsTUFBTUMsY0FBYyxHQUFHQyxxREFBTyxDQUFDO0FBQUEsV0FBTUMsTUFBTSxDQUFDQyxNQUFQLENBQWNSLElBQWQsRUFBb0JDLE1BQXBCLENBQTJCQSxNQUEzQixDQUFOO0FBQUEsR0FBRCxFQUEyQyxDQUFDRCxJQUFELEVBQU9DLE1BQVAsQ0FBM0MsQ0FBOUI7QUFDQSxNQUFNUSxVQUFVLEdBQUdILHFEQUFPLENBQUM7QUFBQSxXQUFNRCxjQUFjLENBQUNLLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0JQLEtBQXhCLENBQU47QUFBQSxHQUFELEVBQXVDLENBQUNFLGNBQUQsRUFBaUJGLEtBQWpCLENBQXZDLENBQTFCO0FBRUFRLDhFQUFpQixDQUFDO0FBQ2RDLFdBQU8sRUFBRWpCLGtCQUFrQixFQURiO0FBRWRrQixXQUFPLEVBQUVWLEtBQUssR0FBR0UsY0FBYyxDQUFDUyxNQUZsQjtBQUdkQyxtQkFBZSxFQUFFLElBSEg7QUFJZEMsc0JBQWtCLEVBQUU7QUFBQSxhQUFNWixRQUFRLENBQUMsVUFBQ2EsQ0FBRDtBQUFBLGVBQU9BLENBQUMsR0FBRzVCLFVBQVg7QUFBQSxPQUFELENBQWQ7QUFBQTtBQUpOLEdBQUQsQ0FBakI7QUFPQSxTQUNJO0FBQUssYUFBUyxFQUFFNkIsNkRBQU0sQ0FBQ0MsU0FBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUNLVixVQUFVLENBQUNXLEdBQVgsQ0FBZSxVQUFDQyxJQUFEO0FBQUEsV0FDWixNQUFDLG9EQUFEO0FBQVcsZUFBUyxFQUFFQSxJQUF0QjtBQUE0QixTQUFHLEVBQUVBLElBQUksQ0FBQzNCLEVBQXRDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFEWTtBQUFBLEdBQWYsQ0FETCxDQURKO0FBT0gsQ0FyQkQ7O0dBQU1JLFM7VUFPRmEsb0U7OztLQVBFYixTO0FBdUJTQSx3RUFBZiIsImZpbGUiOiIuL3NyYy9jb21wb25lbnRzL1JvdXRlR3JpZC9Sb3V0ZUdyaWQudHN4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IFJvdXRlQ2FyZCB9IGZyb20gXCJjb21wb25lbnRzXCI7XG5pbXBvcnQgeyBSb3V0ZURhdGEgfSBmcm9tIFwidHlwZXNcIjtcblxuaW1wb3J0IHsgdXNlSW5maW5pdGVTY3JvbGwgfSBmcm9tIFwiLi91c2VJbmZpbml0ZVNjcm9sbFwiO1xuaW1wb3J0IHN0eWxlcyBmcm9tIFwiLi9Sb3V0ZUdyaWQubW9kdWxlLnNjc3NcIjtcblxudHlwZSBQcm9wcyA9IHtcbiAgICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBSb3V0ZURhdGE+O1xuICAgIGZpbHRlcj86IChyOiBSb3V0ZURhdGEpID0+IGJvb2xlYW47XG4gICAgc29ydEtleT86IChyOiBSb3V0ZURhdGEpID0+IHN0cmluZyB8IG51bWJlcjtcbn07XG5cbmNvbnN0IHBhZ2luYXRpb24gPSAxMjtcbmNvbnN0IGRlZmF1bHRGaWx0ZXIgPSAoeCkgPT4gISF4O1xuY29uc3QgZGVmYXVsdFNvcnRLZXkgPSAocjogUm91dGVEYXRhKSA9PiByLmlkO1xuXG5jb25zdCBnZXREb2N1bWVudEVsZW1lbnQgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IFJvdXRlR3JpZCA9IChwcm9wczogUHJvcHMpID0+IHtcbiAgICBjb25zdCB7IGRhdGEsIGZpbHRlciA9IGRlZmF1bHRGaWx0ZXIgfSA9IHByb3BzO1xuICAgIGNvbnN0IFtsaW1pdCwgc2V0TGltaXRdID0gdXNlU3RhdGUocGFnaW5hdGlvbik7XG5cbiAgICBjb25zdCBhdmFpbGFibGVJdGVtcyA9IHVzZU1lbW8oKCkgPT4gT2JqZWN0LnZhbHVlcyhkYXRhKS5maWx0ZXIoZmlsdGVyKSwgW2RhdGEsIGZpbHRlcl0pO1xuICAgIGNvbnN0IHNob3duSXRlbXMgPSB1c2VNZW1vKCgpID0+IGF2YWlsYWJsZUl0ZW1zLnNsaWNlKDAsIGxpbWl0KSwgW2F2YWlsYWJsZUl0ZW1zLCBsaW1pdF0pO1xuXG4gICAgdXNlSW5maW5pdGVTY3JvbGwoe1xuICAgICAgICBlbGVtZW50OiBnZXREb2N1bWVudEVsZW1lbnQoKSxcbiAgICAgICAgZW5hYmxlZDogbGltaXQgPCBhdmFpbGFibGVJdGVtcy5sZW5ndGgsXG4gICAgICAgIHNjcm9sbFRvbGVyYW5jZTogMTAwMCxcbiAgICAgICAgb25SZXF1ZXN0TW9yZUl0ZW1zOiAoKSA9PiBzZXRMaW1pdCgobCkgPT4gbCArIHBhZ2luYXRpb24pLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5yb3V0ZUdyaWR9PlxuICAgICAgICAgICAge3Nob3duSXRlbXMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgPFJvdXRlQ2FyZCByb3V0ZURhdGE9e2l0ZW19IGtleT17aXRlbS5pZH0gLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUm91dGVHcmlkO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/RouteGrid/RouteGrid.tsx\n");

/***/ })

})