<?php

namespace Essential_Addons_Elementor\Traits;

use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Trait Login_Registration is responsible for login or registering user using custom login | register widget.
 * @package Essential_Addons_Elementor\Traits
 */
trait Login_Registration {

	public function login_or_register_user() {
		// login or register form?
		if ( isset( $_POST['eael-login-submit'] ) ) {
			$this->log_user_in();
		} elseif ( isset( $_POST['eael-register-submit'] ) ) {
			$this->register_user();
		}
	}

	/**
	 * It logs the user in when the login form is submitted normally without AJAX.
	 */
	public function log_user_in() {
		// before even thinking about login, check security and exit early if something is not right.
		if ( empty( $_POST['eael-login-nonce'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( $_POST['eael-login-nonce'], 'eael-login-action' ) ) {
			return;
		}

		do_action( 'eael/login-register/before-login' );

		$user_login = ! empty( $_POST['eael-user-login'] ) ? sanitize_text_field( $_POST['eael-user-login'] ) : '';
		if ( is_email( $user_login )  ) {
			$user_login = sanitize_email( $user_login );
		}

		$password   = ! empty( $_POST['eael-user-password'] ) ? sanitize_text_field( $_POST['eael-user-password'] ) : '';
		$rememberme = ! empty( $_POST['eael-rememberme'] ) ? sanitize_text_field( $_POST['eael-rememberme'] ) : '';

		$credentials = [
			'user_login'    => $user_login,
			'user_password' => $password,
			'remember'      => ( 'forever' === $rememberme ),
		];

		$user_data = wp_signon( $credentials );

		if ( is_wp_error( $user_data ) ) {

			if ( isset( $user_data->errors['invalid_email'][0] ) ) {
				$this->set_transient( 'eael_login_error', __( 'Invalid Email. Please check your email or try again with your username.', EAEL_TEXTDOMAIN ));

			} elseif ( isset( $user_data->errors['invalid_username'][0] ) ) {
				$this->set_transient( 'eael_login_error', __( 'Invalid Username. Please check your username or try again with your email.', EAEL_TEXTDOMAIN ));

			} elseif ( isset( $user_data->errors['incorrect_password'][0] ) ) {

				$this->set_transient( 'eael_login_error', __( 'Invalid Password. Please check your password and try again', EAEL_TEXTDOMAIN ));

			}
		} else {

			wp_set_current_user( $user_data->ID, $user_login );
			do_action( 'wp_login', $user_data->user_login, $user_data );
			do_action( 'eael/login-register/after-login', $user_data->user_login, $user_data );

			if ( ! empty( $_POST['redirect_to'] ) ) {
				wp_safe_redirect( $_POST['redirect_to'] );
				exit();
			}
		}
	}

	/**
	 * It register the user in when the registration form is submitted normally without AJAX.
	 */
	public function register_user() {
		// validate & sanitize the request data
		if ( empty( $_POST['eael-register-nonce'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( $_POST['eael-register-nonce'], 'eael-register-action' ) ) {
			return;
		}

		do_action( 'eael/login-register/before-register' );
		// prepare the data
		$errors               = [];
		$registration_allowed = get_option( 'users_can_register' );
		$protocol             = is_ssl() ? "https://" : "http://";
		$url                  = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

		// vail early if reg is closed.
		if ( ! $registration_allowed ) {
			$errors['registration']           = __( 'Registration is closed on this site', EAEL_TEXTDOMAIN );
			$this->set_transient( 'eael_register_errors', $errors);
			wp_safe_redirect( site_url( 'wp-login.php?registration=disabled' ) );
			exit();
		}
		// prepare vars and flag errors
		if ( ! empty( $_POST['page_id'] ) ) {
			$page_id = intval( $_POST['page_id'], 10 );
		} else {
			$errors['page_id'] = __( 'Page ID is missing', EAEL_TEXTDOMAIN );
		}

		if ( ! empty( $_POST['widget_id'] ) ) {
			$widget_id = sanitize_text_field( $_POST['widget_id'] );
		} else {
			$errors['widget_id'] = __( 'Widget ID is missing', EAEL_TEXTDOMAIN );
		}

		if ( ! empty( $_POST['email'] ) && is_email( $_POST['email'] ) ) {
			$email = sanitize_email( $_POST['email'] );
			if ( email_exists( $email ) ) {
				$errors['email'] = __( 'The provided email is already registered with other account. Please login or reset password or use another email.', EAEL_TEXTDOMAIN );
			}
		} else {
			$errors['email'] = __( 'Email is missing or Invalid', EAEL_TEXTDOMAIN );
			//@todo; maybe it is good to abort here?? as email is most important. or continue to collect all other errors.
		}


		// if user provided user name, validate & sanitize it
		if ( isset( $_POST['user_name'] ) ) {
			$username = $_POST['user_name'];
			if ( ! validate_username( $username ) || mb_strlen( $username ) > 60 || username_exists( $username ) ) {
				$errors['user_name'] = __( 'Invalid username provided or the username already registered.', EAEL_TEXTDOMAIN );
			}
			//@TODO; Maybe it is good to add a check for filtering out blacklisted usernames later here.
		} else {
			// user has not provided username, so generate one from the provided email.
			if ( empty( $errors['email'] ) && isset( $email ) ) {
				$username = $this->generate_username_from_email( $email );
			}
		}


		// Dynamic Password Generation
		$is_pass_auto_generated = false; // emailing is must for autogen pass
		if ( ! empty( $_POST['password'] ) ) {
			$password = wp_unslash( sanitize_text_field( $_POST['password'] ) );
		} else {
			$password               = wp_generate_password();
			$is_pass_auto_generated = true;
		}

		// if any error found, abort
		if ( ! empty( $errors ) ) {
			$this->set_transient( 'eael_register_errors', $errors);
			wp_safe_redirect( esc_url( $url ) );
			exit();
		}

		// handle registration...
		$document = Plugin::$instance->documents->get( $page_id );
		if ( $document ) {
			$elements    = Plugin::instance()->documents->get( $page_id )->get_elements_data();
			$widget_data = $this->find_element_recursive( $elements, $widget_id );
			//error_log( print_r( $widget_data, 1 ) );

			$widget = Plugin::instance()->elements_manager->create_element_instance( $widget_data );

			$settings = $widget->get_settings_for_display();
			//error_log( 'settings' );

			//error_log( print_r( $settings, 1 ) );
		}

		$user_data = [
			'user_login' => $username,
			'user_pass'  => $password,
			'user_email' => $email,
		];

		if ( ! empty( $_POST['first_name'] ) ) {
			$user_data['first_name'] = sanitize_text_field( $_POST['first_name'] );
		}
		if ( ! empty( $_POST['last_name'] ) ) {
			$user_data['last_name'] = sanitize_text_field( $_POST['last_name'] );
		}
		if ( ! empty( $_POST['user_role'] ) ) {
			$user_data['role'] = sanitize_text_field( $_POST['user_role'] );
		}

		$user_data = apply_filters( 'eael/login-register/new-user-data', $user_data );


		$user_id = wp_insert_user( $user_data );
		if ( is_wp_error( $user_id ) ) {
			// error happened during user creation
			$errors['user_create']            = __( 'Sorry, something went wrong. User could not be registered.', EAEL_TEXTDOMAIN );
			$this->set_transient( 'eael_register_errors', $errors);
			wp_safe_redirect( esc_url( $url ) );
			exit();
		}
		// success & handle after registration action as defined by user in the widget
		$this->set_transient( 'eael_register_success', __( 'Registration completed successfully, Check your inbox for password if you did not provided while registering.', EAEL_TEXTDOMAIN ));


		// perform registration....
		//error_log( print_r( $_POST, 1 ) );

	}

	public function generate_username_from_email( $email, $suffix = '' ) {

		$username_parts = [];
		if ( empty( $username_parts ) ) {
			$email_parts    = explode( '@', $email );
			$email_username = $email_parts[0];

			// Exclude common prefixes.
			if ( in_array( $email_username, [
				'sales',
				'hello',
				'mail',
				'contact',
				'info',
			], true ) ) {
				// Get the domain part.
				$email_username = $email_parts[1];
			}

			$username_parts[] = sanitize_user( $email_username, true );
		}
		$username = strtolower( implode( '', $username_parts ) );

		if ( $suffix ) {
			$username .= $suffix;
		}

		$username = sanitize_user( $username, true );
		if ( username_exists( $username ) ) {
			// Generate something unique to append to the username in case of a conflict with another user.
			$suffix = '-' . zeroise( wp_rand( 0, 9999 ), 4 );

			return $this->generate_username_from_email( $email, $suffix );
		}

		return $username;
	}

	/**
	 * Get Widget data.
	 *
	 * @param array  $elements Element array.
	 * @param string $form_id  Element ID.
	 *
	 * @return bool|array
	 */
	public function find_element_recursive( $elements, $form_id ) {

		foreach ( $elements as $element ) {
			if ( $form_id === $element['id'] ) {
				return $element;
			}

			if ( ! empty( $element['elements'] ) ) {
				$element = $this->find_element_recursive( $element['elements'], $form_id );

				if ( $element ) {
					return $element;
				}
			}
		}

		return false;
	}

	public function get_user_roles() {
		$user_roles['default'] = __( 'Default', EAEL_TEXTDOMAIN );
		if ( function_exists( 'get_editable_roles' ) ) {
			$wp_roles   = get_editable_roles();
			$roles      = $wp_roles ? $wp_roles : [];
			if ( ! empty( $roles ) && is_array( $roles ) ) {
				foreach ( $wp_roles as $role_key => $role ) {
					$user_roles[ $role_key ] = $role['name'];
				}
			}
		}

		return apply_filters( 'eael/login-register/new-user-roles', $user_roles );
	}

	/**
	 * It store data temporarily
	 *
	 * @param     $name
	 * @param     $data
	 * @param int $time time in seconds. Default is 300s = 5 minutes
	 *
	 * @return bool it returns true if the data saved, otherwise, false returned.
	 */
	public function set_transient($name, $data, $time = 300) {
			$time = empty( $time ) ? (int) $time : (5 * MINUTE_IN_SECONDS);
			return set_transient( $name, $data, time() + $time);
	}
}