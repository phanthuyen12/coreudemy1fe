"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.js&appDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.js&appDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_p_thuyen_Documents_coreproduct_v1_fontend_src_app_api_auth_nextauth_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.js */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/p.thuyen/Documents/coreproduct/v1/fontend/src/app/api/auth/[...nextauth]/route.js\",\n    nextConfigOutput,\n    userland: _Users_p_thuyen_Documents_coreproduct_v1_fontend_src_app_api_auth_nextauth_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLmpzJmFwcERpcj0lMkZVc2VycyUyRnAudGh1eWVuJTJGRG9jdW1lbnRzJTJGY29yZXByb2R1Y3QlMkZ2MSUyRmZvbnRlbmQlMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGcC50aHV5ZW4lMkZEb2N1bWVudHMlMkZjb3JlcHJvZHVjdCUyRnYxJTJGZm9udGVuZCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDd0M7QUFDckg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYXJrb25uZXh0Lz8zNWI0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9wLnRodXllbi9Eb2N1bWVudHMvY29yZXByb2R1Y3QvdjEvZm9udGVuZC9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUuanNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL3AudGh1eWVuL0RvY3VtZW50cy9jb3JlcHJvZHVjdC92MS9mb250ZW5kL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS5qc1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.js&appDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/options.js":
/*!***************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/options.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   fakeUsers: () => (/* binding */ fakeUsers),\n/* harmony export */   options: () => (/* binding */ options)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst fakeUsers = [\n    {\n        id: \"1\",\n        email: \"user@demo.com\",\n        username: \"demo_user\",\n        password: \"123456\",\n        firstName: \"Demo\",\n        lastName: \"User\",\n        role: \"Admin\",\n        token: \"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZWNoemFhIiwiYXVkIjoiaHR0cHM6Ly90ZWNoemFhLmdldGFwcHVpLmNvbS8iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVjaHphYSIsIkVtYWlsIjoidGVjaHphYXN0dWRpb0BnbWFpbC5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJUZXN0VG9rZW4ifQ.ud4LnFZ-mqhHEYiPf2wCLM7KvLGoAxhXTBSymRIZEFLleFkO119AXd8p3OfPCpdUWSyeZl8-pZyElANc_KHj5w\"\n    }\n];\nconst options = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email:\",\n                    type: \"text\",\n                    placeholder: \"Enter your username\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials, req) {\n                const filteredUser = fakeUsers.find((user)=>{\n                    return user.email === credentials?.email && user.password === credentials?.password;\n                });\n                if (filteredUser) {\n                    return filteredUser;\n                } else {\n                    throw new Error(\"Email or Password is not valid\");\n                }\n            }\n        })\n    ],\n    secret: \"kvwLrfri/MBznUCofIoRH9+NvGu6GqvVdqO3mor1GuA=\",\n    pages: {\n        signIn: \"/auth/sign-in\"\n    },\n    callbacks: {\n        async signIn ({ user, account, profile, email, credentials }) {\n            return true;\n        },\n        session: ({ session, token })=>{\n            session.user = {\n                email: \"user@demo.com\",\n                name: \"Test User\"\n            };\n            return Promise.resolve(session);\n        }\n    },\n    session: {\n        maxAge: 24 * 60 * 60 * 1000,\n        generateSessionToken: ()=>{\n            return (0,crypto__WEBPACK_IMPORTED_MODULE_1__.randomBytes)(32).toString(\"hex\");\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vb3B0aW9ucy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFrRTtBQUM3QjtBQUM5QixNQUFNRSxZQUFZO0lBQUM7UUFDeEJDLElBQUk7UUFDSkMsT0FBTztRQUNQQyxVQUFVO1FBQ1ZDLFVBQVU7UUFDVkMsV0FBVztRQUNYQyxVQUFVO1FBQ1ZDLE1BQU07UUFDTkMsT0FBTztJQUNUO0NBQUUsQ0FBQztBQUNJLE1BQU1DLFVBQVU7SUFDckJDLFdBQVc7UUFBQ1osMkVBQW1CQSxDQUFDO1lBQzlCYSxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hWLE9BQU87b0JBQ0xXLE9BQU87b0JBQ1BDLE1BQU07b0JBQ05DLGFBQWE7Z0JBQ2Y7Z0JBQ0FYLFVBQVU7b0JBQ1JTLE9BQU87b0JBQ1BDLE1BQU07Z0JBQ1I7WUFDRjtZQUNBLE1BQU1FLFdBQVVKLFdBQVcsRUFBRUssR0FBRztnQkFDOUIsTUFBTUMsZUFBZWxCLFVBQVVtQixJQUFJLENBQUNDLENBQUFBO29CQUNsQyxPQUFPQSxLQUFLbEIsS0FBSyxLQUFLVSxhQUFhVixTQUFTa0IsS0FBS2hCLFFBQVEsS0FBS1EsYUFBYVI7Z0JBQzdFO2dCQUNBLElBQUljLGNBQWM7b0JBQ2hCLE9BQU9BO2dCQUNULE9BQU87b0JBQ0wsTUFBTSxJQUFJRyxNQUFNO2dCQUNsQjtZQUNGO1FBQ0Y7S0FBRztJQUNIQyxRQUFRO0lBQ1JDLE9BQU87UUFDTEMsUUFBUTtJQUNWO0lBQ0FDLFdBQVc7UUFDVCxNQUFNRCxRQUFPLEVBQ1hKLElBQUksRUFDSk0sT0FBTyxFQUNQQyxPQUFPLEVBQ1B6QixLQUFLLEVBQ0xVLFdBQVcsRUFDWjtZQUNDLE9BQU87UUFDVDtRQUNBZ0IsU0FBUyxDQUFDLEVBQ1JBLE9BQU8sRUFDUHBCLEtBQUssRUFDTjtZQUNDb0IsUUFBUVIsSUFBSSxHQUFHO2dCQUNibEIsT0FBTztnQkFDUFMsTUFBTTtZQUNSO1lBQ0EsT0FBT2tCLFFBQVFDLE9BQU8sQ0FBQ0Y7UUFDekI7SUFDRjtJQUNBQSxTQUFTO1FBQ1BHLFFBQVEsS0FBSyxLQUFLLEtBQUs7UUFDdkJDLHNCQUFzQjtZQUNwQixPQUFPakMsbURBQVdBLENBQUMsSUFBSWtDLFFBQVEsQ0FBQztRQUNsQztJQUNGO0FBQ0YsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2xhcmtvbm5leHQvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vb3B0aW9ucy5qcz9lYTZjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuZXhwb3J0IGNvbnN0IGZha2VVc2VycyA9IFt7XG4gIGlkOiAnMScsXG4gIGVtYWlsOiAndXNlckBkZW1vLmNvbScsXG4gIHVzZXJuYW1lOiAnZGVtb191c2VyJyxcbiAgcGFzc3dvcmQ6ICcxMjM0NTYnLFxuICBmaXJzdE5hbWU6ICdEZW1vJyxcbiAgbGFzdE5hbWU6ICdVc2VyJyxcbiAgcm9sZTogJ0FkbWluJyxcbiAgdG9rZW46ICdleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUowWldOb2VtRmhJaXdpWVhWa0lqb2lhSFIwY0hNNkx5OTBaV05vZW1GaExtZGxkR0Z3Y0hWcExtTnZiUzhpTENKemRXSWlPaUp6ZFhCd2IzSjBRR052WkdWeWRHaGxiV1Z6TG1OdmJTSXNJbXhoYzNST1lXMWxJam9pVkdWamFIcGhZU0lzSWtWdFlXbHNJam9pZEdWamFIcGhZWE4wZFdScGIwQm5iV0ZwYkM1amIyMGlMQ0pTYjJ4bElqb2lRV1J0YVc0aUxDSm1hWEp6ZEU1aGJXVWlPaUpVWlhOMFZHOXJaVzRpZlEudWQ0TG5GWi1tcWhIRVlpUGYyd0NMTTdLdkxHb0F4aFhUQlN5bVJJWkVGTGxlRmtPMTE5QVhkOHAzT2ZQQ3BkVVdTeWVabDgtcFp5RWxBTmNfS0hqNXcnXG59XTtcbmV4cG9ydCBjb25zdCBvcHRpb25zID0ge1xuICBwcm92aWRlcnM6IFtDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICBuYW1lOiAnY3JlZGVudGlhbHMnLFxuICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICBlbWFpbDoge1xuICAgICAgICBsYWJlbDogJ0VtYWlsOicsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdFbnRlciB5b3VyIHVzZXJuYW1lJ1xuICAgICAgfSxcbiAgICAgIHBhc3N3b3JkOiB7XG4gICAgICAgIGxhYmVsOiAnUGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnXG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMsIHJlcSkge1xuICAgICAgY29uc3QgZmlsdGVyZWRVc2VyID0gZmFrZVVzZXJzLmZpbmQodXNlciA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyLmVtYWlsID09PSBjcmVkZW50aWFscz8uZW1haWwgJiYgdXNlci5wYXNzd29yZCA9PT0gY3JlZGVudGlhbHM/LnBhc3N3b3JkO1xuICAgICAgfSk7XG4gICAgICBpZiAoZmlsdGVyZWRVc2VyKSB7XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZFVzZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtYWlsIG9yIFBhc3N3b3JkIGlzIG5vdCB2YWxpZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSldLFxuICBzZWNyZXQ6ICdrdndMcmZyaS9NQnpuVUNvZklvUkg5K052R3U2R3F2VmRxTzNtb3IxR3VBPScsXG4gIHBhZ2VzOiB7XG4gICAgc2lnbkluOiAnL2F1dGgvc2lnbi1pbidcbiAgfSxcbiAgY2FsbGJhY2tzOiB7XG4gICAgYXN5bmMgc2lnbkluKHtcbiAgICAgIHVzZXIsXG4gICAgICBhY2NvdW50LFxuICAgICAgcHJvZmlsZSxcbiAgICAgIGVtYWlsLFxuICAgICAgY3JlZGVudGlhbHNcbiAgICB9KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHNlc3Npb246ICh7XG4gICAgICBzZXNzaW9uLFxuICAgICAgdG9rZW5cbiAgICB9KSA9PiB7XG4gICAgICBzZXNzaW9uLnVzZXIgPSB7XG4gICAgICAgIGVtYWlsOiAndXNlckBkZW1vLmNvbScsXG4gICAgICAgIG5hbWU6ICdUZXN0IFVzZXInXG4gICAgICB9O1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzZXNzaW9uKTtcbiAgICB9XG4gIH0sXG4gIHNlc3Npb246IHtcbiAgICBtYXhBZ2U6IDI0ICogNjAgKiA2MCAqIDEwMDAsXG4gICAgZ2VuZXJhdGVTZXNzaW9uVG9rZW46ICgpID0+IHtcbiAgICAgIHJldHVybiByYW5kb21CeXRlcygzMikudG9TdHJpbmcoJ2hleCcpO1xuICAgIH1cbiAgfVxufTsiXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsInJhbmRvbUJ5dGVzIiwiZmFrZVVzZXJzIiwiaWQiLCJlbWFpbCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsInJvbGUiLCJ0b2tlbiIsIm9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJsYWJlbCIsInR5cGUiLCJwbGFjZWhvbGRlciIsImF1dGhvcml6ZSIsInJlcSIsImZpbHRlcmVkVXNlciIsImZpbmQiLCJ1c2VyIiwiRXJyb3IiLCJzZWNyZXQiLCJwYWdlcyIsInNpZ25JbiIsImNhbGxiYWNrcyIsImFjY291bnQiLCJwcm9maWxlIiwic2Vzc2lvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwibWF4QWdlIiwiZ2VuZXJhdGVTZXNzaW9uVG9rZW4iLCJ0b1N0cmluZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/options.js\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.js":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./options */ \"(rsc)/./src/app/api/auth/[...nextauth]/options.js\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_options__WEBPACK_IMPORTED_MODULE_1__.options);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBaUM7QUFDRztBQUNwQyxNQUFNRSxVQUFVRixnREFBUUEsQ0FBQ0MsNkNBQU9BO0FBQ1ciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sYXJrb25uZXh0Ly4vc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLmpzPzIzMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRBdXRoIGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zJztcbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChvcHRpb25zKTtcbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTsiXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJvcHRpb25zIiwiaGFuZGxlciIsIkdFVCIsIlBPU1QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/preact","vendor-chunks/object-hash","vendor-chunks/lru-cache","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.js&appDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fp.thuyen%2FDocuments%2Fcoreproduct%2Fv1%2Ffontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();