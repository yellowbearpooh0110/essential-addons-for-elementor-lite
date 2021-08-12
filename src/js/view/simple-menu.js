var SimpleMenu = function ($scope, $) {
    var $indicator_class = $('.eael-simple-menu-container', $scope).data(
        'indicator-class'
    )
    var $indicator_icon = $('.eael-simple-menu-container', $scope).data('indicator')
    var $dropdown_indicator_icon = $('.eael-simple-menu-container', $scope).data('dropdown-indicator')

    var $dropdown_indicator_class = $(
        '.eael-simple-menu-container',
        $scope
    ).data('dropdown-indicator-class')
    var $horizontal = $('.eael-simple-menu', $scope).hasClass(
        'eael-simple-menu-horizontal'
    )
    
    var $fullWidth = $('.eael-simple-menu--stretch');
    
    if ($horizontal) {
        // insert indicator
        if($indicator_icon == 'svg') {
            $('.eael-simple-menu > li.menu-item-has-children', $scope).each(
                function () {
                    $('> a', $(this)).append(
                        '<span class="indicator-svg">' + $indicator_class + '</span>'
                    )
                }
            )
        } else {
            $('.eael-simple-menu > li.menu-item-has-children', $scope).each(
                function () {
                    $('> a', $(this)).append(
                        '<span class="' + $indicator_class + '"></span>'
                    )
                }
            )
        }

        if($dropdown_indicator_icon == 'svg') {
            $('.eael-simple-menu > li ul li.menu-item-has-children', $scope).each(
                function () {
                    $('> a', $(this)).append(
                        '<span class="dropdown-indicator-svg">' + $dropdown_indicator_class + '</span>'
                    )
                }
            )
        }else {
            $('.eael-simple-menu > li ul li.menu-item-has-children', $scope).each(
                function () {
                    $('> a', $(this)).append(
                        '<span class="' + $dropdown_indicator_class + '"></span>'
                    )
                }
            )
        }

        // insert responsive menu toggle, text
        $('.eael-simple-menu-horizontal', $scope)
            .before('<span class="eael-simple-menu-toggle-text"></span>')
            .after(
                '<button class="eael-simple-menu-toggle"><span class="eicon-menu-bar"></span></button>'
            )
        eael_menu_resize();
        
        // responsive menu slide
        $('.eael-simple-menu-container', $scope).on(
            'click',
            '.eael-simple-menu-toggle',
            function (e) {
                e.preventDefault();
                const $siblings = $(this).siblings('nav').children('.eael-simple-menu-horizontal');
                $siblings.css('display') == 'none'
                    ? $siblings.slideDown(300)
                    : $siblings.slideUp(300)
            }
        )

        // clear responsive props
        $(window).on('resize load', function () {
            eael_menu_resize();
        })
    }
    
    function eael_menu_resize(){
        if (window.matchMedia('(max-width: 991px)').matches) {
            $('.eael-simple-menu-container', $scope).addClass(
                'eael-simple-menu-hamburger'
            )
            $('.eael-simple-menu-horizontal', $scope).addClass(
                'eael-simple-menu-responsive'
            )
            $('.eael-simple-menu-toggle-text', $scope).text(
                $(
                    '.eael-simple-menu-horizontal .current-menu-item a',
                    $scope
                )
                .eq(0)
                .text()
            )

            if ($('.eael-simple-menu-container', $scope).hasClass('eael-simple-menu--stretch')){
                const css = {}
                if(!$('.eael-simple-menu-horizontal', $scope).parent().hasClass('eael-nav-menu-wrapper')){
                    $('.eael-simple-menu-horizontal', $scope).wrap('<nav class="eael-nav-menu-wrapper"></nav>');
                }
                const $navMenu = $(".eael-simple-menu-container nav",$scope);
                menu_size_reset($navMenu);

                css.width = parseFloat($('.elementor').width()) + 'px';
                css.left = -parseFloat($navMenu.offset().left) + 'px';
                css.position = 'absolute';

                $navMenu.css(css);
            } else {
                const css = {}
                if(!$('.eael-simple-menu-horizontal', $scope).parent().hasClass('eael-nav-menu-wrapper')){
                    $('.eael-simple-menu-horizontal', $scope).wrap('<nav class="eael-nav-menu-wrapper"></nav>');
                }
                const $navMenu = $(".eael-simple-menu-container nav",$scope);
                menu_size_reset($navMenu);

                css.width = '';
                css.left = '';
                css.position = 'inherit';

                $navMenu.css(css);
            }
        } else {
            $('.eael-simple-menu-container', $scope).removeClass(
                'eael-simple-menu-hamburger'
            )
            $('.eael-simple-menu-horizontal', $scope).removeClass(
                'eael-simple-menu-responsive'
            )
            $(
                '.eael-simple-menu-horizontal, .eael-simple-menu-horizontal ul',
                $scope
            ).css('display', '')
            $(".eael-simple-menu-container nav",$scope).removeAttr( 'style' );
        }
    }

    function menu_size_reset(selector){
        const css = {};
        css.width = '';
        css.left = '';
        css.position = 'inherit';
        selector.css(css);
    }

    $('.eael-simple-menu > li.menu-item-has-children', $scope).each(
        function () {
            // indicator position

            if($indicator_icon == 'svg') {
                var $height = parseInt($('a', this).css('line-height')) / 2
                $(this).append(
                    '<span class="eael-simple-menu-indicator"> ' +
                    $indicator_class +
                    '</span>'
                )
            } else {
                var $height = parseInt($('a', this).css('line-height')) / 2
                $(this).append(
                    '<span class="eael-simple-menu-indicator ' +
                    $indicator_class +
                    '"></span>'
                )
            }

            // if current, keep indicator open
            // $(this).hasClass('current-menu-ancestor') ? $(this).addClass('eael-simple-menu-indicator-open') : ''
        }
    )

    $('.eael-simple-menu > li ul li.menu-item-has-children', $scope).each(
        function (e) {
            // indicator position
            if($dropdown_indicator_icon == 'svg') {
                var $height = parseInt($('a', this).css('line-height')) / 2
                $(this).append(
                    '<span class="eael-simple-menu-indicator"> ' +
                    $dropdown_indicator_class +
                    '</span>'
                )
            } else {
                var $height = parseInt($('a', this).css('line-height')) / 2
                $(this).append(
                    '<span class="eael-simple-menu-indicator ' +
                    $dropdown_indicator_class +
                    '"></span>'
                )
            }


            // if current, keep indicator open
            // $(this).hasClass('current-menu-ancestor') ? $(this).addClass('eael-simple-menu-indicator-open') : ''
        }
    )

    // menu indent
    $(
        '.eael-simple-menu-dropdown-align-left .eael-simple-menu-vertical li.menu-item-has-children'
    ).each(function () {
        var $padding_left = parseInt($('a', $(this)).css('padding-left'))

        $('ul li a', this).css({
            'padding-left': $padding_left + 20 + 'px',
        })
    })

    $(
        '.eael-simple-menu-dropdown-align-right .eael-simple-menu-vertical li.menu-item-has-children'
    ).each(function () {
        var $padding_right = parseInt($('a', $(this)).css('padding-right'))

        $('ul li a', this).css({
            'padding-right': $padding_right + 20 + 'px',
        })
    })

    // menu dropdown toggle
    $('.eael-simple-menu', $scope).on(
        'click',
        '.eael-simple-menu-indicator',
        function (e) {
            e.preventDefault()
            $(this).toggleClass('eael-simple-menu-indicator-open')
            $(this).hasClass('eael-simple-menu-indicator-open')
                ? $(this).siblings('ul').slideDown(300)
                : $(this).siblings('ul').slideUp(300)
        }
    )
    // main menu toggle
    $('.eael-simple-menu-container', $scope).on(
        'click',
        '.eael-simple-menu-responsive li a',
        function (e) {
            $(this).parents('.eael-simple-menu-horizontal').slideUp(300)
        }
    )
}

jQuery(window).on('elementor/frontend/init', function () {
    elementorFrontend.hooks.addAction(
        'frontend/element_ready/eael-simple-menu.default',
        SimpleMenu
    )
})
