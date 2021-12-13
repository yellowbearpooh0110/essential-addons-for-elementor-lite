ea.hooks.addAction("init", "ea", () => {
	elementorFrontend.hooks.addAction(
		"frontend/element_ready/eael-adv-accordion.default",
		function ($scope, $) {
			let hashTag = window.location.hash.substr(1);
			let hashTagExists = false;
			var $advanceAccordion = $scope.find(".eael-adv-accordion"),
				$accordionHeader = $scope.find(".eael-accordion-header"),
				$accordionType = $advanceAccordion.data("accordion-type"),
				$accordionSpeed = $advanceAccordion.data("toogle-speed");
			
			// Open default actived tab
			if (hashTag) {
				$accordionHeader.each(function () {
					if ($(this).attr("id") == hashTag) {
						hashTagExists = true;
						
						$(this).addClass("show active");
						$(this).next().slideDown($accordionSpeed);
					}
				});
			}
			
			if (hashTagExists === false) {
				$accordionHeader.each(function () {
					if ($(this).hasClass("active-default")) {
						$(this).addClass("show active");
						$(this).next().slideDown($accordionSpeed);
					}
				});
			}
			
			// Remove multiple click event for nested accordion
			$accordionHeader.unbind("click");
			
			$accordionHeader.click(function (e) {
				e.preventDefault();
				
				var $this = $(this),
				$contentNext = $this.next();
				
				if ($accordionType === "accordion") {
					if ($this.hasClass("show")) {
						$this.removeClass("show active");
						$this.next().slideUp($accordionSpeed);
					} else {
						$this
						.parent()
						.parent()
						.find(".eael-accordion-header")
						.removeClass("show active");
						$this
						.parent()
						.parent()
						.find(".eael-accordion-content")
						.slideUp($accordionSpeed);
						$this.toggleClass("show active");
						$this.next().slideToggle($accordionSpeed);
					}
				} else {
					// For acccordion type 'toggle'
					if ($this.hasClass("show")) {
						$this.removeClass("show active");
						$this.next().slideUp($accordionSpeed);
					} else {
						$this.addClass("show active");
						$this.next().slideDown($accordionSpeed);
					}
				}
				ea.hooks.doAction("ea-advanced-accordion-triggered", $contentNext);
				ea.hooks.doAction("widgets.reinit",$this.parent());
			});
		}
	);
});
