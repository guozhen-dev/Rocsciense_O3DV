(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["OrientationGizmo"] = factory(require("three"));
	else
		root["OrientationGizmo"] = factory(root["THREE"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/OrientationGizmo.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/OrientationGizmo.js":
/*!*********************************!*\
  !*** ./src/OrientationGizmo.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar THREE = __webpack_require__(/*! three */ \"three\");\r\n\r\nclass OrientationGizmo extends HTMLElement {\r\n\tconstructor(camera, options) {\r\n\t\tsuper();\r\n\t\tthis.camera = camera;\r\n\t\tthis.options = Object.assign({\r\n\t\t\tsize: 90,\r\n\t\t\tpadding: 8,\r\n\t\t\tbubbleSizePrimary: 8,\r\n\t\t\tbubbleSizeSeconday: 6,\r\n\t\t\tshowSecondary: true,\r\n\t\t\tlineWidth: 2,\r\n\t\t\tfontSize: \"11px\",\r\n\t\t\tfontFamily: \"arial\",\r\n\t\t\tfontWeight: \"bold\",\r\n\t\t\tfontColor: \"#151515\",\r\n\t\t\tfontYAdjust: 0,\r\n\t\t\tcolors: {\r\n\t\t\t\tx: [\"#f73c3c\", \"#942424\"],\r\n\t\t\t\ty: [\"#6ccb26\", \"#417a17\"],\r\n\t\t\t\tz: [\"#178cf0\", \"#0e5490\"],\r\n\t\t\t}\r\n\t\t}, options);\r\n\r\n\t\t// Function called when axis is clicked\r\n\t\tthis.onAxisSelected = null;\r\n\r\n\t\t// Generate list of axes\r\n\t\tthis.bubbles = [\r\n\t\t\t{ axis: \"x\", direction: new THREE.Vector3(1, 0, 0), size: this.options.bubbleSizePrimary, color: this.options.colors.x, line: this.options.lineWidth, label: \"X\" },\r\n\t\t\t{ axis: \"y\", direction: new THREE.Vector3(0, 1, 0), size: this.options.bubbleSizePrimary, color: this.options.colors.y, line: this.options.lineWidth, label: \"Y\" },\r\n\t\t\t{ axis: \"z\", direction: new THREE.Vector3(0, 0, 1), size: this.options.bubbleSizePrimary, color: this.options.colors.z, line: this.options.lineWidth, label: \"Z\" },\r\n\t\t\t{ axis: \"-x\", direction: new THREE.Vector3(-1, 0, 0), size: this.options.bubbleSizeSeconday, color: this.options.colors.x },\r\n\t\t\t{ axis: \"-y\", direction: new THREE.Vector3(0, -1, 0), size: this.options.bubbleSizeSeconday, color: this.options.colors.y },\r\n\t\t\t{ axis: \"-z\", direction: new THREE.Vector3(0, 0, -1), size: this.options.bubbleSizeSeconday, color: this.options.colors.z },\r\n\t\t];\r\n\r\n\t\tthis.center = new THREE.Vector3(this.options.size / 2, this.options.size / 2, 0);\r\n\t\tthis.selectedAxis = null;\r\n\r\n\t\t// All we need is a canvas\r\n\t\tthis.innerHTML = \"<canvas width='\" + this.options.size + \"' height='\" + this.options.size + \"'></canvas>\";\r\n\r\n\t\tthis.onMouseMove = this.onMouseMove.bind(this);\r\n\t\tthis.onMouseOut = this.onMouseOut.bind(this);\r\n\t\tthis.onMouseClick = this.onMouseClick.bind(this);\r\n\t}\r\n\r\n\tconnectedCallback() {\r\n\t\tthis.canvas = this.querySelector(\"canvas\");\r\n\t\tthis.context = this.canvas.getContext(\"2d\");\r\n\r\n\t\tthis.canvas.addEventListener('mousemove', this.onMouseMove, false);\r\n\t\tthis.canvas.addEventListener('mouseout', this.onMouseOut, false);\r\n\t\tthis.canvas.addEventListener('click', this.onMouseClick, false);\r\n\t}\r\n\r\n\tdisconnectedCallback() {\r\n\t\tthis.canvas.removeEventListener('mousemove', this.onMouseMove, false);\r\n\t\tthis.canvas.removeEventListener('mouseout', this.onMouseOut, false);\r\n\t\tthis.canvas.removeEventListener('click', this.onMouseClick, false);\r\n\t}\r\n\r\n\tonMouseMove(evt) {\r\n\t\tvar rect = this.canvas.getBoundingClientRect();\r\n\t\tthis.mouse = new THREE.Vector3(evt.clientX - rect.left, evt.clientY - rect.top, 0);\r\n\t}\r\n\r\n\tonMouseOut(evt) {\r\n\t\tthis.mouse = null;\r\n\t}\r\n\r\n\tonMouseClick(evt) {\r\n\t\tif (!!this.onAxisSelected && typeof this.onAxisSelected == \"function\") {\r\n\t\t\tthis.onAxisSelected({ axis: this.selectedAxis.axis, direction: this.selectedAxis.direction.clone() });\r\n\t\t}\r\n\t}\r\n\r\n\tclear() {\r\n\t\tthis.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n\t}\r\n\r\n\tdrawCircle(p, radius = 10, color = \"#FF0000\") {\r\n\t\tthis.context.beginPath();\r\n\t\tthis.context.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);\r\n\t\tthis.context.fillStyle = color;\r\n\t\tthis.context.fill();\r\n\t\tthis.context.closePath();\r\n\t}\r\n\r\n\tdrawLine(p1, p2, width = 1, color = \"#FF0000\") {\r\n\t\tthis.context.beginPath();\r\n\t\tthis.context.moveTo(p1.x, p1.y);\r\n\t\tthis.context.lineTo(p2.x, p2.y);\r\n\t\tthis.context.lineWidth = width;\r\n\t\tthis.context.strokeStyle = color;\r\n\t\tthis.context.stroke();\r\n\t\tthis.context.closePath();\r\n\t}\r\n\r\n\tupdate() {\r\n\t\tthis.clear();\r\n\r\n\t\t// Calculate the rotation matrix from the camera\r\n\t\tlet rotMat = new THREE.Matrix4().makeRotationFromEuler(this.camera.rotation);\r\n\t\tlet invRotMat = new THREE.Matrix4().getInverse(rotMat);\r\n\r\n\t\tfor (var bubble of this.bubbles) {\r\n\t\t\tbubble.position = this.getBubblePosition(bubble.direction.clone().applyMatrix4(invRotMat));\r\n\t\t}\r\n\r\n\t\t// Generate a list of layers to draw\r\n\t\tvar layers = [];\r\n\t\tfor (var axis in this.bubbles) {\r\n\t\t\t// Check if the name starts with a negative and dont add it to the layer list if secondary axis is turned off\r\n\t\t\tif (this.options.showSecondary == true || axis[0] != \"-\") {\r\n\t\t\t\tlayers.push(this.bubbles[axis]);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\t// Sort the layers where the +Z position is last so its drawn on top of anything below it\r\n\t\tlayers.sort((a, b) => (a.position.z > b.position.z) ? 1 : -1);\r\n\r\n\t\t// If the mouse is over the gizmo, find the closest axis and highlight it\r\n\t\tthis.selectedAxis = null;\r\n\r\n\t\tif (this.mouse) {\r\n\t\t\tvar closestDist = Infinity;\r\n\r\n\t\t\t// Loop through each layer\r\n\t\t\tfor (var bubble of layers) {\r\n\t\t\t\tvar distance = this.mouse.distanceTo(bubble.position);\r\n\r\n\t\t\t\t// Only select the axis if its closer to the mouse than the previous or if its within its bubble circle\r\n\t\t\t\tif (distance < closestDist || distance < bubble.size) {\r\n\t\t\t\t\tclosestDist = distance;\r\n\t\t\t\t\tthis.selectedAxis = bubble;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\t// Draw the layers\r\n\t\tthis.drawLayers(layers);\r\n\t}\r\n\r\n\tdrawLayers(layers) {\r\n\t\t// For each layer, draw the bubble\r\n\t\tfor (var bubble of layers) {\r\n\t\t\tvar color = bubble.color;\r\n\r\n\t\t\t// Find the color\r\n\t\t\tif (this.selectedAxis == bubble) {\r\n\t\t\t\tcolor = \"#FFFFFF\";\r\n\t\t\t} else if (bubble.position.z >= -0.01) {\r\n\t\t\t\tcolor = bubble.color[0]\r\n\t\t\t} else {\r\n\t\t\t\tcolor = bubble.color[1]\r\n\t\t\t}\r\n\r\n\t\t\t// Draw the circle for the bubbble\r\n\t\t\tthis.drawCircle(bubble.position, bubble.size, color);\r\n\r\n\t\t\t// Draw the line that connects it to the center if enabled\r\n\t\t\tif (bubble.line) {\r\n\t\t\t\tthis.drawLine(this.center, bubble.position, bubble.line, color);\r\n\t\t\t}\r\n\r\n\t\t\t// Write the axis label (X,Y,Z) if provided\r\n\t\t\tif (bubble.label) {\r\n\t\t\t\tthis.context.font = [this.options.fontWeight, this.options.fontSize, this.options.fontFamily].join(\" \");\r\n\t\t\t\tthis.context.fillStyle = this.options.fontColor;\r\n\t\t\t\tthis.context.textBaseline = 'middle';\r\n\t\t\t\tthis.context.textAlign = 'center';\r\n\t\t\t\tthis.context.fillText(bubble.label, bubble.position.x, bubble.position.y + this.options.fontYAdjust);\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\r\n\tgetBubblePosition(position) {\r\n\t\treturn new THREE.Vector3((position.x * (this.center.x - (this.options.bubbleSizePrimary / 2) - this.options.padding)) + this.center.x,\r\n\t\t\tthis.center.y - (position.y * (this.center.y - (this.options.bubbleSizePrimary / 2) - this.options.padding)),\r\n\t\t\tposition.z);\r\n\t}\r\n}\r\n\r\nwindow.customElements.define('orientation-gizmo', OrientationGizmo);\r\n\r\nmodule.exports = OrientationGizmo;\r\n\n\n//# sourceURL=webpack://OrientationGizmo/./src/OrientationGizmo.js?");

/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_three__;\n\n//# sourceURL=webpack://OrientationGizmo/external_%7B%22commonjs%22:%22three%22,%22commonjs2%22:%22three%22,%22amd%22:%22three%22,%22root%22:%22THREE%22%7D?");

/***/ })

/******/ });
});