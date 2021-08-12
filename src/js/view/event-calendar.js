var EventCalendar = function ($scope, $) {
  var Calendar = FullCalendar.Calendar;
  var element = $(".eael-event-calendar-cls", $scope),
    CloseButton = $(".eaelec-modal-close", $scope).eq(0),
    ecModal = $("#eaelecModal", $scope),
    eventAll = element.data("events"),
    firstDay = element.data("first_day"),
    calendarID = element.data("cal_id"),
    locale = element.data("locale"),
    translate = element.data("translate"),
    defaultView = element.data("defaultview"),
    time_format = element.data("time_format") == "yes" ? true : false,
    calendarEl = document.getElementById("eael-event-calendar-" + calendarID);

  var calendar = new Calendar(calendarEl, {
    plugins: ["dayGrid", "timeGrid", "list"],
    editable: false,
    selectable: false,
    draggable: false,
    firstDay: firstDay,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !time_format,
    },
    nextDayThreshold: "00:00:00",
    header: {
      left: "prev,next today",
      center: "title",
      right: "timeGridDay,timeGridWeek,dayGridMonth,listMonth",
    },
    events: eventAll,
    selectHelper: true,
    locale: locale,
    eventLimit: 3,
    defaultView: defaultView,
    eventRender: function (info) {
      var element = $(info.el),
        event = info.event;
      moment.locale(locale);
      // when event is finished event text are cross
      if (
        event.extendedProps.eventHasComplete !== undefined &&
        event.extendedProps.eventHasComplete === "yes"
      ) {
        element
          .find("div.fc-content .fc-title")
          .addClass("eael-event-completed");
        element.find("td.fc-list-item-title").addClass("eael-event-completed");
      }
      translate.today =
        info.event._calendar.dateEnv.locale.options.buttonText.today;
      element.attr("href", "javascript:void(0);");
      element.click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var startDate = event.start,
          timeFormate = time_format ? "H:mm" : "h:mm A",
          endDate = event.end,
          startSelector = $("span.eaelec-event-date-start"),
          endSelector = $("span.eaelec-event-date-end");

        if (event.allDay === "yes") {
          var newEnd = moment(endDate).subtract(1, "days");
          endDate = newEnd._d;
          timeFormate = " ";
        }

        var startYear = moment(startDate).format("YYYY"),
          endYear = moment(endDate).format("YYYY"),
          yearDiff = endYear > startYear,
          startView = "",
          endView = "";

        startSelector.html(" ");
        endSelector.html(" ");
        ecModal
          .addClass("eael-ec-popup-ready")
          .removeClass("eael-ec-modal-removing");

        if (
          event.allDay === "yes" &&
          moment(startDate).format("MM-DD-YYYY") ===
            moment(endDate).format("MM-DD-YYYY")
        ) {
          startView = moment(startDate).format("MMM Do");
          if (moment(startDate).isSame(Date.now(), "day") === true) {
            startView = translate.today;
          } else if (
            moment(startDate).format("MM-DD-YYYY") ===
            moment(new Date()).add(1, "days").format("MM-DD-YYYY")
          ) {
            startView = translate.tomorrow;
          }
        } else {
          if (moment(event.start).isSame(Date.now(), "day") === true) {
            startView =
              translate.today + " " + moment(event.start).format(timeFormate);
          }
          if (
            moment(startDate).format("MM-DD-YYYY") ===
            moment(new Date()).add(1, "days").format("MM-DD-YYYY")
          ) {
            startView =
              translate.tomorrow +
              " " +
              moment(event.start).format(timeFormate);
          }

          if (
            moment(startDate).format("MM-DD-YYYY") <
              moment(new Date()).format("MM-DD-YYYY") ||
            moment(startDate).format("MM-DD-YYYY") >
              moment(new Date()).add(1, "days").format("MM-DD-YYYY")
          ) {
            startView = moment(event.start).format("MMM Do " + timeFormate);
          }

          startView = yearDiff ? startYear + " " + startView : startView;

          if (moment(endDate).isSame(Date.now(), "day") === true) {
            if (moment(startDate).isSame(Date.now(), "day") !== true) {
              endView =
                translate.today + " " + moment(endDate).format(timeFormate);
            } else {
              endView = moment(endDate).format(timeFormate);
            }
          }

          if (
            moment(startDate).format("MM-DD-YYYY") !==
              moment(new Date()).add(1, "days").format("MM-DD-YYYY") &&
            moment(endDate).format("MM-DD-YYYY") ===
              moment(new Date()).add(1, "days").format("MM-DD-YYYY")
          ) {
            endView =
              translate.tomorrow + " " + moment(endDate).format(timeFormate);
          }
          if (
            moment(startDate).format("MM-DD-YYYY") ===
              moment(new Date()).add(1, "days").format("MM-DD-YYYY") &&
            moment(endDate).format("MM-DD-YYYY") ===
              moment(new Date()).add(1, "days").format("MM-DD-YYYY")
          ) {
            endView = moment(endDate).format(timeFormate);
          }
          if (
            moment(endDate).diff(moment(startDate), "days") > 0 &&
            endSelector.text().trim().length < 1
          ) {
            endView = moment(endDate).format("MMM Do " + timeFormate);
          }

          if (
            moment(startDate).format("MM-DD-YYYY") ===
            moment(endDate).format("MM-DD-YYYY")
          ) {
            endView = moment(endDate).format(timeFormate);
          }

          endView = yearDiff ? endYear + " " + endView : endView;
        }

        if (
          event.extendedProps.hideEndDate !== undefined &&
          event.extendedProps.hideEndDate === "yes"
        ) {
          endSelector.html(" ");
        } else {
          endSelector.html(endView != "" ? "- " + endView : "");
        }
        startSelector.html('<i class="eicon-calendar"></i> ' + startView);

        $(".eaelec-modal-header h2").html(event.title);
        $(".eaelec-modal-body p").html(event.extendedProps.description);
        if (event.extendedProps.description.length < 1) {
          $(".eaelec-modal-body").css("height", "auto");
        } else {
          $(".eaelec-modal-body").css("height", "300px");
        }

        $(".eaelec-modal-footer a").attr("href", event.url);

        if (event.extendedProps.external === "on") {
          $(".eaelec-modal-footer a").attr("target", "_blank");
        }
        if (event.extendedProps.nofollow === "on") {
          $(".eaelec-modal-footer a").attr("rel", "nofollow");
        }
        if (event.url == "") {
          $(".eaelec-modal-footer a").css("display", "none");
        }
  
        const motionCheck = $(document).find(".elementor-motion-effects-element #eaelecModal.eael-ec-popup-ready")
  
        if (motionCheck.length > 0) {
          let transform = motionCheck.closest(".elementor-motion-effects-element");
          if (transform.css("--translateY") != undefined) {
            transform.css("transform", "none");
          }
        }
        // Popup color
        $(".eaelec-modal-header").css(
          "border-left",
          "5px solid " + event.borderColor
        );
      });
    },
  });

  CloseButton.on("click", function () {
    event.stopPropagation();
    eael_remove_popup(ecModal)
  });

  $(document).on("click", function (event) {
    if (event.target.closest(".eaelec-modal-content")) return;
    if (ecModal.hasClass("eael-ec-popup-ready")) {
      eael_remove_popup(ecModal)
    }
  });
  
  function eael_remove_popup(ecModal) {
    ecModal
    .addClass("eael-ec-modal-removing")
    .removeClass("eael-ec-popup-ready");
    const motionCheck = $(document).find(".elementor-motion-effects-element #eaelecModal.eael-ec-modal-removing")
    
    if (motionCheck.length > 0) {
      let transform = motionCheck.closest(".elementor-motion-effects-element");
      if (transform.css("--translateY") != undefined) {
        transform.css("transform", "translateY(var(--translateY))");
      }
    }
  }

  calendar.render();
};

jQuery(window).on("elementor/frontend/init", function () {
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/eael-event-calendar.default",
    EventCalendar
  );
});
