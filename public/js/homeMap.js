/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/homeMap.js":
/*!***************************!*\
  !*** ./src/js/homeMap.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n    const lat = 39.73386300228461;\r\n    const lng = -104.96655449458407;\r\n    const map = L.map('homeMap').setView([lat, lng ], 14);\r\n\r\n    let markers = new L.FeatureGroup().addTo(map)\r\n    let properties = []\r\n\r\n    //Filters\r\n    const filters = {\r\n        category:'',\r\n        price:''\r\n    }\r\n\r\n    const categorySelected = document.querySelector('#categories')\r\n    const priceSelected = document.querySelector('#prices')\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n    //Get properties from the database\r\n    const getProperties = async () =>{\r\n        try {\r\n            const url = '/api/properties'\r\n            const response = await fetch(url)\r\n            properties = await response.json()\r\n\r\n            showProperties(properties)\r\n\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    //Show properties on the map\r\n    const showProperties = (props) =>{\r\n        markers.clearLayers()\r\n\r\n        props.forEach(property => {\r\n            const marker = new L.marker([property?.lat, property?.lng],{\r\n                autoPan:true\r\n            })\r\n            .addTo(map)\r\n            .bindPopup(`\r\n                <p class=\"font-semibold\">${property.category.name}</p>\r\n                <h3 class=\"text-indigo-600 text-lg font-bold uppercase my-2\">${property.title}</h3>\r\n                <img src=\"/uploads/${property.img}\" alt=\"Image of the property ${property.title}\">\r\n                <p class=\" font-semibold\">${property.price.name}</p>\r\n                <a href=\"/properties/${property.id}\" class=\"text-center uppercase block bg-indigo-300\">Details</a>\r\n            `)\r\n            \r\n            markers.addLayer(marker)\r\n        })\r\n    }\r\n\r\n    //filtering categories and prices\r\n    const filterProperties = () =>{\r\n        const result = properties\r\n            .filter(prop => filters.category ? prop.categoryId === filters.category : prop )\r\n            .filter(prop => filters.price ? prop.priceId === filters.price : prop)\r\n        \r\n        showProperties(result)\r\n    }\r\n    \r\n    categorySelected.addEventListener('change', e =>{\r\n        filters.category = +e.target.value //The + sign converts the sting into a interger\r\n        filterProperties()\r\n    })\r\n    \r\n    priceSelected.addEventListener('change', e =>{\r\n        filters.price = +e.target.value\r\n        filterProperties()\r\n    })\r\n    \r\n\r\n    getProperties()\r\n})()\n\n//# sourceURL=webpack://realstate/./src/js/homeMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/homeMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;