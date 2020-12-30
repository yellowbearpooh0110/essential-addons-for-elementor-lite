<?php
namespace Essential_Addons_Elementor\Traits;

if (!defined('ABSPATH')) {
    exit();
}
// Exit if accessed directly

use Essential_Addons_Elementor\Classes\WPDeveloper_Notice;

trait Admin
{
    /**
     * Create an admin menu.
     *
     * @since 1.1.2
     */
    public function admin_menu()
    {
        $setup_wizard = new \Essential_Addons_Elementor\Classes\WPDeveloper_Setup_Wizard();
        add_menu_page(
            __('Essential Addons', 'essential-addons-for-elementor-lite'),
            __('Essential Addons', 'essential-addons-for-elementor-lite'),
            'manage_options',
            'eael-settings',
            [$setup_wizard, 'render_wizard'],
            $this->safe_url(EAEL_PLUGIN_URL . 'assets/admin/images/ea-icon-white.svg'),
            '58.6'
        );
        $plugins = \get_option('active_plugins');
        if (!in_array('templately/templately.php', $plugins)) {
            add_submenu_page(
                'eael-settings',
                __('Templates Cloud', 'essential-addons-for-elementor-lite'),
                __('Templates Cloud', 'essential-addons-for-elementor-lite'),
                'manage_options',
                'template-cloud',
                [$this, 'templately_page']
            );
        }
    }
    /**
     * Template Page Outputs
     *
     * @return void
     */
    public function templately_page()
    {
        $plugin_name = basename(EAEL_PLUGIN_BASENAME, '.php');
        $button_text = __('Install Templately', 'essential-addons-for-elementor-lite');
        if (!function_exists('get_plugins')) {
            include ABSPATH . '/wp-admin/includes/plugin.php';
        }
        $plugins = \get_plugins();
        $installed = false;
        if (isset($plugins['templately/templately.php'])) {
            $installed = true;
            $button_text = __('Activate Templately', 'essential-addons-for-elementor-lite');
        }

        ?>
            <div class="wrap">
                <hr class="wp-header-end">
                <div class="template-cloud">
                    <div class="template-cloud-header">
                        <svg width="200" enable-background="new 0 0 200 50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><circle cx="5.5" cy="44.1" fill="#ffb45a" r="5.5"/><circle cx="21.6" cy="44.1" fill="#ff7b8e" r="5.5"/><circle cx="37.6" cy="44.1" fill="#5ac0ff" r="5.5"/><path d="m31.3 9.3c-.3 0-.6 0-.9 0-1.2-5.3-5.9-9.2-11.5-9.2-1.5 0-2.9.3-4.2.8v3.9h5.7v5.6c-1.9 0-3.8 0-5.7 0v9.5h5.9c-.2.4-.4 1-.5 1.3-1.1 2.6-3.7 4-6.5 3.5-2.6-.5-4.5-2.7-4.7-5.5 0-.8 0-1.6 0-2.4 0-1.2 0-5.2 0-6.5-.7 0-1.3 0-2 0-4 1.9-6.9 6-6.9 10.7 0 6.5 5.3 11.8 11.8 11.8h19.6c6.5-.1 11.7-5.3 11.7-11.8 0-6.4-5.3-11.7-11.8-11.7z" fill="#5633d1"/><g fill="#424c5e"><path d="m64.6 29.5c-1.2 0-1.9-.7-1.9-2.1v-7h3.4v-3.1h-3.8l-.6-3h-2.9v14.2c0 2.8 1.3 4.1 3.8 4.1h3.4v-3.1z"/><path d="m75.3 17.3c-4.8 0-7.2 2.5-7.2 7.5 0 5.2 2.8 7.8 8.3 7.8 1.9 0 3.6-.1 4.9-.4v-3.1c-1.5.3-3.1.4-4.6.4-3.2 0-4.8-1.1-4.8-3.2h10.2c.1-.6.1-1.3.1-1.9.1-4.7-2.3-7.1-6.9-7.1zm-3.3 6.3c.2-2.2 1.3-3.3 3.3-3.3 2.1 0 3.2 1.1 3.2 3.2v.1z"/><path d="m102.4 17.3c-1.7 0-3.3.7-4.9 2.1-.7-1.4-2-2.1-4-2.1-1.9 0-3.6.7-4.9 2.2l-.5-2.2h-3v15.3h3.9v-10.6c1-1 2.1-1.5 3.2-1.5 1.4 0 2.1.9 2.1 2.6v9.6h3.9v-10.6c1.1-1 2.2-1.5 3.3-1.5 1.5 0 2.3.8 2.3 2.6v9.6h3.9v-9.5c0-4.1-1.8-6-5.3-6z"/><path d="m117.8 17.3c-2.3 0-4.4.2-6.4.6v21.1h3.9v-7.1c1 .5 2.1.7 3.1.7 4.8 0 7.3-2.7 7.3-8-.1-4.9-2.7-7.3-7.9-7.3zm.5 12.1c-1.1 0-2.1-.3-3.1-.8v-8c.7-.1 1.6-.2 2.7-.2 2.5 0 3.8 1.4 3.8 4.1.1 3.3-1.1 4.9-3.4 4.9z"/><path d="m128.5 11.7h3.9v20.8h-3.9z"/><path d="m142.1 17.3c-1.7 0-3.5.2-5.6.7v3.1c2-.5 3.9-.7 5.6-.7 2 0 3 .7 3 2.1v1.2c-1-.2-2.1-.3-3.1-.3-4.4 0-6.6 1.5-6.6 4.6 0 3.2 1.9 4.8 5.6 4.8 1.6 0 3.1-.5 4.4-1.4l1.4 1.4h2.2v-10.3c-.1-3.6-2.4-5.2-6.9-5.2zm-.6 12.5c-1.6 0-2.3-.7-2.3-2s.9-1.9 2.8-1.9c1.1 0 2.1.1 3.1.3v2.4c-1.2.8-2.4 1.2-3.6 1.2z"/><path d="m158 29.5c-1.2 0-1.9-.7-1.9-2.1v-7h3.4v-3.1h-3.8l-.6-3h-2.9v14.2c0 2.8 1.3 4.1 3.8 4.1h3.4v-3.1z"/><path d="m168.7 17.3c-4.8 0-7.2 2.5-7.2 7.5 0 5.2 2.8 7.8 8.3 7.8 1.9 0 3.6-.1 4.9-.4v-3.1c-1.5.3-3.1.4-4.6.4-3.2 0-4.8-1.1-4.8-3.2h10.2c.1-.6.1-1.3.1-1.9.1-4.8-2.3-7.1-6.9-7.1zm-3.3 6.3c.2-2.2 1.3-3.3 3.3-3.3 2.1 0 3.2 1.1 3.2 3.2v.1z"/><path d="m178.6 11.7h3.9v20.8h-3.9z"/><path d="m196 17.2-3.8 11-3.9-11h-4.1l5.9 15.4c-.8 1.7-2 2.9-3.7 3.7l1.9 2.6c2.5-1.2 4.3-3.2 5.4-5.9l6.3-15.8z"/></g></svg>
                    </div> <!-- Logo -->
                    <div class="template-cloud-body">
                        <div class="template-cloud-install">
                            <div class="templately-left">
                                <div class="templately-cloud-title">
                                    <h1><?php echo __('Explore 100+ Free Templates', 'essential-addons-for-elementor-lite'); ?></h1>
                                    <p><?php echo __('From multipurpose themes to niche templates, you’ll always find something that catches your eye.', 'essential-addons-for-elementor-lite'); ?></p>
                                </div>
                            </div>
                            <div class="templately-installer-wrapper">
                                <div class="templately-left">
                                    <div class="templately-admin-title">
                                        <div class="templately-cloud-video-container"><iframe height="350" src="https://www.youtube.com/embed/coLxfjnrm3I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                                    </div>
                                </div>
                                <div class="templately-right">
                                    <div class="templately-admin-install">
                                        <p><?php echo __('Install Templately by Essential Addons to get access to the templates library and cloud.', 'essential-addons-for-elementor-lite'); ?></p>
                                        <button class="eae-activate-templately"><?php echo $button_text; ?></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script type="text/javascript">
                    ( function( $ ){
                        $( document ).ready(function( $ ){
                            $('body').on('click', '.eae-activate-templately', function( e ){
                                var self = $(this);
                                self.text('<?php echo !$installed ? esc_js('Installing...') : esc_js('Activating...'); ?>');
                                e.preventDefault();
                                $.ajax({
                                    url: '<?php echo admin_url('admin-ajax.php'); ?>',
                                    type: 'POST',
                                    data: {
                                        action: 'wpdeveloper_upsale_core_install_<?php echo $plugin_name; ?>',
                                        _wpnonce: '<?php echo wp_create_nonce('wpdeveloper_upsale_core_install_' . $plugin_name); ?>',
                                        slug : 'templately',
                                        file : 'templately.php'
                                    },
                                    complete: function() {
                                        self.attr('disabled', 'disabled');
                                        self.removeClass('install-now updating-message');
                                    }
                                }).done(function(){
                                    self.text('<?php echo esc_js('Installed'); ?>').delay(3000);
                                    window.location.href = '<?php echo admin_url("admin.php?page=templately"); ?>';
                                }).fail(function(){
                                    self.removeClass('install-now updating-message');
                                });
                            });

                        });
                    })( jQuery );
                </script>
            </div>
        <?php
}
    /**
     * Loading all essential scripts
     *
     * @since 1.1.2
     */
    public function admin_enqueue_scripts($hook)
    {
        wp_enqueue_style('essential_addons_elementor-notice-css', EAEL_PLUGIN_URL . 'assets/admin/css/notice.css', false, EAEL_PLUGIN_VERSION);

        if ($hook == 'essential-addons_page_template-cloud') {
            wp_enqueue_style('essential_addons_elementor-template-cloud-css', EAEL_PLUGIN_URL . 'assets/admin/css/cloud.css', false, EAEL_PLUGIN_VERSION);
        }

        if (isset($hook) && $hook == 'toplevel_page_eael-settings') {
            wp_enqueue_style('essential_addons_elementor-admin-css', EAEL_PLUGIN_URL . 'assets/admin/css/admin.css', false, EAEL_PLUGIN_VERSION);
            if ($this->pro_enabled) {
                wp_enqueue_style('eael_pro-admin-css', EAEL_PRO_PLUGIN_URL . 'assets/admin/css/admin.css', false, EAEL_PRO_PLUGIN_VERSION);
            }
            wp_enqueue_style('sweetalert2-css', EAEL_PLUGIN_URL . 'assets/admin/vendor/sweetalert2/css/sweetalert2.min.css', false, EAEL_PLUGIN_VERSION);
            wp_enqueue_script('sweetalert2-js', EAEL_PLUGIN_URL . 'assets/admin/vendor/sweetalert2/js/sweetalert2.min.js', array('jquery', 'sweetalert2-core-js'), EAEL_PLUGIN_VERSION, true);
            wp_enqueue_script('sweetalert2-core-js', EAEL_PLUGIN_URL . 'assets/admin/vendor/sweetalert2/js/core.js', array('jquery'), EAEL_PLUGIN_VERSION, true);

            wp_enqueue_script('essential_addons_elementor-admin-js', EAEL_PLUGIN_URL . 'assets/admin/js/admin.js', array('jquery'), EAEL_PLUGIN_VERSION, true);

            //Internationalizing JS string translation
            $i18n = [
                    'login_register' => [
	                        //m=modal, rm=response modal, r=reCAPTCHA, g= google, f=facebook, e=error
                            'm_title' => __('Login | Register Form Settings', 'essential-addons-for-elementor-lite'),
                            'm_footer' => $this->pro_enabled ? __('To configure the API Keys, check out this doc', 'essential-addons-for-elementor-lite') :  __('To retrieve your API Keys, click here', 'essential-addons-for-elementor-lite'),
                            'save' => __('Save', 'essential-addons-for-elementor-lite'),
                            'cancel' => __('Cancel', 'essential-addons-for-elementor-lite'),
                            'rm_title' => __('Login | Register Form Settings Saved', 'essential-addons-for-elementor-lite'),
                            'rm_footer' => __('Reload the page to see updated data', 'essential-addons-for-elementor-lite'),
                            'e_title' => __('Oops...', 'essential-addons-for-elementor-lite'),
                            'e_text' => __('Something went wrong!', 'essential-addons-for-elementor-lite'),
                            'r_title' => __('reCAPTCHA v2', 'essential-addons-for-elementor-lite'),
                            'r_sitekey' => __('Site Key', 'essential-addons-for-elementor-lite'),
                            'r_sitesecret' => __('Site Secret', 'essential-addons-for-elementor-lite'),
                            'g_title' => __('Google Login', 'essential-addons-for-elementor-lite'),
                            'g_cid' => __('Google Client ID', 'essential-addons-for-elementor-lite'),
                            'f_title' => __('Facebook Login', 'essential-addons-for-elementor-lite'),
                            'f_app_id' => __('Facebook APP ID', 'essential-addons-for-elementor-lite'),
                            'f_app_secret' => __('Facebook APP Secret', 'essential-addons-for-elementor-lite'),
                    ]
            ];

            wp_localize_script('essential_addons_elementor-admin-js', 'localize', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('essential-addons-elementor'),
                'i18n' => $i18n,
            ));
        }
    }

    public function setup_wizard(){ ?>
	    <div class="eael-setup-wizard-wrap">
                <ul class="eael-setup-wizard">
                    <li class="step">
                        <div class="icon">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                    <g>
                                        <path class="st0" d="M50,25c0-1.9-1.3-3.8-3-4.4c-1.6-0.6-3.2-2-3.7-3.1c-0.5-1.1-0.3-3.3,0.4-4.9c0.8-1.6,0.3-3.9-1-5.2
                                            c-1.3-1.3-3.7-1.8-5.2-1c-1.6,0.8-3.7,0.9-4.9,0.4C31.5,6.2,30,4.6,29.4,3c-0.6-1.7-2.6-3-4.4-3c-1.9,0-3.8,1.3-4.4,3
                                            c-0.6,1.7-2,3.3-3.1,3.7c-1.1,0.5-3.3,0.3-4.9-0.4C11,5.5,8.6,6,7.3,7.3C6,8.6,5.5,11,6.3,12.6c0.8,1.6,0.9,3.7,0.4,4.9
                                            C6.2,18.6,4.6,20,3,20.6c-1.7,0.6-3,2.6-3,4.4c0,1.9,1.3,3.8,3,4.4c1.7,0.6,3.2,2,3.7,3.1c0.5,1.1,0.3,3.3-0.4,4.9
                                            c-0.8,1.6-0.3,3.9,1,5.2c1.3,1.3,3.7,1.8,5.2,1c1.6-0.8,3.7-0.9,4.9-0.4c1.1,0.5,2.6,2.1,3.1,3.7c0.6,1.7,2.6,3,4.4,3
                                            c1.9,0,3.8-1.3,4.4-3c0.6-1.6,2-3.3,3.1-3.7c1.1-0.5,3.3-0.3,4.9,0.4c1.6,0.8,3.9,0.3,5.2-1c1.3-1.3,1.8-3.7,1-5.2
                                            c-0.8-1.6-0.9-3.7-0.4-4.9c0.5-1.1,2.1-2.6,3.7-3.1C48.7,28.8,50,26.9,50,25L50,25z M25,34.2c-5.1,0-9.2-4.1-9.2-9.2
                                            c0-5.1,4.1-9.2,9.2-9.2c5.1,0,9.2,4.1,9.2,9.2C34.2,30.1,30.1,34.2,25,34.2L25,34.2z M25,34.2"/>
                                    </g>
                                    </svg>
                        </div>
                        <div class="name">Configuration</div>
                    </li>
                    <li class="step">
                        <div class="icon">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                <g>
                                    <path class="st0" d="M18.8,4.2H2.1C0.9,4.2,0,5.1,0,6.3v16.7C0,24.1,0.9,25,2.1,25h16.7c1.2,0,2.1-0.9,2.1-2.1V6.3
    C20.8,5.1,19.9,4.2,18.8,4.2z"/>
                                    <path class="st0" d="M18.8,29.2H6.3c-1.2,0-2.1,0.9-2.1,2.1v12.5c0,1.2,0.9,2.1,2.1,2.1h12.5c1.2,0,2.1-0.9,2.1-2.1V31.3
    C20.8,30.1,19.9,29.2,18.8,29.2z"/>
                                    <path class="st0" d="M43.8,29.2H27.1c-1.2,0-2.1,0.9-2.1,2.1v16.7c0,1.2,0.9,2.1,2.1,2.1h16.7c1.2,0,2.1-0.9,2.1-2.1V31.3
    C45.8,30.1,44.9,29.2,43.8,29.2z"/>
                                    <path class="st0" d="M47.9,0H27.1C25.9,0,25,0.9,25,2.1v20.8c0,1.2,0.9,2.1,2.1,2.1h20.8c1.2,0,2.1-0.9,2.1-2.1V2.1
    C50,0.9,49.1,0,47.9,0z"/>
                                </g>
                            </svg>
                        </div>
                        <div class="name">Elements</div>
                    </li>
                    <li class="step">
                        <div class="icon">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                <g>
                                    <path class="st0" d="M9,38.9c7.3,0,7.3,11.1,0,11.1C1.7,50,1.7,38.9,9,38.9z"/>
                                    <path class="st0" d="M25.3,38.9c7.3,0,7.3,11.1,0,11.1C18,50,18,38.9,25.3,38.9z"/>
                                    <g>
                                        <path class="st0" d="M41.4,38.9c7.3,0,7.3,11.1,0,11.1C34.2,50,34.2,38.9,41.4,38.9z"/>
                                        <path class="st0" d="M35.1,9.3c-0.3,0-0.6,0-0.9,0c-1.4-6.9-9.3-11.2-15.9-8.5c0,1.5,0,3.2,0,3.9c1.5,0,4.4,0,5.8,0v5.7
        c-1.9,0-3.8,0-5.8,0c0,2,0,7.6,0,9.6c1.7,0,4,0,6,0c-1.5,6.8-11.3,6.4-11.8-0.7c0-2.5,0-6.4,0-9C-1,11.9,1.4,33.2,15.4,33
        c0.1,0,19.7,0,19.8,0C50.6,32.8,50.6,9.4,35.1,9.3z"/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="name">Templately</div>
                    </li>
                    <li class="step">
                        <div class="icon">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                <path class="st0" d="M48.9,16.6c-0.7-0.7-1.6-1.1-2.6-1.1c-1,0-1.9,0.4-2.6,1.1l-8.8,8.8L24.7,15.1l8.8-8.8c0.7-0.7,1.1-1.6,1.1-2.6
c0-1-0.4-1.9-1.1-2.6C32.7,0.4,31.8,0,30.8,0c-1,0-1.9,0.4-2.6,1.1l-8.8,8.8l-5.6-5.6c-0.3-0.3-0.6-0.4-1-0.4c-0.4,0-0.7,0.2-1,0.4
c-8,8.8-3.7,28-3.2,29.9l-8.1,8.1c-0.3,0.2-0.4,0.6-0.4,0.9c0,0.4,0.1,0.7,0.4,0.9L5.5,49c0.3,0.3,0.6,0.4,0.9,0.4
c0.3,0,0.7-0.1,0.9-0.4l8.1-8.1c3.9,1,8.8,1.6,13.2,1.6c5.2,0,12.3-0.8,16.7-4.8c0.3-0.2,0.4-0.6,0.4-1c0-0.4-0.1-0.7-0.4-1
l-5.2-5.2l8.8-8.8C50.4,20.4,50.4,18,48.9,16.6z"/>
                            </svg>
                        </div>
                        <div class="name">Integrations</div>
                    </li>
                    <li class="step">
                        <div class="icon">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                <path class="st0" d="M48.5,3.1l-0.3-0.3c-0.9-0.9-2.1-1.4-3.3-1.3c-1.2,0-2.4,0.6-3.3,1.5L16.1,30.9l-0.5,0.2l-0.5-0.2l-6.3-7.4
c-0.9-1.1-2.2-1.7-3.6-1.8c-1.4-0.1-2.8,0.5-3.8,1.5c-1.6,1.6-1.8,4.1-0.5,5.9l13.1,18.3c0.7,1,1.9,1.7,3.2,1.7h1.1
c2.2,0,4.2-1.1,5.4-2.8L49.1,9.5C50.5,7.5,50.2,4.8,48.5,3.1z"/>
                            </svg>
                        </div>
                        <div class="name">Finalize</div>
                    </li>
                </ul>
                <div class="eael-setup-body">
                    <div id="configuration" class="setup-content">
                        <div class="eael-input-group config-list">
                            <input id="basic" name="radio" type="radio">
                            <label for="basic">
                                <div class="eael-radio-circle"></div>
                                <div class="eael-radio-text">
                                    <strong>Basic</strong>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                                </div>
                            </label>
                        </div>
                        <div class="eael-input-group config-list">
                            <input id="advance" name="radio" type="radio" checked>
                            <label for="advance">
                                <div class="eael-radio-circle"></div>
                                <div class="eael-radio-text">
                                    <strong>Advance</strong>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                                </div>
                            </label>
                        </div>
                        <div class="eael-input-group config-list">
                            <input id="custom" name="radio" type="radio">
                            <label for="custom">
                                <div class="eael-radio-circle"></div>
                                <div class="eael-radio-text">
                                    <strong>Custom</strong>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div id="elements" class="setup-content eael-box">elements</div>
                    <div id="templately" class="setup-content eael-box">
                        <img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/templately.jpg'; ?>" alt="">
                    </div>
                    <div id="integrations" class="setup-content eael-box">integrations</div>
                    <div id="finalize" class="setup-content eael-box">
                        <div class="eael-iframe">
                            <iframe src="https://www.youtube.com/embed/CnSYwGcXnxA" frameborder="0"></iframe>
                        </div>
                        <div class="eael-setup-final-info">
                            <div>
                                <div class="eael-input-group">
                                    <input type="checkbox" id="eael_user_email_address" name="eael_user_email_address" value="" checked>
                                    <label for="eael_user_email_address">Share non-sensitive diagnosstic data and plugin usage information</label>
                                </div>
                                <button type="button" class="btn-collect"><?php esc_html_e('What We Collect?', 'essential-addons-for-elementor-lite'); ?></button>
                            </div>
                            <button type="button" id="betterdocsqswemailskipbutton" class="btn-skip"><?php esc_html_e('Skip This Step', 'essential-addons-for-elementor-lite'); ?></button>
                        </div>
                    </div>
                </div>
                <div class="eael-setup-footer">
                    <button id="eael-prev" class="button eael-btn" onclick="next(-1)">< Previous</button>
                    <button id="eael-next" class="button eael-btn" onclick="next(1)">Next ></button>
                </div>
            </div>

            <script type="text/javascript">
                var currentTab = 0;

                showTab(currentTab);

                function showTab(n) {
	                var x = document.getElementsByClassName("setup-content");
	                console.log(x);
	                x[n].style.display = "block";

	                if (n == 0) {
		                document.getElementById("eael-prev").style.display = "none";
	                } else {
		                document.getElementById("eael-prev").style.display = "inline";
	                }
	                if (n == (x.length - 1)) {
		                document.getElementById("eael-next").innerHTML = "Submit";
	                }
	                else {
		                document.getElementById("eael-next").innerHTML = "Next >";
	                }
	                fixStepIndicator(n)
                }

                function next(n) {
	                var x = document.getElementsByClassName("setup-content");

	                x[currentTab].style.display = "none";

	                currentTab = currentTab + n;

	                if (currentTab >= x.length) {

		                return false;
	                }

	                showTab(currentTab);
                }

                function fixStepIndicator(n) {
	                var i, x = document.getElementsByClassName("step");
                    var container = document.getElementsByClassName("eael-setup-wizard");
                    container[0].setAttribute('data-step', n);

                    for (i = 0; i < x.length; i++) {
	                    x[i].className = x[i].className.replace(" active", "");

                    }

                    x[n].className += " active";
                }
            </script>
    <?php }

    /**
     * Create settings page.
     *
     * @since 1.1.2
     */
    public function admin_settings_page()
    {
        ?>
        <div class="eael-settings-wrap">
		  	<form action="" method="POST" id="eael-settings" name="eael-settings">
		  		<div class="eael-header-bar">
					<div class="eael-header-left">
						<div class="eael-admin-logo-inline">
							<img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-ea-logo.svg'; ?>" alt="essential-addons-for-elementor">
						</div>
						<h2 class="title"><?php echo __('Essential Addons Settings', 'essential-addons-for-elementor-lite'); ?></h2>
					</div>
					<div class="eael-header-right">
					<button type="submit" class="button eael-btn js-eael-settings-save"><?php echo __('Save settings', 'essential-addons-for-elementor-lite'); ?></button>
					</div>
				</div>
			  	<div class="eael-settings-tabs">
			    	<ul class="eael-tabs">
				      	<li><a href="#general" class="active"><img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-general.svg'; ?>" alt="essential-addons-general-settings"><span><?php echo __('General', 'essential-addons-for-elementor-lite'); ?></span></a></li>
				      	<li><a href="#elements"><img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-elements.svg'; ?>" alt="essential-addons-elements"><span><?php echo __('Elements', 'essential-addons-for-elementor-lite'); ?></span></a></li>
                        <li><a href="#extensions"><img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-extensions.svg'; ?>" alt="essential-addons-extensions"><span><?php echo __('Extensions', 'essential-addons-for-elementor-lite'); ?></span></a></li>
                        <li><a href="#tools"><img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-tools.svg'; ?>" alt="essential-addons-tools"><span><?php echo __('Tools', 'essential-addons-for-elementor-lite'); ?></span></a></li>
                        <?php if (!$this->pro_enabled) {?>
                            <li><a href="#go-pro"><img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-upgrade.svg'; ?>" alt="essential-addons-go-pro"><span><?php echo __('Go Premium', 'essential-addons-for-elementor-lite'); ?></span></a></li>
                        <?php }?>
                        <li><a href="#integrations"><img src="<?php echo EAEL_PLUGIN_URL . 'assets/admin/images/icon-integrations.svg'; ?>" alt="essential-addons-integrations"><span><?php echo __('Integrations', 'essential-addons-for-elementor-lite'); ?></span></a></li>
                    </ul>
                    <?php
                    include_once EAEL_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'includes/templates/admin/general.php';
                    include_once EAEL_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'includes/templates/admin/elements.php';
                    include_once EAEL_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'includes/templates/admin/extensions.php';
                    include_once EAEL_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'includes/templates/admin/tools.php';
                    if (!$this->pro_enabled) {
                        include_once EAEL_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'includes/templates/admin/go-pro.php';
                    }
                    include_once EAEL_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'includes/templates/admin/integrations.php';
                    ?>
                </div>
            </form>
        </div>
        <?php
}

    /**
     * Saving data with ajax request
     * @param
     * @return  array
     * @since 1.1.2
     */
    public function save_settings()
    {
	    check_ajax_referer('essential-addons-elementor', 'security');

        if (!isset($_POST['fields'])) {
            return;
        }

        parse_str($_POST['fields'], $settings);

	    if ( !empty( $_POST['is_login_register']) ) {
		    // Saving Login | Register Related Data
		    if ( isset( $settings['recaptchaSiteKey']) ) {
			    update_option( 'eael_recaptcha_sitekey', sanitize_text_field( $settings['recaptchaSiteKey']));
		    }
		    if ( isset( $settings['recaptchaSiteSecret']) ) {
			    update_option( 'eael_recaptcha_secret', sanitize_text_field( $settings['recaptchaSiteSecret']));
            }
            
		    //pro settings
		    if ( isset( $settings['gClientId']) ) {
			    update_option( 'eael_g_client_id', sanitize_text_field( $settings['gClientId']));
		    }
		    if ( isset( $settings['fbAppId'] ) ) {
			    update_option( 'eael_fb_app_id', sanitize_text_field( $settings['fbAppId']));
		    }
		    if ( isset( $settings['fbAppSecret'] ) ) {
			    update_option( 'eael_fb_app_secret', sanitize_text_field( $settings['fbAppSecret']));
            }
            
		    wp_send_json_success( ['message'=> __('Login | Register Settings updated', 'essential-addons-for-elementor-lite')]);
        }


        // Saving Google Map Api Key
        if (isset($settings['google-map-api'])) {
            update_option('eael_save_google_map_api', sanitize_text_field($settings['google-map-api']));
        }

        // Saving Mailchimp Api Key
        if (isset($settings['mailchimp-api'])) {
            update_option('eael_save_mailchimp_api', sanitize_text_field($settings['mailchimp-api']));
        }

        // Saving TYpeForm token
        if (isset($settings['typeform-personal-token'])) {
            update_option('eael_save_typeform_personal_token', sanitize_text_field($settings['typeform-personal-token']));
        }

        // Saving Duplicator Settings
        if (isset($settings['post-duplicator-post-type'])) {
            update_option('eael_save_post_duplicator_post_type', sanitize_text_field($settings['post-duplicator-post-type']));
        }

        // save js print method
        if (isset($settings['eael-js-print-method'])) {
            update_option('eael_js_print_method', sanitize_text_field($settings['eael-js-print-method']));
        }

        $defaults = array_fill_keys(array_keys(array_merge($this->registered_elements, $this->registered_extensions)), false);
        $elements = array_merge($defaults, array_fill_keys(array_keys(array_intersect_key($settings, $defaults)), true));

        // update new settings
        $updated = update_option('eael_save_settings', $elements);

        // clear assets files
        $this->empty_dir(EAEL_ASSET_PATH);

        wp_send_json($updated);
    }

    public function admin_notice()
    {
        $notice = new WPDeveloper_Notice(EAEL_PLUGIN_BASENAME, EAEL_PLUGIN_VERSION);
        /**
         * Current Notice End Time.
         * Notice will dismiss in 3 days if user does nothing.
         */
        $notice->cne_time = '3 Day';
        /**
         * Current Notice Maybe Later Time.
         * Notice will show again in 7 days
         */
        $notice->maybe_later_time = '21 Day';

        $scheme = (parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY)) ? '&' : '?';
        $url = $_SERVER['REQUEST_URI'] . $scheme;
        $notice->links = [
            'review' => array(
                'later' => array(
                    'link' => 'https://wpdeveloper.net/review-essential-addons-elementor',
                    'target' => '_blank',
                    'label' => __('Ok, you deserve it!', 'essential-addons-for-elementor-lite'),
                    'icon_class' => 'dashicons dashicons-external',
                ),
                'allready' => array(
                    'link' => $url,
                    'label' => __('I already did', 'essential-addons-for-elementor-lite'),
                    'icon_class' => 'dashicons dashicons-smiley',
                    'data_args' => [
                        'dismiss' => true,
                    ],
                ),
                'maybe_later' => array(
                    'link' => $url,
                    'label' => __('Maybe Later', 'essential-addons-for-elementor-lite'),
                    'icon_class' => 'dashicons dashicons-calendar-alt',
                    'data_args' => [
                        'later' => true,
                    ],
                ),
                'support' => array(
                    'link' => 'https://wpdeveloper.net/support',
                    'label' => __('I need help', 'essential-addons-for-elementor-lite'),
                    'icon_class' => 'dashicons dashicons-sos',
                ),
                'never_show_again' => array(
                    'link' => $url,
                    'label' => __('Never show again', 'essential-addons-for-elementor-lite'),
                    'icon_class' => 'dashicons dashicons-dismiss',
                    'data_args' => [
                        'dismiss' => true,
                    ],
                ),
            ),
        ];

        /**
         * This is review message and thumbnail.
         */
        $notice->message('review', '<p>' . __('We hope you\'re enjoying Essential Addons for Elementor! Could you please do us a BIG favor and give it a 5-star rating on WordPress to help us spread the word and boost our motivation?', 'essential-addons-for-elementor-lite') . '</p>');
        $notice->thumbnail('review', plugins_url('assets/admin/images/icon-ea-logo.svg', EAEL_PLUGIN_BASENAME));
        /**
         * This is upsale notice settings
         * classes for wrapper,
         * Message message for showing.
         */
        // $notice->classes('upsale', 'notice is-dismissible ');
        // $notice->message('upsale', '<p>' . __('5,000+ People using <a href="https://betterdocs.co/wordpress-plugin" target="_blank">BetterDocs</a> to create better Documentation & Knowledge Base!', 'essential-addons-for-elementor-lite') . '</p>');
        // $notice->thumbnail('upsale', plugins_url('assets/admin/images/icon-documentation.svg', EAEL_PLUGIN_BASENAME));

        // Update Notice For PRO Version
        if ($this->pro_enabled && \version_compare(EAEL_PRO_PLUGIN_VERSION, '4.0.0', '<')) {
            $notice->classes('update', 'notice is-dismissible ');
            $notice->message('update', '<p>' . __('You are using an incompatible version of Essential Addons PRO. Please update to v4.0.0+. If you do not see automatic update, <a href="https://essential-addons.com/elementor/docs/manually-update-essential-addons-pro/" target="_blank">Follow manual update guide.</a>', 'essential-addons-for-elementor-lite') . '</p>');
            $notice->thumbnail('update', plugins_url('assets/admin/images/icon-ea-logo.svg', EAEL_PLUGIN_BASENAME));
        }

        // $notice->upsale_args = array(
        //     'slug' => 'betterdocs',
        //     'page_slug' => 'betterdocs-setup',
        //     'file' => 'betterdocs.php',
        //     'btn_text' => __('Install Free', 'essential-addons-for-elementor-lite'),
        //     'condition' => [
        //         'by' => 'class',
        //         'class' => 'BetterDocs',
        //     ],
        // );
        $notice->options_args = array(
            'notice_will_show' => [
                'opt_in' => $notice->timestamp,
                'review' => $notice->makeTime($notice->timestamp, '7 Day'), // after 3 days
            ],
        );
        if ($this->pro_enabled && \version_compare(EAEL_PRO_PLUGIN_VERSION, '4.0.0', '<')) {
            $notice->options_args['notice_will_show']['update'] = $notice->timestamp;
        }

        $notice->init();
    }
}
