/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var m = __webpack_require__(1);
	var request = __webpack_require__(3);
	
	var app = {};
	
	var makeRand = function makeRand() {
	  var l = 8;
	  var c = "abcdefghijklmnopqrstuvwxyz0123456789";
	  var cl = c.length;
	  var r = "";
	  for (var i = 0; i < l; i++) {
	    r += c[Math.floor(Math.random() * cl)];
	  }
	  return r;
	};
	app.imgUpload = function (ev) {
	  app.state = loading;
	  m.redraw();
	  var data = new FormData(ev.target.parentNode);
	  m.startComputation();
	  request.post("/upload").send(data).end(function (err, res) {
	    console.log(res);
	    app.imgUrl = "/show/" + res.body.id;
	    m.endComputation();
	  });
	};
	app.imgUrl = null;
	var loading = "loading";
	var done = "done";
	app.state = done;
	app.controller = function () {
	  var upImage = app.imgUpload;
	  var imgUrl = app.imgUrl;
	  return {
	    imgUrl: imgUrl,
	    submit: function submit(ev) {
	      upImage(ev);
	    }
	  };
	};
	
	var imgView = function imgView(imgUrl, ctrl, state) {
	  var formParam = {
	    method: "post",
	    encType: "multipart/form-data"
	  };
	  if (imgUrl) {
	    var tweetUrl = window.location.href + imgUrl.slice(1, imgUrl.length);
	    var tweetText = window.location.href + " であけおめ画像";
	    return [m("img", { src: imgUrl }), m("h2", "よいお年を"), m("a", { href: "https://twitter.com/intent/tweet?text=" + tweetText + "&url=" + tweetUrl }, "tweet")];
	  } else {
	    switch (state) {
	      case loading:
	        var bar = {
	          class: "progress-bar progress-bar-striped active",
	          role: "progressbar",
	          style: "width: 100%"
	        };
	        return m("div", { class: "progress" }, m("div", bar));
	      case done:
	        return [m("p", "画像をupするとあけおめ入りにするよ（たぶん）"), m("form", formParam, [m("input", { class: "form-group", type: "file", name: makeRand(), encType: "multipart/form-data" }), m("input", { class: "btn btn-default", type: "button", value: "送信", onclick: ctrl.submit })])];
	    }
	  }
	};
	
	app.view = function (ctrl) {
	  var component = imgView(app.imgUrl, ctrl, app.state);
	  console.log(app.state);
	  return m("div", [component]);
	};
	
	m.mount(document.getElementById("app"), app);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {var m = (function app(window, undefined) {
		"use strict";
	  	var VERSION = "v0.2.2-rc.1";
		function isFunction(object) {
			return typeof object === "function";
		}
		function isObject(object) {
			return type.call(object) === "[object Object]";
		}
		function isString(object) {
			return type.call(object) === "[object String]";
		}
		var isArray = Array.isArray || function (object) {
			return type.call(object) === "[object Array]";
		};
		var type = {}.toString;
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
		var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
		var noop = function () {};
	
		// caching commonly used variables
		var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;
	
		// self invoking function needed because of the way mocks work
		function initialize(window) {
			$document = window.document;
			$location = window.location;
			$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
			$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
		}
	
		initialize(window);
	
		m.version = function() {
			return VERSION;
		};
	
		/**
		 * @typedef {String} Tag
		 * A string that looks like -> div.classname#id[param=one][param2=two]
		 * Which describes a DOM node
		 */
	
		/**
		 *
		 * @param {Tag} The DOM node tag
		 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
		 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
		 *
		 */
		function m(tag, pairs) {
			for (var args = [], i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
			if (isObject(tag)) return parameterize(tag, args);
			var hasAttrs = pairs != null && isObject(pairs) && !("tag" in pairs || "view" in pairs || "subtree" in pairs);
			var attrs = hasAttrs ? pairs : {};
			var classAttrName = "class" in attrs ? "class" : "className";
			var cell = {tag: "div", attrs: {}};
			var match, classes = [];
			if (!isString(tag)) throw new Error("selector in m(selector, attrs, children) should be a string");
			while ((match = parser.exec(tag)) != null) {
				if (match[1] === "" && match[2]) cell.tag = match[2];
				else if (match[1] === "#") cell.attrs.id = match[2];
				else if (match[1] === ".") classes.push(match[2]);
				else if (match[3][0] === "[") {
					var pair = attrParser.exec(match[3]);
					cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true);
				}
			}
	
			var children = hasAttrs ? args.slice(1) : args;
			if (children.length === 1 && isArray(children[0])) {
				cell.children = children[0];
			}
			else {
				cell.children = children;
			}
	
			for (var attrName in attrs) {
				if (attrs.hasOwnProperty(attrName)) {
					if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
						classes.push(attrs[attrName]);
						cell.attrs[attrName] = ""; //create key in correct iteration order
					}
					else cell.attrs[attrName] = attrs[attrName];
				}
			}
			if (classes.length) cell.attrs[classAttrName] = classes.join(" ");
	
			return cell;
		}
		function forEach(list, f) {
			for (var i = 0; i < list.length && !f(list[i], i++);) {}
		}
		function forKeys(list, f) {
			forEach(list, function (attrs, i) {
				return (attrs = attrs && attrs.attrs) && attrs.key != null && f(attrs, i);
			});
		}
		// This function was causing deopts in Chrome.
		function dataToString(data) {
			//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
			try {
				if (data == null || data.toString() == null) return "";
			} catch (e) {
				return "";
			}
			return data;
		}
		// This function was causing deopts in Chrome.
		function injectTextNode(parentElement, first, index, data) {
			try {
				insertNode(parentElement, first, index);
				first.nodeValue = data;
			} catch (e) {} //IE erroneously throws error when appending an empty text node after a null
		}
	
		function flatten(list) {
			//recursively flatten array
			for (var i = 0; i < list.length; i++) {
				if (isArray(list[i])) {
					list = list.concat.apply([], list);
					//check current index again and flatten until there are no more nested arrays at that index
					i--;
				}
			}
			return list;
		}
	
		function insertNode(parentElement, node, index) {
			parentElement.insertBefore(node, parentElement.childNodes[index] || null);
		}
	
		var DELETION = 1, INSERTION = 2, MOVE = 3;
	
		function handleKeysDiffer(data, existing, cached, parentElement) {
			forKeys(data, function (key, i) {
				existing[key = key.key] = existing[key] ? {
					action: MOVE,
					index: i,
					from: existing[key].index,
					element: cached.nodes[existing[key].index] || $document.createElement("div")
				} : {action: INSERTION, index: i};
			});
			var actions = [];
			for (var prop in existing) actions.push(existing[prop]);
			var changes = actions.sort(sortChanges), newCached = new Array(cached.length);
			newCached.nodes = cached.nodes.slice();
	
			forEach(changes, function (change) {
				var index = change.index;
				if (change.action === DELETION) {
					clear(cached[index].nodes, cached[index]);
					newCached.splice(index, 1);
				}
				if (change.action === INSERTION) {
					var dummy = $document.createElement("div");
					dummy.key = data[index].attrs.key;
					insertNode(parentElement, dummy, index);
					newCached.splice(index, 0, {
						attrs: {key: data[index].attrs.key},
						nodes: [dummy]
					});
					newCached.nodes[index] = dummy;
				}
	
				if (change.action === MOVE) {
					var changeElement = change.element;
					var maybeChanged = parentElement.childNodes[index];
					if (maybeChanged !== changeElement && changeElement !== null) {
						parentElement.insertBefore(changeElement, maybeChanged || null);
					}
					newCached[index] = cached[change.from];
					newCached.nodes[index] = changeElement;
				}
			});
	
			return newCached;
		}
	
		function diffKeys(data, cached, existing, parentElement) {
			var keysDiffer = data.length !== cached.length;
			if (!keysDiffer) {
				forKeys(data, function (attrs, i) {
					var cachedCell = cached[i];
					return keysDiffer = cachedCell && cachedCell.attrs && cachedCell.attrs.key !== attrs.key;
				});
			}
	
			return keysDiffer ? handleKeysDiffer(data, existing, cached, parentElement) : cached;
		}
	
		function diffArray(data, cached, nodes) {
			//diff the array itself
	
			//update the list of DOM nodes by collecting the nodes from each item
			forEach(data, function (_, i) {
				if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes);
			})
			//remove items from the end of the array if the new array is shorter than the old one. if errors ever happen here, the issue is most likely
			//a bug in the construction of the `cached` data structure somewhere earlier in the program
			forEach(cached.nodes, function (node, i) {
				if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]]);
			})
			if (data.length < cached.length) cached.length = data.length;
			cached.nodes = nodes;
		}
	
		function buildArrayKeys(data) {
			var guid = 0;
			forKeys(data, function () {
				forEach(data, function (attrs) {
					if ((attrs = attrs && attrs.attrs) && attrs.key == null) attrs.key = "__mithril__" + guid++;
				})
				return 1;
			});
		}
	
		function maybeRecreateObject(data, cached, dataAttrKeys) {
			//if an element is different enough from the one in cache, recreate it
			if (data.tag !== cached.tag ||
					dataAttrKeys.sort().join() !== Object.keys(cached.attrs).sort().join() ||
					data.attrs.id !== cached.attrs.id ||
					data.attrs.key !== cached.attrs.key ||
					(m.redraw.strategy() === "all" && (!cached.configContext || cached.configContext.retain !== true)) ||
					(m.redraw.strategy() === "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && isFunction(cached.configContext.onunload)) cached.configContext.onunload();
				if (cached.controllers) {
					forEach(cached.controllers, function (controller) {
						if (controller.unload) controller.onunload({preventDefault: noop});
					});
				}
			}
		}
	
		function getObjectNamespace(data, namespace) {
			return data.attrs.xmlns ? data.attrs.xmlns :
				data.tag === "svg" ? "http://www.w3.org/2000/svg" :
				data.tag === "math" ? "http://www.w3.org/1998/Math/MathML" :
				namespace;
		}
	
		function unloadCachedControllers(cached, views, controllers) {
			if (controllers.length) {
				cached.views = views;
				cached.controllers = controllers;
				forEach(controllers, function (controller) {
					if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old;
					if (pendingRequests && controller.onunload) {
						var onunload = controller.onunload;
						controller.onunload = noop;
						controller.onunload.$old = onunload;
					}
				});
			}
		}
	
		function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
			//schedule configs to be called. They are called after `build`
			//finishes running
			if (isFunction(data.attrs.config)) {
				var context = cached.configContext = cached.configContext || {};
	
				//bind
				configs.push(function() {
					return data.attrs.config.call(data, node, !isNew, context, cached);
				});
			}
		}
	
		function buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers) {
			var node = cached.nodes[0];
			if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
			cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
			cached.nodes.intact = true;
	
			if (controllers.length) {
				cached.views = views;
				cached.controllers = controllers;
			}
	
			return node;
		}
	
		function handleNonexistentNodes(data, parentElement, index) {
			var nodes;
			if (data.$trusted) {
				nodes = injectHTML(parentElement, index, data);
			}
			else {
				nodes = [$document.createTextNode(data)];
				if (!parentElement.nodeName.match(voidElements)) insertNode(parentElement, nodes[0], index);
			}
	
			var cached = typeof data === "string" || typeof data === "number" || typeof data === "boolean" ? new data.constructor(data) : data;
			cached.nodes = nodes;
			return cached;
		}
	
		function reattachNodes(data, cached, parentElement, editable, index, parentTag) {
			var nodes = cached.nodes;
			if (!editable || editable !== $document.activeElement) {
				if (data.$trusted) {
					clear(nodes, cached)
					nodes = injectHTML(parentElement, index, data)
				} else if (parentTag === "textarea") {
					// <textarea> uses `value` instead of `nodeValue`.
					parentElement.value = data
				} else if (editable) {
					// contenteditable nodes use `innerHTML` instead of `nodeValue`.
					editable.innerHTML = data
				} else {
					// was a trusted string
					if (nodes[0].nodeType === 1 || nodes.length > 1 || (nodes[0].nodeValue.trim && !nodes[0].nodeValue.trim())) {
						clear(cached.nodes, cached)
						nodes = [$document.createTextNode(data)]
					}
					injectTextNode(parentElement, nodes[0], index, data);
				}
			}
			cached = new data.constructor(data);
			cached.nodes = nodes;
			return cached;
		}
	
		function handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) {
			//handle text nodes
			return cached.nodes.length === 0 ? handleNonexistentNodes(data, parentElement, index) :
				cached.valueOf() !== data.valueOf() || shouldReattach === true ?
					reattachNodes(data, cached, parentElement, editable, index, parentTag) :
				(cached.nodes.intact = true, cached);
		}
	
		function getSubArrayCount(item) {
			if (item.$trusted) {
				//fix offset of next element if item was a trusted string w/ more than one html element
				//the first clause in the regexp matches elements
				//the second clause (after the pipe) matches text nodes
				var match = item.match(/<[^\/]|\>\s*[^<]/g);
				if (match != null) return match.length;
			}
			else if (isArray(item)) {
				return item.length;
			}
			return 1;
		}
	
		function buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) {
			data = flatten(data);
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;
	
			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var existing = {}, shouldMaintainIdentities = false;
			forKeys(cached, function (attrs, i) {
				shouldMaintainIdentities = true;
				existing[cached[i].attrs.key] = {action: DELETION, index: i};
			});
	
			buildArrayKeys(data);
			if (shouldMaintainIdentities) cached = diffKeys(data, cached, existing, parentElement);
			//end key algorithm
	
			var cacheCount = 0;
			//faster explicitly written
			for (var i = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
	
				if (item !== undefined) {
					intact = intact && item.nodes.intact;
					subArrayCount += getSubArrayCount(item);
					cached[cacheCount++] = item;
				}
			}
	
			if (!intact) diffArray(data, cached, nodes);
			return cached
		}
	
		function makeCache(data, cached, index, parentIndex, parentCache) {
			if (cached != null) {
				if (type.call(cached) === type.call(data)) return cached;
	
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex, end = offset + (isArray(data) ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
				} else if (cached.nodes) {
					clear(cached.nodes, cached);
				}
			}
	
			cached = new data.constructor();
			//if constructor creates a virtual dom element, use a blank object
			//as the base cached node instead of copying the virtual el (#277)
			if (cached.tag) cached = {};
			cached.nodes = [];
			return cached;
		}
	
		function constructNode(data, namespace) {
			return namespace === undefined ?
				data.attrs.is ? $document.createElement(data.tag, data.attrs.is) : $document.createElement(data.tag) :
				data.attrs.is ? $document.createElementNS(namespace, data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag);
		}
	
		function constructAttrs(data, node, namespace, hasKeys) {
			return hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs;
		}
	
		function constructChildren(data, node, cached, editable, namespace, configs) {
			return data.children != null && data.children.length > 0 ?
				build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
				data.children;
		}
	
		function reconstructCached(data, attrs, children, node, namespace, views, controllers) {
			var cached = {tag: data.tag, attrs: attrs, children: children, nodes: [node]};
			unloadCachedControllers(cached, views, controllers);
			if (cached.children && !cached.children.nodes) cached.children.nodes = [];
			//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
			if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
			return cached
		}
	
		function getController(views, view, cachedControllers, controller) {
			var controllerIndex = m.redraw.strategy() === "diff" && views ? views.indexOf(view) : -1;
			return controllerIndex > -1 ? cachedControllers[controllerIndex] :
				typeof controller === "function" ? new controller() : {};
		}
	
		function updateLists(views, controllers, view, controller) {
			if (controller.onunload != null) unloaders.push({controller: controller, handler: controller.onunload});
			views.push(view);
			controllers.push(controller);
		}
	
		function checkView(data, view, cached, cachedControllers, controllers, views) {
			var controller = getController(cached.views, view, cachedControllers, data.controller);
			//Faster to coerce to number and check for NaN
			var key = +(data && data.attrs && data.attrs.key);
			data = pendingRequests === 0 || forcing || cachedControllers && cachedControllers.indexOf(controller) > -1 ? data.view(controller) : {tag: "placeholder"};
			if (data.subtree === "retain") return cached;
			if (key === key) (data.attrs = data.attrs || {}).key = key;
			updateLists(views, controllers, view, controller);
			return data;
		}
	
		function markViews(data, cached, views, controllers) {
			var cachedControllers = cached && cached.controllers;
			while (data.view != null) data = checkView(data, data.view.$original || data.view, cached, cachedControllers, controllers, views);
			return data;
		}
	
		function buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) {
			var views = [], controllers = [];
			data = markViews(data, cached, views, controllers);
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.");
			data.attrs = data.attrs || {};
			cached.attrs = cached.attrs || {};
			var dataAttrKeys = Object.keys(data.attrs);
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
			maybeRecreateObject(data, cached, dataAttrKeys);
			if (!isString(data.tag)) return;
			var isNew = cached.nodes.length === 0;
			namespace = getObjectNamespace(data, namespace);
			var node;
			if (isNew) {
				node = constructNode(data, namespace);
				//set attributes first, then create children
				var attrs = constructAttrs(data, node, namespace, hasKeys)
				var children = constructChildren(data, node, cached, editable, namespace, configs);
				cached = reconstructCached(data, attrs, children, node, namespace, views, controllers);
			}
			else {
				node = buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers);
			}
			if (isNew || shouldReattach === true && node != null) insertNode(parentElement, node, index);
			//schedule configs to be called. They are called after `build`
			//finishes running
			scheduleConfigsToBeCalled(configs, data, node, isNew, cached);
			return cached
		}
	
		function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
			//`build` is a recursive function that manages creation/diffing/removal
			//of DOM elements based on comparison between `data` and `cached`
			//the diff algorithm can be summarized as this:
			//1 - compare `data` and `cached`
			//2 - if they are different, copy `data` to `cached` and update the DOM
			//    based on what the difference is
			//3 - recursively apply this algorithm for every array and for the
			//    children of every virtual element
	
			//the `cached` data structure is essentially the same as the previous
			//redraw's `data` data structure, with a few additions:
			//- `cached` always has a property called `nodes`, which is a list of
			//   DOM elements that correspond to the data represented by the
			//   respective virtual element
			//- in order to support attaching `nodes` as a property of `cached`,
			//   `cached` is *always* a non-primitive object, i.e. if the data was
			//   a string, then cached is a String instance. If data was `null` or
			//   `undefined`, cached is `new String("")`
			//- `cached also has a `configContext` property, which is the state
			//   storage object exposed by config(element, isInitialized, context)
			//- when `cached` is an Object, it represents a virtual element; when
			//   it's an Array, it represents a list of elements; when it's a
			//   String, Number or Boolean, it represents a text node
	
			//`parentElement` is a DOM element used for W3C DOM API calls
			//`parentTag` is only used for handling a corner case for textarea
			//values
			//`parentCache` is used to remove nodes in some multi-node cases
			//`parentIndex` and `index` are used to figure out the offset of nodes.
			//They're artifacts from before arrays started being flattened and are
			//likely refactorable
			//`data` and `cached` are, respectively, the new and old nodes being
			//diffed
			//`shouldReattach` is a flag indicating whether a parent node was
			//recreated (if so, and if this node is reused, then this node must
			//reattach itself to the new parent)
			//`editable` is a flag that indicates whether an ancestor is
			//contenteditable
			//`namespace` indicates the closest HTML namespace as it cascades down
			//from an ancestor
			//`configs` is a list of config functions to run after the topmost
			//`build` call finishes running
	
			//there's logic that relies on the assumption that null and undefined
			//data are equivalent to empty strings
			//- this prevents lifecycle surprises from procedural helpers that mix
			//  implicit and explicit return statements (e.g.
			//  function foo() {if (cond) return m("div")}
			//- it simplifies diffing code
			data = dataToString(data);
			if (data.subtree === "retain") return cached;
			cached = makeCache(data, cached, index, parentIndex, parentCache);
			return isArray(data) ? buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) :
				data != null && isObject(data) ? buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) :
				!isFunction(data) ? handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) :
				cached;
		}
		function sortChanges(a, b) { return a.action - b.action || a.index - b.index; }
		function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
			for (var attrName in dataAttrs) {
				var dataAttr = dataAttrs[attrName];
				var cachedAttr = cachedAttrs[attrName];
				if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
					cachedAttrs[attrName] = dataAttr;
					try {
						//`config` isn't a real attributes, so ignore it
						if (attrName === "config" || attrName === "key") continue;
						//hook event handlers to the auto-redrawing system
						else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
							node[attrName] = autoredraw(dataAttr, node);
						}
						//handle `style: {...}`
						else if (attrName === "style" && dataAttr != null && isObject(dataAttr)) {
							for (var rule in dataAttr) {
								if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule];
							}
							for (var rule in cachedAttr) {
								if (!(rule in dataAttr)) node.style[rule] = "";
							}
						}
						//handle SVG
						else if (namespace != null) {
							if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
							else node.setAttribute(attrName === "className" ? "class" : attrName, dataAttr);
						}
						//handle cases that are properties (but ignore cases where we should use setAttribute instead)
						//- list and form are typically used as strings, but are DOM element references in js
						//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
						else if (attrName in node && attrName !== "list" && attrName !== "style" && attrName !== "form" && attrName !== "type" && attrName !== "width" && attrName !== "height") {
							//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
							if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr;
						}
						else node.setAttribute(attrName, dataAttr);
					}
					catch (e) {
						//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
						if (e.message.indexOf("Invalid argument") < 0) throw e;
					}
				}
				//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
				else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
					node.value = dataAttr;
				}
			}
			return cachedAttrs;
		}
		function clear(nodes, cached) {
			for (var i = nodes.length - 1; i > -1; i--) {
				if (nodes[i] && nodes[i].parentNode) {
					try { nodes[i].parentNode.removeChild(nodes[i]); }
					catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					cached = [].concat(cached);
					if (cached[i]) unload(cached[i]);
				}
			}
			//release memory if nodes is an array. This check should fail if nodes is a NodeList (see loop above)
			if (nodes.length) nodes.length = 0;
		}
		function unload(cached) {
			if (cached.configContext && isFunction(cached.configContext.onunload)) {
				cached.configContext.onunload();
				cached.configContext.onunload = null;
			}
			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (isFunction(controller.onunload)) controller.onunload({preventDefault: noop});
				});
			}
			if (cached.children) {
				if (isArray(cached.children)) forEach(cached.children, unload);
				else if (cached.children.tag) unload(cached.children);
			}
		}
		function injectHTML(parentElement, index, data) {
			var nextSibling = parentElement.childNodes[index];
			if (nextSibling) {
				var isElement = nextSibling.nodeType !== 1;
				var placeholder = $document.createElement("span");
				if (isElement) {
					parentElement.insertBefore(placeholder, nextSibling || null);
					placeholder.insertAdjacentHTML("beforebegin", data);
					parentElement.removeChild(placeholder);
				}
				else nextSibling.insertAdjacentHTML("beforebegin", data);
			}
			else {
				if (window.Range && window.Range.prototype.createContextualFragment) {
					parentElement.appendChild($document.createRange().createContextualFragment(data));
				}
				else parentElement.insertAdjacentHTML("beforeend", data);
			}
			var nodes = [];
			while (parentElement.childNodes[index] !== nextSibling) {
				nodes.push(parentElement.childNodes[index]);
				index++;
			}
			return nodes;
		}
		function autoredraw(callback, object) {
			return function(e) {
				e = e || event;
				m.redraw.strategy("diff");
				m.startComputation();
				try { return callback.call(object, e); }
				finally {
					endFirstComputation();
				}
			};
		}
	
		var html;
		var documentNode = {
			appendChild: function(node) {
				if (html === undefined) html = $document.createElement("html");
				if ($document.documentElement && $document.documentElement !== node) {
					$document.replaceChild(node, $document.documentElement);
				}
				else $document.appendChild(node);
				this.childNodes = $document.childNodes;
			},
			insertBefore: function(node) {
				this.appendChild(node);
			},
			childNodes: []
		};
		var nodeCache = [], cellCache = {};
		m.render = function(root, cell, forceRecreation) {
			var configs = [];
			if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
			var id = getCellCacheKey(root);
			var isDocumentRoot = root === $document;
			var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
			if (isDocumentRoot && cell.tag !== "html") cell = {tag: "html", attrs: {}, children: cell};
			if (cellCache[id] === undefined) clear(node.childNodes);
			if (forceRecreation === true) reset(root);
			cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
			forEach(configs, function (config) { config(); });
		};
		function getCellCacheKey(element) {
			var index = nodeCache.indexOf(element);
			return index < 0 ? nodeCache.push(element) - 1 : index;
		}
	
		m.trust = function(value) {
			value = new String(value);
			value.$trusted = true;
			return value;
		};
	
		function gettersetter(store) {
			var prop = function() {
				if (arguments.length) store = arguments[0];
				return store;
			};
	
			prop.toJSON = function() {
				return store;
			};
	
			return prop;
		}
	
		m.prop = function (store) {
			//note: using non-strict equality check here because we're checking if store is null OR undefined
			if ((store != null && isObject(store) || isFunction(store)) && isFunction(store.then)) {
				return propify(store);
			}
	
			return gettersetter(store);
		};
	
		var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, topComponent, unloaders = [];
		var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
		function parameterize(component, args) {
			var controller = function() {
				return (component.controller || noop).apply(this, args) || this;
			};
			if (component.controller) controller.prototype = component.controller.prototype;
			var view = function(ctrl) {
				var currentArgs = arguments.length > 1 ? args.concat([].slice.call(arguments, 1)) : args;
				return component.view.apply(component, currentArgs ? [ctrl].concat(currentArgs) : [ctrl]);
			};
			view.$original = component.view;
			var output = {controller: controller, view: view};
			if (args[0] && args[0].key != null) output.attrs = {key: args[0].key};
			return output;
		}
		m.component = function(component) {
			for (var args = [], i = 1; i < arguments.length; i++) args.push(arguments[i]);
			return parameterize(component, args);
		};
		m.mount = m.module = function(root, component) {
			if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
			var index = roots.indexOf(root);
			if (index < 0) index = roots.length;
	
			var isPrevented = false;
			var event = {preventDefault: function() {
				isPrevented = true;
				computePreRedrawHook = computePostRedrawHook = null;
			}};
	
			forEach(unloaders, function (unloader) {
				unloader.handler.call(unloader.controller, event);
				unloader.controller.onunload = null;
			});
	
			if (isPrevented) {
				forEach(unloaders, function (unloader) {
					unloader.controller.onunload = unloader.handler;
				});
			}
			else unloaders = [];
	
			if (controllers[index] && isFunction(controllers[index].onunload)) {
				controllers[index].onunload(event);
			}
	
			var isNullComponent = component === null;
	
			if (!isPrevented) {
				m.redraw.strategy("all");
				m.startComputation();
				roots[index] = root;
				var currentComponent = component ? (topComponent = component) : (topComponent = component = {controller: noop});
				var controller = new (component.controller || noop)();
				//controllers may call m.mount recursively (via m.route redirects, for example)
				//this conditional ensures only the last recursive m.mount call is applied
				if (currentComponent === topComponent) {
					controllers[index] = controller;
					components[index] = component;
				}
				endFirstComputation();
				if (isNullComponent) {
					removeRootElement(root, index);
				}
				return controllers[index];
			}
			if (isNullComponent) {
				removeRootElement(root, index);
			}
		};
	
		function removeRootElement(root, index) {
			roots.splice(index, 1);
			controllers.splice(index, 1);
			components.splice(index, 1);
			reset(root);
			nodeCache.splice(getCellCacheKey(root), 1);
		}
	
		var redrawing = false, forcing = false;
		m.redraw = function(force) {
			if (redrawing) return;
			redrawing = true;
			if (force) forcing = true;
			try {
				//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
				//lastRedrawID is null if it's the first redraw and not an event handler
				if (lastRedrawId && !force) {
					//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
					//when rAF: always reschedule redraw
					if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
						if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
						lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
					}
				}
				else {
					redraw();
					lastRedrawId = $requestAnimationFrame(function() { lastRedrawId = null; }, FRAME_BUDGET);
				}
			}
			finally {
				redrawing = forcing = false;
			}
		};
		m.redraw.strategy = m.prop();
		function redraw() {
			if (computePreRedrawHook) {
				computePreRedrawHook();
				computePreRedrawHook = null;
			}
			forEach(roots, function (root, i) {
				var component = components[i];
				if (controllers[i]) {
					var args = [controllers[i]];
					m.render(root, component.view ? component.view(controllers[i], args) : "");
				}
			});
			//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
			if (computePostRedrawHook) {
				computePostRedrawHook();
				computePostRedrawHook = null;
			}
			lastRedrawId = null;
			lastRedrawCallTime = new Date;
			m.redraw.strategy("diff");
		}
	
		var pendingRequests = 0;
		m.startComputation = function() { pendingRequests++; };
		m.endComputation = function() {
			if (pendingRequests > 1) pendingRequests--;
			else {
				pendingRequests = 0;
				m.redraw();
			}
		}
	
		function endFirstComputation() {
			if (m.redraw.strategy() === "none") {
				pendingRequests--;
				m.redraw.strategy("diff");
			}
			else m.endComputation();
		}
	
		m.withAttr = function(prop, withAttrCallback, callbackThis) {
			return function(e) {
				e = e || event;
				var currentTarget = e.currentTarget || this;
				var _this = callbackThis || this;
				withAttrCallback.call(_this, prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop));
			};
		};
	
		//routing
		var modes = {pathname: "", hash: "#", search: "?"};
		var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
		m.route = function(root, arg1, arg2, vdom) {
			//m.route()
			if (arguments.length === 0) return currentRoute;
			//m.route(el, defaultRoute, routes)
			else if (arguments.length === 3 && isString(arg1)) {
				redirect = function(source) {
					var path = currentRoute = normalizeRoute(source);
					if (!routeByValue(root, arg2, path)) {
						if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route");
						isDefaultRoute = true;
						m.route(arg1, true);
						isDefaultRoute = false;
					}
				};
				var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
				window[listener] = function() {
					var path = $location[m.route.mode];
					if (m.route.mode === "pathname") path += $location.search;
					if (currentRoute !== normalizeRoute(path)) redirect(path);
				};
	
				computePreRedrawHook = setScroll;
				window[listener]();
			}
			//config: m.route
			else if (root.addEventListener || root.attachEvent) {
				root.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
				if (root.addEventListener) {
					root.removeEventListener("click", routeUnobtrusive);
					root.addEventListener("click", routeUnobtrusive);
				}
				else {
					root.detachEvent("onclick", routeUnobtrusive);
					root.attachEvent("onclick", routeUnobtrusive);
				}
			}
			//m.route(route, params, shouldReplaceHistoryEntry)
			else if (isString(root)) {
				var oldRoute = currentRoute;
				currentRoute = root;
				var args = arg1 || {};
				var queryIndex = currentRoute.indexOf("?");
				var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {};
				for (var i in args) params[i] = args[i];
				var querystring = buildQueryString(params);
				var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute;
				if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;
	
				var shouldReplaceHistoryEntry = (arguments.length === 3 ? arg2 : arg1) === true || oldRoute === root;
	
				if (window.history.pushState) {
					computePreRedrawHook = setScroll;
					computePostRedrawHook = function() {
						window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					};
					redirect(modes[m.route.mode] + currentRoute);
				}
				else {
					$location[m.route.mode] = currentRoute;
					redirect(modes[m.route.mode] + currentRoute);
				}
			}
		};
		m.route.param = function(key) {
			if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()");
			if( !key ){
				return routeParams;
			}
			return routeParams[key];
		};
		m.route.mode = "search";
		function normalizeRoute(route) {
			return route.slice(modes[m.route.mode].length);
		}
		function routeByValue(root, router, path) {
			routeParams = {};
	
			var queryStart = path.indexOf("?");
			if (queryStart !== -1) {
				routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
				path = path.substr(0, queryStart);
			}
	
			// Get all routes and check if there's
			// an exact match for the current path
			var keys = Object.keys(router);
			var index = keys.indexOf(path);
			if(index !== -1){
				m.mount(root, router[keys [index]]);
				return true;
			}
	
			for (var route in router) {
				if (route === path) {
					m.mount(root, router[route]);
					return true;
				}
	
				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");
	
				if (matcher.test(path)) {
					path.replace(matcher, function() {
						var keys = route.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						forEach(keys, function (key, i) {
							routeParams[key.replace(/:|\./g, "")] = decodeURIComponent(values[i]);
						})
						m.mount(root, router[route]);
					});
					return true;
				}
			}
		}
		function routeUnobtrusive(e) {
			e = e || event;
	
			if (e.ctrlKey || e.metaKey || e.which === 2) return;
	
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
	
			var currentTarget = e.currentTarget || e.srcElement;
			var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
			while (currentTarget && currentTarget.nodeName.toUpperCase() !== "A") currentTarget = currentTarget.parentNode;
			// clear pendingRequests because we want an immediate route change
			pendingRequests = 0;
			m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args);
		}
		function setScroll() {
			if (m.route.mode !== "hash" && $location.hash) $location.hash = $location.hash;
			else window.scrollTo(0, 0);
		}
		function buildQueryString(object, prefix) {
			var duplicates = {};
			var str = [];
			for (var prop in object) {
				var key = prefix ? prefix + "[" + prop + "]" : prop;
				var value = object[prop];
	
				if (value === null) {
					str.push(encodeURIComponent(key));
				} else if (isObject(value)) {
					str.push(buildQueryString(value, key));
				} else if (isArray(value)) {
					var keys = [];
					duplicates[key] = duplicates[key] || {};
					forEach(value, function (item) {
						if (!duplicates[key][item]) {
							duplicates[key][item] = true;
							keys.push(encodeURIComponent(key) + "=" + encodeURIComponent(item));
						}
					});
					str.push(keys.join("&"));
				} else if (value !== undefined) {
					str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
				}
			}
			return str.join("&");
		}
		function parseQueryString(str) {
			if (str === "" || str == null) return {};
			if (str.charAt(0) === "?") str = str.slice(1);
	
			var pairs = str.split("&"), params = {};
			forEach(pairs, function (string) {
				var pair = string.split("=");
				var key = decodeURIComponent(pair[0]);
				var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null;
				if (params[key] != null) {
					if (!isArray(params[key])) params[key] = [params[key]];
					params[key].push(value);
				}
				else params[key] = value;
			});
	
			return params;
		}
		m.route.buildQueryString = buildQueryString;
		m.route.parseQueryString = parseQueryString;
	
		function reset(root) {
			var cacheKey = getCellCacheKey(root);
			clear(root.childNodes, cellCache[cacheKey]);
			cellCache[cacheKey] = undefined;
		}
	
		m.deferred = function () {
			var deferred = new Deferred();
			deferred.promise = propify(deferred.promise);
			return deferred;
		};
		function propify(promise, initialValue) {
			var prop = m.prop(initialValue);
			promise.then(prop);
			prop.then = function(resolve, reject) {
				return propify(promise.then(resolve, reject), initialValue);
			};
			prop["catch"] = prop.then.bind(null, null);
			return prop;
		}
		//Promiz.mithril.js | Zolmeister | MIT
		//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
		//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
		//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
		function Deferred(successCallback, failureCallback) {
			var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
			var self = this, state = 0, promiseValue = 0, next = [];
	
			self.promise = {};
	
			self.resolve = function(value) {
				if (!state) {
					promiseValue = value;
					state = RESOLVING;
	
					fire();
				}
				return this;
			};
	
			self.reject = function(value) {
				if (!state) {
					promiseValue = value;
					state = REJECTING;
	
					fire();
				}
				return this;
			};
	
			self.promise.then = function(successCallback, failureCallback) {
				var deferred = new Deferred(successCallback, failureCallback)
				if (state === RESOLVED) {
					deferred.resolve(promiseValue);
				}
				else if (state === REJECTED) {
					deferred.reject(promiseValue);
				}
				else {
					next.push(deferred);
				}
				return deferred.promise
			};
	
			function finish(type) {
				state = type || REJECTED;
				next.map(function(deferred) {
					state === RESOLVED ? deferred.resolve(promiseValue) : deferred.reject(promiseValue);
				});
			}
	
			function thennable(then, successCallback, failureCallback, notThennableCallback) {
				if (((promiseValue != null && isObject(promiseValue)) || isFunction(promiseValue)) && isFunction(then)) {
					try {
						// count protects against abuse calls from spec checker
						var count = 0;
						then.call(promiseValue, function(value) {
							if (count++) return;
							promiseValue = value;
							successCallback();
						}, function (value) {
							if (count++) return;
							promiseValue = value;
							failureCallback();
						});
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						failureCallback();
					}
				} else {
					notThennableCallback();
				}
			}
	
			function fire() {
				// check if it's a thenable
				var then;
				try {
					then = promiseValue && promiseValue.then;
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					state = REJECTING;
					return fire();
				}
	
				if (state === REJECTING) {
					m.deferred.onerror(promiseValue)
				}
	
				thennable(then, function () {
					state = RESOLVING
					fire()
				}, function () {
					state = REJECTING
					fire()
				}, function () {
					try {
						if (state === RESOLVING && isFunction(successCallback)) {
							promiseValue = successCallback(promiseValue);
						}
						else if (state === REJECTING && isFunction(failureCallback)) {
							promiseValue = failureCallback(promiseValue);
							state = RESOLVING;
						}
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						return finish();
					}
	
					if (promiseValue === self) {
						promiseValue = TypeError();
						finish();
					} else {
						thennable(then, function () {
							finish(RESOLVED);
						}, finish, function () {
							finish(state === RESOLVING && RESOLVED);
						});
					}
				});
			}
		}
		m.deferred.onerror = function(e) {
			if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) {
				pendingRequests = 0;
				throw e;
			}
		};
	
		m.sync = function(args) {
			var method = "resolve";
	
			function synchronizer(pos, resolved) {
				return function(value) {
					results[pos] = value;
					if (!resolved) method = "reject";
					if (--outstanding === 0) {
						deferred.promise(results);
						deferred[method](results);
					}
					return value;
				};
			}
	
			var deferred = m.deferred();
			var outstanding = args.length;
			var results = new Array(outstanding);
			if (args.length > 0) {
				forEach(args, function (arg, i) {
					arg.then(synchronizer(i, true), synchronizer(i, false));
				});
			}
			else deferred.resolve([]);
	
			return deferred.promise;
		};
		function identity(value) { return value; }
	
		function ajax(options) {
			if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
				var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36)
				var script = $document.createElement("script");
	
				window[callbackKey] = function(resp) {
					script.parentNode.removeChild(script);
					options.onload({
						type: "load",
						target: {
							responseText: resp
						}
					});
					window[callbackKey] = undefined;
				};
	
				script.onerror = function() {
					script.parentNode.removeChild(script);
	
					options.onerror({
						type: "error",
						target: {
							status: 500,
							responseText: JSON.stringify({
								error: "Error making jsonp request"
							})
						}
					});
					window[callbackKey] = undefined;
	
					return false;
				}
	
				script.onload = function() {
					return false;
				};
	
				script.src = options.url
					+ (options.url.indexOf("?") > 0 ? "&" : "?")
					+ (options.callbackKey ? options.callbackKey : "callback")
					+ "=" + callbackKey
					+ "&" + buildQueryString(options.data || {});
				$document.body.appendChild(script);
			}
			else {
				var xhr = new window.XMLHttpRequest();
				xhr.open(options.method, options.url, true, options.user, options.password);
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
						else options.onerror({type: "error", target: xhr});
					}
				};
				if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				}
				if (options.deserialize === JSON.parse) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (isFunction(options.config)) {
					var maybeXhr = options.config(xhr, options);
					if (maybeXhr != null) xhr = maybeXhr;
				}
	
				var data = options.method === "GET" || !options.data ? "" : options.data;
				if (data && (!isString(data) && data.constructor !== window.FormData)) {
					throw new Error("Request data should be either be a string or FormData. Check the `serialize` option in `m.request`");
				}
				xhr.send(data);
				return xhr;
			}
		}
	
		function bindData(xhrOptions, data, serialize) {
			if (xhrOptions.method === "GET" && xhrOptions.dataType !== "jsonp") {
				var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
				var querystring = buildQueryString(data);
				xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "");
			}
			else xhrOptions.data = serialize(data);
			return xhrOptions;
		}
	
		function parameterizeUrl(url, data) {
			var tokens = url.match(/:[a-z]\w+/gi);
			if (tokens && data) {
				forEach(tokens, function (token) {
					var key = token.slice(1);
					url = url.replace(token, data[key]);
					delete data[key];
				});
			}
			return url;
		}
	
		m.request = function(xhrOptions) {
			if (xhrOptions.background !== true) m.startComputation();
			var deferred = new Deferred();
			var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp"
			var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
			var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
			var extract = isJSONP ? function(jsonp) { return jsonp.responseText } : xhrOptions.extract || function(xhr) {
				if (xhr.responseText.length === 0 && deserialize === JSON.parse) {
					return null
				} else {
					return xhr.responseText
				}
			};
			xhrOptions.method = (xhrOptions.method || "GET").toUpperCase();
			xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
			xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
			xhrOptions.onload = xhrOptions.onerror = function(e) {
				try {
					e = e || event;
					var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
					var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
					if (e.type === "load") {
						if (isArray(response) && xhrOptions.type) {
							forEach(response, function (res, i) {
								response[i] = new xhrOptions.type(res);
							});
						} else if (xhrOptions.type) {
							response = new xhrOptions.type(response);
						}
						deferred.resolve(response)
					} else {
						deferred.reject(response)
					}
	
					deferred[e.type === "load" ? "resolve" : "reject"](response);
				}
				catch (e) {
					deferred.reject(e);
				}
				finally {
					if (xhrOptions.background !== true) m.endComputation()
				}
			}
	
			ajax(xhrOptions);
			deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
			return deferred.promise;
		};
	
		//testing API
		m.deps = function(mock) {
			initialize(window = mock || window);
			return window;
		};
		//for internal testing only, do not use `m.deps.factory`
		m.deps.factory = app;
	
		return m;
	})(typeof window !== "undefined" ? window : {});
	
	if (typeof module === "object" && module != null && module.exports) module.exports = m;
	else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return m }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */
	
	var Emitter = __webpack_require__(4);
	var reduce = __webpack_require__(5);
	
	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  root = this;
	}
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isHost(obj) {
	  var str = {}.toString.call(obj);
	
	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return obj === Object(obj);
	}
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pushEncodedKeyValuePair(pairs, key, obj[key]);
	        }
	      }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (Array.isArray(val)) {
	    return val.forEach(function(v) {
	      pushEncodedKeyValuePair(pairs, key, v);
	    });
	  }
	  pairs.push(encodeURIComponent(key)
	    + '=' + encodeURIComponent(val));
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function type(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);
	
	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	Response.prototype.setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	
	  var type = status / 100 | 0;
	
	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;
	
	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;
	
	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  Emitter.call(this);
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {};
	  this._header = {};
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    if (err) {
	      return self.callback(err, res);
	    }
	
	    if (res.status >= 200 && res.status < 300) {
	      return self.callback(err, res);
	    }
	
	    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	    new_err.original = err;
	    new_err.response = res;
	    new_err.status = res.status;
	
	    self.callback(new_err, res);
	  });
	}
	
	/**
	 * Mixin `Emitter`.
	 */
	
	Emitter(Request.prototype);
	
	/**
	 * Allow for extension
	 */
	
	Request.prototype.use = function(fn) {
	  fn(this);
	  return this;
	}
	
	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.timeout = function(ms){
	  this._timeout = ms;
	  return this;
	};
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.clearTimeout = function(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	
	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 */
	
	Request.prototype.getHeader = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Force given parser
	 *
	 * Sets the body parser no matter type.
	 *
	 * @param {Function}
	 * @api public
	 */
	
	Request.prototype.parse = function(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass){
	  var str = btoa(user + ':' + pass);
	  this.set('Authorization', 'Basic ' + str);
	  return this;
	};
	
	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.field = function(name, val){
	  if (!this._formData) this._formData = new root.FormData();
	  this._formData.append(name, val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, filename){
	  if (!this._formData) this._formData = new root.FormData();
	  this._formData.append(field, file, filename);
	  return this;
	};
	
	/**
	 * Send `data`, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // querystring
	 *       request.get('/search')
	 *         .end(callback)
	 *
	 *       // multiple data "writes"
	 *       request.get('/search')
	 *         .send({ search: 'query' })
	 *         .send({ range: '1..5' })
	 *         .send({ order: 'desc' })
	 *         .end(callback)
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this.getHeader('Content-Type');
	
	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this.getHeader('Content-Type');
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!obj || isHost(data)) return this;
	  if (!type) this.type('json');
	  return this;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (0 == status) {
	      if (self.timedout) return self.timeoutError();
	      if (self.aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(e){
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch(e) {
	    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	    // Reported here:
	    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	  }
	
	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }
	
	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	
	  // initiate request
	  xhr.open(this.method, this.url, true);
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var contentType = this.getHeader('Content-Type');
	    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	/**
	 * Faux promise support
	 *
	 * @param {Function} fulfill
	 * @param {Function} reject
	 * @return {Request}
	 */
	
	Request.prototype.then = function (fulfill, reject) {
	  return this.end(function(err, res) {
	    err ? reject(err) : fulfill(res);
	  });
	}
	
	/**
	 * Expose `Request`.
	 */
	
	request.Request = Request;
	
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */
	
	function request(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new Request('GET', method).end(url);
	  }
	
	  // url first
	  if (1 == arguments.length) {
	    return new Request('GET', method);
	  }
	
	  return new Request(method, url);
	}
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request.del = del;
	request.delete = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * Expose `request`.
	 */
	
	module.exports = request;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	module.exports = Emitter;
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};
	
	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */
	
	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];
	
	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map