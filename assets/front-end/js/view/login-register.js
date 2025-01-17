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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/view/login-register.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/view/login-register.js":
/*!***************************************!*\
  !*** ./src/js/view/login-register.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("ea.hooks.addAction(\"init\", \"ea\", function () {\n  var EALoginRegister = function EALoginRegister($scope, $) {\n    var $wrap = $scope.find('.eael-login-registration-wrapper'); // cache wrapper\n\n    var widgetId = $wrap.data('widget-id');\n    var recaptchaSiteKey = $wrap.data('recaptcha-sitekey');\n    var recaptchaSiteKeyV3 = $wrap.data('recaptcha-sitekey-v3');\n    var isProAndAjaxEnabled = typeof $wrap.data('is-ajax') !== 'undefined' && $wrap.data('is-ajax') == 'yes';\n    var loggedInLocation = $scope.find('[data-logged-in-location]').data('logged-in-location');\n    var $loginFormWrapper = $scope.find(\"#eael-login-form-wrapper\");\n    var $lostpasswordFormWrapper = $scope.find(\"#eael-lostpassword-form-wrapper\");\n    var $resetpasswordFormWrapper = $scope.find(\"#eael-resetpassword-form-wrapper\");\n    var loginRcTheme = $loginFormWrapper.data('recaptcha-theme');\n    var loginRcSize = $loginFormWrapper.data('recaptcha-size');\n    var $regFormWrapper = $scope.find(\"#eael-register-form-wrapper\");\n    var regRcTheme = $regFormWrapper.data('recaptcha-theme');\n    var regRcSize = $regFormWrapper.data('recaptcha-size');\n    var loginRecaptchaVersion = $wrap.data('login-recaptcha-version');\n    var registerRecaptchaVersion = $wrap.data('register-recaptcha-version');\n    var $regLinkAction = $scope.find('#eael-lr-reg-toggle');\n    var $loginLinkAction = $scope.find('#eael-lr-login-toggle');\n    var $lostpasswordLinkAction = $scope.find('#eael-lr-lostpassword-toggle');\n    var $lostpasswordLoginLinkAction = $scope.find('#eael-lr-login-toggle-lostpassword');\n    var $passField = $loginFormWrapper.find('#eael-user-password');\n    var $pass1Field = $resetpasswordFormWrapper.find('#eael-pass1');\n    var $pass2Field = $resetpasswordFormWrapper.find('#eael-pass2');\n    var recaptchaAvailable = typeof grecaptcha !== 'undefined' && grecaptcha !== null;\n    var params = new URLSearchParams(location.search);\n    var loginRecaptchaNode = document.getElementById('login-recaptcha-node-' + widgetId);\n    var registerRecaptchaNode = document.getElementById('register-recaptcha-node-' + widgetId);\n\n    if (loggedInLocation !== undefined && loggedInLocation !== '') {\n      location.replace(loggedInLocation);\n    }\n\n    if ('form' === $regLinkAction.data('action')) {\n      $regLinkAction.on('click', function (e) {\n        e.preventDefault();\n\n        if (params.has('eael-lostpassword')) {\n          params[\"delete\"]('eael-lostpassword');\n        }\n\n        if (!params.has('eael-register')) {\n          params.append('eael-register', 1);\n        }\n\n        window.history.replaceState({}, '', \"\".concat(location.pathname, \"?\").concat(params));\n        $loginFormWrapper.hide();\n        $lostpasswordFormWrapper.hide();\n        $regFormWrapper.fadeIn();\n      });\n    }\n\n    if ('form' === $loginLinkAction.data('action')) {\n      $loginLinkAction.on('click', function (e) {\n        if (params.has('eael-register')) {\n          params[\"delete\"]('eael-register');\n        } else if (params.has('eael-lostpassword')) {\n          params[\"delete\"]('eael-lostpassword');\n        }\n\n        window.history.replaceState({}, '', \"\".concat(location.pathname, \"?\").concat(params));\n        e.preventDefault();\n        $regFormWrapper.hide();\n        $lostpasswordFormWrapper.hide();\n        $loginFormWrapper.fadeIn();\n      });\n    }\n\n    if ('form' === $lostpasswordLoginLinkAction.data('action')) {\n      $lostpasswordLoginLinkAction.on('click', function (e) {\n        if (params.has('eael-register')) {\n          params[\"delete\"]('eael-register');\n        } else if (params.has('eael-lostpassword')) {\n          params[\"delete\"]('eael-lostpassword');\n        }\n\n        window.history.replaceState({}, '', \"\".concat(location.pathname, \"?\").concat(params));\n        e.preventDefault();\n        $lostpasswordFormWrapper.hide();\n        $regFormWrapper.hide();\n        $loginFormWrapper.fadeIn();\n      });\n    }\n\n    if ('form' === $lostpasswordLinkAction.data('action')) {\n      $lostpasswordLinkAction.on('click', function (e) {\n        e.preventDefault();\n\n        if (!params.has('eael-lostpassword')) {\n          params.append('eael-lostpassword', 1);\n        }\n\n        window.history.replaceState({}, '', \"\".concat(location.pathname, \"?\").concat(params));\n        $regFormWrapper.hide();\n        $loginFormWrapper.hide();\n        $lostpasswordFormWrapper.fadeIn();\n      });\n    } // Password Visibility Toggle\n\n\n    $(document).on('click', '#wp-hide-pw, #wp-hide-pw1, #wp-hide-pw2', function (e) {\n      var $buttonId = $(this).attr('id');\n\n      switch ($buttonId) {\n        case 'wp-hide-pw1':\n          togglePasswordVisibility($pass1Field);\n          togglePasswordVisibility($pass2Field);\n          break;\n\n        case 'wp-hide-pw2':\n          togglePasswordVisibility($pass2Field);\n          break;\n\n        default:\n          togglePasswordVisibility($passField);\n          break;\n      }\n    });\n\n    function togglePasswordVisibility($selector) {\n      var fieldType = $selector.attr('type') === 'text' ? 'password' : 'text';\n      $selector.attr('type', fieldType);\n      $icon = $selector.parent().find('span');\n\n      if (fieldType === 'password') {\n        $icon.removeClass('dashicons-hidden').addClass('dashicons-visibility');\n      } else {\n        $icon.removeClass('dashicons-visibility').addClass('dashicons-hidden');\n      }\n    }\n\n    $('form input[type=\"submit\"]', $scope).on('click', function (e) {\n      if (!isProAndAjaxEnabled) {\n        var isRecaptchaVersion3 = false;\n        isRecaptchaVersion3 = loginRecaptchaVersion === 'v3' || registerRecaptchaVersion === 'v3';\n\n        if (recaptchaAvailable && isRecaptchaVersion3) {\n          grecaptcha.execute(recaptchaSiteKeyV3, {\n            action: 'eael_login_register_form'\n          }).then(function (token) {\n            if ($('form input[name=\"g-recaptcha-response\"]', $scope).length === 0) {\n              $('form', $scope).append('<input type=\"hidden\" name=\"g-recaptcha-response\" value=\"' + token + '\">');\n            } else {\n              $('form input[name=\"g-recaptcha-response\"]', $scope).val(token);\n            }\n          });\n        }\n      }\n    });\n    $(document).ready(function () {\n      var eaelGetTokenPromise = new Promise(function (eaelGetTokenResolve, eaelGetTokenReject) {\n        ea.getToken();\n        var interval = setInterval(function () {\n          if (ea.noncegenerated === true && typeof localize.nonce !== 'undefined') {\n            eaelGetTokenResolve(localize.nonce);\n            clearInterval(interval);\n          }\n        }, 100);\n      });\n      eaelGetTokenPromise.then(function (updatedNonce) {\n        $('#eael-login-nonce, #eael-register-nonce, #eael-lostpassword-nonce, #eael-resetpassword-nonce').val(updatedNonce);\n      });\n    }); // reCAPTCHA\n\n    function onloadLRcb() {\n      if (typeof grecaptcha.render != \"function\") {\n        return false;\n      }\n\n      if (loginRecaptchaNode) {\n        if (registerRecaptchaVersion !== 'v3') {\n          try {\n            grecaptcha.render(loginRecaptchaNode, {\n              'sitekey': recaptchaSiteKey,\n              'theme': loginRcTheme,\n              'size': loginRcSize\n            });\n          } catch (error) {// duplicate instance\n          }\n        }\n      }\n\n      if (registerRecaptchaNode) {\n        if (loginRecaptchaVersion !== 'v3') {\n          try {\n            grecaptcha.render(registerRecaptchaNode, {\n              'sitekey': recaptchaSiteKey,\n              'theme': regRcTheme,\n              'size': regRcSize\n            });\n          } catch (error) {// duplicate instance\n          }\n        }\n      }\n    }\n\n    if (recaptchaAvailable && isEditMode) {\n      // on elementor editor, window load event already fired, so run recaptcha\n      onloadLRcb();\n    } else {\n      // on frontend, load even is yet to fire, so wait and fire recaptcha\n      var navData = window.performance.getEntriesByType(\"navigation\");\n\n      if (navData.length > 0 && navData[0].loadEventEnd > 0) {\n        if (recaptchaAvailable) {\n          onloadLRcb();\n        }\n      } else {\n        $(window).on('load', function () {\n          if (recaptchaAvailable) {\n            onloadLRcb();\n          }\n        });\n      }\n    }\n  };\n\n  elementorFrontend.hooks.addAction(\"frontend/element_ready/eael-login-register.default\", EALoginRegister);\n});\n\n//# sourceURL=webpack:///./src/js/view/login-register.js?");

/***/ })

/******/ });