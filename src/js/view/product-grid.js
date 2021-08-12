ea.hooks.addAction("init", "ea", () => {
	const productGrid = function ($scope, $) {
		const $wrap = $scope.find("#eael-product-grid"); // cache wrapper
		const widgetId = $wrap.data("widget-id");
		const pageId = $wrap.data("page-id");
		const nonce = $wrap.data("nonce");
		const overlay = document.createElement("div");
		overlay.classList.add("wcpc-overlay");
		overlay.setAttribute("id", "wcpc-overlay");
		const body = document.getElementsByTagName("body")[0];
		body.appendChild(overlay);
		const overlayNode = document.getElementById("wcpc-overlay");
		const $doc = $(document);
		let loader = false;
		let compareBtn = false;
		let hasCompareIcon = false;
		let compareBtnSpan = false;
		let requestType = false; // compare | remove
		let iconBeforeCompare = '<i class="fas fa-exchange-alt"></i>';
		let iconAfterCompare = '<i class="fas fa-check-circle"></i>';
		const modalTemplate = `
        <div class="eael-wcpc-modal">
            <i title="Close" class="close-modal far fa-times-circle"></i>
            <div class="modal__content" id="eael_modal_content">
            </div>
        </div>
        `;
		$(body).append(modalTemplate);
		const $modalContentWraper = $("#eael_modal_content");
		const modal = document.getElementsByClassName("eael-wcpc-modal")[0];
		const ajaxData = [
			{
				name: "action",
				value: "eael_product_grid",
			},
			{
				name: "widget_id",
				value: widgetId,
			},
			{
				name: "page_id",
				value: pageId,
			},
			{
				name: "nonce",
				value: nonce,
			},
		];
		const sendData = function sendData(
			ajaxData,
			successCb,
			errorCb,
			beforeCb,
			completeCb
		) {
			$.ajax({
				url: localize.ajaxurl,
				type: "POST",
				dataType: "json",
				data: ajaxData,
				beforeSend: beforeCb,
				success: successCb,
				error: errorCb,
				complete: completeCb,
			});
		};

		$doc.on("click", ".eael-wc-compare", function (e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			requestType = "compare";
			compareBtn = $(this);
			compareBtnSpan = compareBtn.find(".eael-wc-compare-text");
			if (!compareBtnSpan.length) {
				hasCompareIcon = compareBtn.hasClass("eael-wc-compare-icon");
			}
			if (!hasCompareIcon) {
				loader = compareBtn.find(".eael-wc-compare-loader");
				loader.show();
			}
			let product_id = compareBtn.data("product-id");
			let oldProductIds = localStorage.getItem('productIds');
			if (oldProductIds){
				oldProductIds = JSON.parse(oldProductIds);
				oldProductIds.push(product_id);
			}else {
				oldProductIds = [product_id]
			}

			ajaxData.push({
				name: "product_id",
				value: compareBtn.data("product-id"),
			});
			ajaxData.push({
				name: "product_ids",
				value: JSON.stringify(oldProductIds),
			});
			sendData(ajaxData, handleSuccess, handleError);
		});

		$doc.on("click", ".close-modal", function (e) {
			modal.style.visibility = "hidden";
			modal.style.opacity = "0";
			overlayNode.style.visibility = "hidden";
			overlayNode.style.opacity = "0";
		});
		$doc.on("click", ".eael-wc-remove", function (e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			let $rBtn = $(this);
			let productId = $rBtn.data("product-id");
			$rBtn.addClass("disable");
			$rBtn.prop("disabled", true); // prevent additional ajax request
			let oldProductIds = localStorage.getItem('productIds');
			if (oldProductIds){
				oldProductIds = JSON.parse(oldProductIds);
				oldProductIds.push(productId);
			}else {
				oldProductIds = [productId]
			}
			const rmData = Array.from(ajaxData);
			rmData.push({
				name: "product_id",
				value: productId,
			});
			rmData.push({
				name: "remove_product",
				value: 1,
			});
			rmData.push({
				name: "product_ids",
				value: JSON.stringify(oldProductIds),
			});

			requestType = "remove";
			let compareBtn = $('button[data-product-id="' + productId + '"]');
			compareBtnSpan = compareBtn.find(".eael-wc-compare-text");
			if (!compareBtnSpan.length) {
				hasCompareIcon = compareBtn.hasClass("eael-wc-compare-icon");
			}
			sendData(rmData, handleSuccess, handleError);
		});

		function handleSuccess(data) {
			const success = data && data.success;
			if (success) {
				$modalContentWraper.html(data.data.compare_table);
				modal.style.visibility = "visible";
				modal.style.opacity = "1";
				overlayNode.style.visibility = "visible";
				overlayNode.style.opacity = "1";
				localStorage.setItem('productIds', JSON.stringify(data.data.product_ids));

			}
			if (loader) {
				loader.hide();
			}

			if ("compare" === requestType) {
				if (compareBtnSpan && compareBtnSpan.length) {
					compareBtnSpan.text(localize.i18n.added);
				} else if (hasCompareIcon) {
					compareBtn.html(iconAfterCompare);
				}
			}
			if ("remove" === requestType) {
				if (compareBtnSpan && compareBtnSpan.length) {
					compareBtnSpan.text(localize.i18n.compare);
				} else if (hasCompareIcon) {
					compareBtn.html(iconBeforeCompare);
				}
			}
		}

		function handleError(xhr, err) {
			console.log(err.toString());
		}

		// pagination
		$(".eael-woo-pagination", $scope).on("click", "a", function (e) {
			e.preventDefault();

			var $this = $(this),
				nth = $this.data("pnumber"),
				lmt = $this.data("plimit"),
				ajax_url = localize.ajaxurl,
				args = $this.data("args"),
				settings = $this.data("settings"),
				widgetid = $this.data("widgetid"),
				widgetclass = ".elementor-element-" + widgetid,
				template_info = $this.data("template");

			$.ajax({
				url: ajax_url,
				type: "post",
				data: {
					action: "woo_product_pagination_product",
					number: nth,
					limit: lmt,
					args: args,
					templateInfo: template_info,
					settings: settings,
				},
				beforeSend: function () {
					$(widgetclass).addClass("eael-product-loader");
				},
				success: function (response) {
					$(widgetclass + " .eael-product-grid .products").html(response);
					$(widgetclass + " .woocommerce-product-gallery").each(function () {
						$(this).wc_product_gallery();
					});

					$('html, body').animate({
						scrollTop: $(widgetclass + " .eael-product-grid").offset().top - 50
					}, 500);

				},
				complete: function () {
					$(widgetclass).removeClass("eael-product-loader");
				},
			});

			$.ajax({
				url: ajax_url,
				type: "post",
				data: {
					action: "woo_product_pagination",
					number: nth,
					limit: lmt,
					args: args,
					settings: settings,
				},
				// beforeSend	: function(){
				// 	$(widgetclass+" .eael-product-grid .products").html("<li style='text-align:center;'>Loading please " +
				// 		"wait...!</li>");
				// },
				success: function (response) {
					$(widgetclass + " .eael-product-grid .eael-woo-pagination").html(
						response
					);

					$('html, body').animate({
						scrollTop: $(widgetclass + " .eael-product-grid").offset().top - 50
					}, 500);
				},
			});
		});

		$scope.on("click", ".eael-product-grid-open-popup", function (e) {
			e.preventDefault();
			e.stopPropagation();
			const $this = $(this);
			const quickview_setting = $this.data('quickview-setting');
			const popup_view = $(".eael-woocommerce-popup-view");
			popup_view.find(".eael-popup-details-render").html('<div class="eael-preloader"></div>')
			popup_view
			.addClass("eael-product-popup-ready")
			.removeClass("eael-product-modal-removing");
			popup_view.show();
			$.ajax({
					   url: localize.ajaxurl,
					   type: "post",
					   data: {
						   action: "eael_product_quickview_popup",
						   ...quickview_setting,
						   security: localize.nonce
					   },
					   success: function (response) {
						   if (response.success) {
							   const product_preview = $(response.data);
							   const popup_details = product_preview.children(".eael-product-popup-details");

							   popup_details.find(".variations_form").wc_variation_form()
							   const popup_view_render = popup_view.find(".eael-popup-details-render");

							   popup_view.find(".eael-popup-details-render").html(popup_details);
							   const product_gallery = popup_view.find(".woocommerce-product-gallery");
							   product_gallery.css("opacity",1);
							   popup_view_render.addClass("elementor-" + quickview_setting.page_id)
							   popup_view_render.children().addClass("elementor-element elementor-element-" + quickview_setting.widget_id)

							   if (popup_details.height() > 400) {
								   popup_details.css("height", "75vh");
							   } else {
								   popup_details.css("height", "auto");
							   }
							   setTimeout(function(){ product_gallery.wc_product_gallery(); }, 1000);
						   }
					   },
				   });
		});

		$(document).on(
			"keypress",
			".eael-product-details-wrap input[type=number]",
			(e) => {
				let keyValue = e.keyCode || e.which;
				let regex = /^[0-9]+$/;
				let isValid = regex.test(String.fromCharCode(keyValue));
				if (!isValid) {
					return false;
				}
				return isValid;
			}
		);

		// handle add to cart for quick view
		$(document).on(
			"click",
			".eael-woo-slider-popup .single_add_to_cart_button",
			function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var $this = $(this),
					product_id = $(this).val(),
					variation_id =
						$this
							.closest("form.cart")
							.find('input[name="variation_id"]')
							.val() || "",
					quantity = $this
						.closest("form.cart")
						.find('input[name="quantity"]')
						.val(),
					items = $this.closest("form.cart.grouped_form"),
					form = $this.closest("form.cart"),
					product_data = [];
				    items = items.serializeArray();

				if (form.hasClass("variations_form")) {
					product_id = form.find('input[name="product_id"]').val();
				}

				if (items.length > 0) {
					items.forEach((item, index) => {
						var p_id = parseInt(item.name.replace(/[^\d.]/g, ""), 10);
						if (
							item.name.indexOf("quantity[") >= 0 &&
							item.value != "" &&
							p_id > 0
						) {
							product_data[product_data.length] = {
								product_id: p_id,
								quantity: item.value,
								variation_id: 0,
							};
						}
					});
				} else {
					product_data[0] = {
						product_id: product_id,
						quantity: quantity,
						variation_id: variation_id,
					};
				}
				$this.removeClass("eael-addtocart-added");
				$this.addClass("eael-addtocart-loading");
				$.ajax({
					url: localize.ajaxurl,
					type: "post",
					data: {
						action: "eael_product_add_to_cart",
						product_data: product_data,
						eael_add_to_cart_nonce: localize.nonce,
						cart_item_data: form.serializeArray(),
					},
					success: function (response) {
						if (response.success) {
							$(document.body).trigger("wc_fragment_refresh");
							$this.removeClass("eael-addtocart-loading");
							$this.addClass("eael-addtocart-added");
						}
					},
				});
			}
		);
        
		$(document).on("click", ".eael-product-popup-close", function (event) {
			event.stopPropagation();
			$(".eael-product-popup")
				.addClass("eael-product-modal-removing")
				.removeClass("eael-product-popup-ready");
		});
		$(document).on("click", function (event) {
			if (event.target.closest(".eael-product-popup-details")) return;
			$(".eael-product-popup.eael-product-zoom-in.eael-product-popup-ready")
				.addClass("eael-product-modal-removing")
				.removeClass("eael-product-popup-ready");
		});

		if (isEditMode) {
			$(".eael-product-image-wrap .woocommerce-product-gallery").css(
				"opacity",
				"1"
			);
		}
	};
	elementorFrontend.hooks.addAction(
		"frontend/element_ready/eicon-woocommerce.default",
		productGrid
	);
});
