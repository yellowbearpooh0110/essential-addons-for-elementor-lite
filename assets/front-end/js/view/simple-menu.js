/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/view/simple-menu.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/view/simple-menu.js":
/*!************************************!*\
  !*** ./src/js/view/simple-menu.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var SimpleMenu = function SimpleMenu($scope, $) {\n  var $indicator_class = $('.eael-simple-menu-container', $scope).data('indicator-class');\n  var $hamburger_icon = $('.eael-simple-menu-container', $scope).data('hamburger-icon');\n  var $indicator_icon = $('.eael-simple-menu-container', $scope).data('indicator');\n  var $dropdown_indicator_icon = $('.eael-simple-menu-container', $scope).data('dropdown-indicator');\n  var $dropdown_indicator_class = $('.eael-simple-menu-container', $scope).data('dropdown-indicator-class');\n  var $horizontal = $('.eael-simple-menu', $scope).hasClass('eael-simple-menu-horizontal');\n  var $hamburger_breakpoints = $('.eael-simple-menu-container', $scope).data('hamburger-breakpoints');\n  var $hamburger_device = $('.eael-simple-menu-container', $scope).data('hamburger-device');\n\n  if (typeof $hamburger_device === 'undefined' || $hamburger_device === '' || $hamburger_device === null) {\n    $hamburger_device = 'tablet';\n  }\n\n  var selectorByType = $horizontal ? '.eael-simple-menu-horizontal' : '.eael-simple-menu-vertical';\n  var $hamburger_max_width = getHamburgerMaxWidth($hamburger_breakpoints, $hamburger_device);\n  var $fullWidth = $('.eael-simple-menu--stretch'),\n      all_ids = []; // add menu active class\n\n  $('.eael-simple-menu li a', $scope).each(function () {\n    var $this = $(this),\n        hashURL = $this.attr('href'),\n        thisURL = hashURL,\n        isStartWithHash,\n        splitURL = thisURL !== undefined ? thisURL.split('#') : [];\n    hashURL = hashURL === undefined ? '' : hashURL;\n    isStartWithHash = hashURL.startsWith('#');\n\n    if (hashURL !== '#' && splitURL.length > 1 && localize.page_permalink === splitURL[0] && splitURL[1]) {\n      all_ids.push(splitURL[1]);\n    }\n\n    if (!isStartWithHash && localize.page_permalink === thisURL) {\n      $this.addClass('eael-item-active');\n    }\n  });\n  $(window).on('load resize scroll', function () {\n    if (all_ids.length > 0) {\n      $.each(all_ids, function (index, item) {\n        if ($('#' + item).isInViewport()) {\n          $('a[href=\"' + localize.page_permalink + '#' + item + '\"]', $scope).addClass('eael-menu-' + item + ' eael-item-active');\n        } else {\n          $('.eael-menu-' + item).removeClass('eael-menu-' + item + ' eael-item-active');\n        }\n      });\n    }\n  });\n\n  if ($horizontal) {\n    // insert indicator\n    if ($indicator_icon == 'svg') {\n      $('.eael-simple-menu > li.menu-item-has-children', $scope).each(function () {\n        $('> a', $(this)).append('<span class=\"indicator-svg\">' + $indicator_class + '</span>');\n      });\n    } else {\n      $('.eael-simple-menu > li.menu-item-has-children', $scope).each(function () {\n        $('> a', $(this)).append('<span class=\"' + $indicator_class + '\"></span>');\n      });\n    }\n\n    if ($dropdown_indicator_icon == 'svg') {\n      $('.eael-simple-menu > li ul li.menu-item-has-children', $scope).each(function () {\n        $('> a', $(this)).append('<span class=\"dropdown-indicator-svg\">' + $dropdown_indicator_class + '</span>');\n      });\n    } else {\n      $('.eael-simple-menu > li ul li.menu-item-has-children', $scope).each(function () {\n        $('> a', $(this)).append('<span class=\"' + $dropdown_indicator_class + '\"></span>');\n      });\n    }\n  } // insert responsive menu toggle, text\n\n\n  $(selectorByType, $scope).before('<span class=\"eael-simple-menu-toggle-text\"></span>').after('<button class=\"eael-simple-menu-toggle\">' + $hamburger_icon + '<span class=\"eael-simple-menu-toggle-text\"></span></button>');\n  eael_menu_resize($hamburger_max_width); // responsive menu slide\n\n  $('.eael-simple-menu-container', $scope).on('click', '.eael-simple-menu-toggle', function (e) {\n    e.preventDefault();\n    var $siblings = $(this).siblings('nav').children(selectorByType);\n    $siblings.css('display') == 'none' ? $siblings.slideDown(300) : $siblings.slideUp(300);\n  }); // clear responsive props\n\n  $(window).on('resize load', function () {\n    eael_menu_resize($hamburger_max_width);\n  });\n\n  function eael_menu_resize() {\n    var max_width_value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n\n    if (window.matchMedia('(max-width: ' + max_width_value + 'px)').matches) {\n      $('.eael-simple-menu-container', $scope).addClass('eael-simple-menu-hamburger');\n      $(selectorByType, $scope).addClass('eael-simple-menu-responsive');\n      $('.eael-simple-menu-toggle-text', $scope).text($('.eael-simple-menu-horizontal .current-menu-item a', $scope).eq(0).text()); // Mobile Dropdown Breakpoints\n\n      $('.eael-simple-menu-container', $scope).closest('.elementor-widget-eael-simple-menu').removeClass('eael-hamburger--not-responsive').addClass('eael-hamburger--responsive');\n\n      if ($('.eael-simple-menu-container', $scope).hasClass('eael-simple-menu--stretch')) {\n        var css = {};\n\n        if (!$(selectorByType, $scope).parent().hasClass('eael-nav-menu-wrapper')) {\n          $(selectorByType, $scope).wrap('<nav class=\"eael-nav-menu-wrapper\"></nav>');\n        }\n\n        var $navMenu = $(\".eael-simple-menu-container nav\", $scope);\n        menu_size_reset($navMenu);\n        css.width = parseFloat($('.elementor').width()) + 'px';\n        css.left = -parseFloat($navMenu.offset().left) + 'px';\n        css.position = 'absolute';\n        $navMenu.css(css);\n      } else {\n        var _css = {};\n\n        if (!$(selectorByType, $scope).parent().hasClass('eael-nav-menu-wrapper')) {\n          $(selectorByType, $scope).wrap('<nav class=\"eael-nav-menu-wrapper\"></nav>');\n        }\n\n        var _$navMenu = $(\".eael-simple-menu-container nav\", $scope);\n\n        menu_size_reset(_$navMenu);\n        _css.width = '';\n        _css.left = '';\n        _css.position = 'inherit';\n\n        _$navMenu.css(_css);\n      }\n    } else {\n      $('.eael-simple-menu-container', $scope).removeClass('eael-simple-menu-hamburger');\n      $(selectorByType, $scope).removeClass('eael-simple-menu-responsive');\n      $(selectorByType + ', ' + selectorByType + ' ul', $scope).css('display', '');\n      $(\".eael-simple-menu-container nav\", $scope).removeAttr('style'); // Mobile Dropdown Breakpoints\n\n      $('.eael-simple-menu-container', $scope).closest('.elementor-widget-eael-simple-menu').removeClass('eael-hamburger--responsive').addClass('eael-hamburger--not-responsive');\n    }\n  }\n\n  function menu_size_reset(selector) {\n    var css = {};\n    css.width = '';\n    css.left = '';\n    css.position = 'inherit';\n    selector.css(css);\n  }\n\n  function getHamburgerMaxWidth($breakpoints, $device) {\n    var $max_width = 0;\n\n    if ($device === 'none' || typeof $device === 'undefined' || $device === '' || $device === null) {\n      return $max_width;\n    }\n\n    for (var $key in $breakpoints) {\n      if ($key == $device) {\n        $max_width = $breakpoints[$key];\n      }\n    } // fetch max width value from string like 'Mobile (> 767px)' to 767\n\n\n    $max_width = $max_width.replace(/[^0-9]/g, '');\n    return $max_width;\n  }\n\n  $('.eael-simple-menu > li.menu-item-has-children', $scope).each(function () {\n    // indicator position\n    if ($indicator_icon == 'svg') {\n      var $height = parseInt($('a', this).css('line-height')) / 2;\n      $(this).append('<span class=\"eael-simple-menu-indicator\"> ' + $indicator_class + '</span>');\n    } else {\n      var $height = parseInt($('a', this).css('line-height')) / 2;\n      $(this).append('<span class=\"eael-simple-menu-indicator ' + $indicator_class + '\"></span>');\n    } // if current, keep indicator open\n    // $(this).hasClass('current-menu-ancestor') ? $(this).addClass('eael-simple-menu-indicator-open') : ''\n\n  });\n  $('.eael-simple-menu > li ul li.menu-item-has-children', $scope).each(function (e) {\n    // indicator position\n    if ($dropdown_indicator_icon == 'svg') {\n      var $height = parseInt($('a', this).css('line-height')) / 2;\n      $(this).append('<span class=\"eael-simple-menu-indicator\"> ' + $dropdown_indicator_class + '</span>');\n    } else {\n      var $height = parseInt($('a', this).css('line-height')) / 2;\n      $(this).append('<span class=\"eael-simple-menu-indicator ' + $dropdown_indicator_class + '\"></span>');\n    } // if current, keep indicator open\n    // $(this).hasClass('current-menu-ancestor') ? $(this).addClass('eael-simple-menu-indicator-open') : ''\n\n  }); // menu indent\n\n  $('.eael-simple-menu-dropdown-align-left .eael-simple-menu-vertical li.menu-item-has-children').each(function () {\n    var $padding_left = parseInt($('a', $(this)).css('padding-left'));\n    $('ul li a', this).css({\n      'padding-left': $padding_left + 20 + 'px'\n    });\n  });\n  $('.eael-simple-menu-dropdown-align-right .eael-simple-menu-vertical li.menu-item-has-children').each(function () {\n    var $padding_right = parseInt($('a', $(this)).css('padding-right'));\n    $('ul li a', this).css({\n      'padding-right': $padding_right + 20 + 'px'\n    });\n  }); // menu dropdown toggle\n\n  $('.eael-simple-menu', $scope).on('click', '.eael-simple-menu-indicator', function (e) {\n    e.preventDefault();\n    $(this).toggleClass('eael-simple-menu-indicator-open');\n    $(this).hasClass('eael-simple-menu-indicator-open') ? $(this).siblings('ul').slideDown(300) : $(this).siblings('ul').slideUp(300);\n  }); // main menu toggle\n\n  $('.eael-simple-menu-container', $scope).on('click', '.eael-simple-menu-responsive li a', function (e) {\n    if ($(this).attr('href') !== '#') {\n      $(this).parents(selectorByType).slideUp(300);\n    }\n  });\n  $('.eael-simple-menu', $scope).on('click', 'a[href=\"#\"]', function (e) {\n    e.preventDefault();\n    $(this).siblings('.eael-simple-menu-indicator').click();\n  });\n\n  if (elementorFrontend.isEditMode()) {\n    elementor.channels.editor.on('change', function (view) {\n      var changed = view.elementSettingsModel.changed;\n\n      if (changed.eael_simple_menu_dropdown) {\n        var updated_max_width = getHamburgerMaxWidth($hamburger_breakpoints, changed.eael_simple_menu_dropdown);\n        eael_menu_resize(updated_max_width);\n        $hamburger_max_width = updated_max_width;\n      }\n    });\n  }\n};\n\njQuery(window).on('elementor/frontend/init', function () {\n  if (ea.elementStatusCheck('eaelSimpleMenu')) {\n    return false;\n  }\n\n  elementorFrontend.hooks.addAction('frontend/element_ready/eael-simple-menu.default', SimpleMenu);\n});\n\n//# sourceURL=webpack:///./src/js/view/simple-menu.js?");

/***/ })

/******/ });