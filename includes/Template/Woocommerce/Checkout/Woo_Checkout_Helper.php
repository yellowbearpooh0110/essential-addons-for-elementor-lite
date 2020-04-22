<?php
namespace Essential_Addons_Elementor\Template\Woocommerce\Checkout;

use Elementor\Icons_Manager;

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

trait Woo_Checkout_Helper {

	/**
	 * Show the checkout.
	 */
	public static function ea_checkout($settings) {
		// Show non-cart errors.
		do_action( 'woocommerce_before_checkout_form_cart_notices' );

		// Check cart has contents.
		if ( WC()->cart->is_empty() && ! is_customize_preview() && apply_filters( 'woocommerce_checkout_redirect_empty_cart', true ) ) {
			return;
		}

		// Check cart contents for errors.
		do_action( 'woocommerce_check_cart_items' );

		// Calc totals.
		WC()->cart->calculate_totals();

		// Get checkout object.
		$checkout = WC()->checkout();

		if ( empty( $_POST ) && wc_notice_count( 'error' ) > 0 ) { // WPCS: input var ok, CSRF ok.

			wc_get_template( 'checkout/cart-errors.php', array( 'checkout' => $checkout ) );
			wc_clear_notices();

		} else {

			$non_js_checkout = ! empty( $_POST['woocommerce_checkout_update_totals'] ); // WPCS: input var ok, CSRF ok.

			if ( wc_notice_count( 'error' ) === 0 && $non_js_checkout ) {
				wc_add_notice( __( 'The order totals have been updated. Please confirm your order by pressing the "Place order" button at the bottom of the page.', 'woocommerce' ) );
			}

			if($settings['ea_woo_checkout_layout'] == 'default'){
				echo self::render_default_template_($checkout, $settings);
			}else {
				do_action('eael_add_woo_checkout_pro_layout', $checkout, $settings);
			}

		}
	}

	/**
	 * Show the Order Received page.
	 */
	public static function ea_order_received( $order_id = 0 ) {
		$order = false;

		// Get the order.
		$order_id  = apply_filters( 'woocommerce_thankyou_order_id', absint( $order_id ) );
		$order_key = apply_filters( 'woocommerce_thankyou_order_key', empty( $_GET['key'] ) ? '' : wc_clean( wp_unslash( $_GET['key'] ) ) ); // WPCS: input var ok, CSRF ok.

		if ( $order_id > 0 ) {
			$order = wc_get_order( $order_id );
			if ( ! $order || ! hash_equals( $order->get_order_key(), $order_key ) ) {
				$order = false;
			}
		}

		// Empty awaiting payment session.
		unset( WC()->session->order_awaiting_payment );

		// In case order is created from admin, but paid by the actual customer, store the ip address of the payer
		// when they visit the payment confirmation page.
		if ( $order && $order->is_created_via( 'admin' ) ) {
			$order->set_customer_ip_address( WC_Geolocation::get_ip_address() );
			$order->save();
		}

		// Empty current cart.
		wc_empty_cart();

		wc_get_template( 'checkout/thankyou.php', array( 'order' => $order ) );
	}

	/**
	 * Show the pay page.
	 */
	public static function ea_order_pay( $order_id ) {

		do_action( 'before_woocommerce_pay' );

		$order_id = absint( $order_id );

		// Pay for existing order.
		if ( isset( $_GET['pay_for_order'], $_GET['key'] ) && $order_id ) { // WPCS: input var ok, CSRF ok.
			try {
				$order_key          = isset( $_GET['key'] ) ? wc_clean( wp_unslash( $_GET['key'] ) ) : ''; // WPCS: input var ok, CSRF ok.
				$order              = wc_get_order( $order_id );
				$hold_stock_minutes = (int) get_option( 'woocommerce_hold_stock_minutes', 0 );

				// Order or payment link is invalid.
				if ( ! $order || $order->get_id() !== $order_id || ! hash_equals( $order->get_order_key(), $order_key ) ) {
					throw new Exception( __( 'Sorry, this order is invalid and cannot be paid for.', 'essential-addons-for-elementor-lite' ) );
				}

				// Logged out customer does not have permission to pay for this order.
				if ( ! current_user_can( 'pay_for_order', $order_id ) && ! is_user_logged_in() ) {
					echo '<div class="woocommerce-info">' . esc_html__( 'Please log in to your account below to continue to the payment form.', 'essential-addons-for-elementor-lite' ) . '</div>';
					woocommerce_login_form(
						array(
							'redirect' => $order->get_checkout_payment_url(),
						)
					);
					return;
				}

				// Add notice if logged in customer is trying to pay for guest order.
				if ( ! $order->get_user_id() && is_user_logged_in() ) {
					// If order has does not have same billing email then current logged in user then show warning.
					if ( $order->get_billing_email() !== wp_get_current_user()->user_email ) {
						wc_print_notice( __( 'You are paying for a guest order. Please continue with payment only if you recognize this order.', 'essential-addons-for-elementor-lite' ), 'error' );
					}
				}

				// Logged in customer trying to pay for someone else's order.
				if ( ! current_user_can( 'pay_for_order', $order_id ) ) {
					throw new Exception( __( 'This order cannot be paid for. Please contact us if you need assistance.', 'essential-addons-for-elementor-lite' ) );
				}

				// Does not need payment.
				if ( ! $order->needs_payment() ) {
					/* translators: %s: order status */
					throw new Exception( sprintf( __( 'This order&rsquo;s status is &ldquo;%s&rdquo;&mdash;it cannot be paid for. Please contact us if you need assistance.', 'essential-addons-for-elementor-lite' ), wc_get_order_status_name( $order->get_status() ) ) );
				}

				// Ensure order items are still stocked if paying for a failed order. Pending orders do not need this check because stock is held.
				if ( ! $order->has_status( wc_get_is_pending_statuses() ) ) {
					$quantities = array();

					foreach ( $order->get_items() as $item_key => $item ) {
						if ( $item && is_callable( array( $item, 'get_product' ) ) ) {
							$product = $item->get_product();

							if ( ! $product ) {
								continue;
							}

							$quantities[ $product->get_stock_managed_by_id() ] = isset( $quantities[ $product->get_stock_managed_by_id() ] ) ? $quantities[ $product->get_stock_managed_by_id() ] + $item->get_quantity() : $item->get_quantity();
						}
					}

					foreach ( $order->get_items() as $item_key => $item ) {
						if ( $item && is_callable( array( $item, 'get_product' ) ) ) {
							$product = $item->get_product();

							if ( ! $product ) {
								continue;
							}

							if ( ! apply_filters( 'woocommerce_pay_order_product_in_stock', $product->is_in_stock(), $product, $order ) ) {
								/* translators: %s: product name */
								throw new Exception( sprintf( __( 'Sorry, "%s" is no longer in stock so this order cannot be paid for. We apologize for any inconvenience caused.', 'essential-addons-for-elementor-lite' ), $product->get_name() ) );
							}

							// We only need to check products managing stock, with a limited stock qty.
							if ( ! $product->managing_stock() || $product->backorders_allowed() ) {
								continue;
							}

							// Check stock based on all items in the cart and consider any held stock within pending orders.
							$held_stock     = ( $hold_stock_minutes > 0 ) ? wc_get_held_stock_quantity( $product, $order->get_id() ) : 0;
							$required_stock = $quantities[ $product->get_stock_managed_by_id() ];

							if ( ! apply_filters( 'woocommerce_pay_order_product_has_enough_stock', ( $product->get_stock_quantity() >= ( $held_stock + $required_stock ) ), $product, $order ) ) {
								/* translators: 1: product name 2: quantity in stock */
								throw new Exception( sprintf( __( 'Sorry, we do not have enough "%1$s" in stock to fulfill your order (%2$s available). We apologize for any inconvenience caused.', 'essential-addons-for-elementor-lite' ), $product->get_name(), wc_format_stock_quantity_for_display( $product->get_stock_quantity() - $held_stock, $product ) ) );
							}
						}
					}
				}

				WC()->customer->set_props(
					array(
						'billing_country'  => $order->get_billing_country() ? $order->get_billing_country() : null,
						'billing_state'    => $order->get_billing_state() ? $order->get_billing_state() : null,
						'billing_postcode' => $order->get_billing_postcode() ? $order->get_billing_postcode() : null,
					)
				);
				WC()->customer->save();

				$available_gateways = WC()->payment_gateways->get_available_payment_gateways();

				if ( count( $available_gateways ) ) {
					current( $available_gateways )->set_current();
				}

				wc_get_template(
					'checkout/form-pay.php',
					array(
						'order'              => $order,
						'available_gateways' => $available_gateways,
						'order_button_text'  => apply_filters( 'woocommerce_pay_order_button_text', __( 'Pay for order', 'woocommerce' ) ),
					)
				);

			} catch ( Exception $e ) {
				wc_print_notice( $e->getMessage(), 'error' );
			}
		} elseif ( $order_id ) {

			// Pay for order after checkout step.
			$order_key = isset( $_GET['key'] ) ? wc_clean( wp_unslash( $_GET['key'] ) ) : ''; // WPCS: input var ok, CSRF ok.
			$order     = wc_get_order( $order_id );

			if ( $order && $order->get_id() === $order_id && hash_equals( $order->get_order_key(), $order_key ) ) {

				if ( $order->needs_payment() ) {

					wc_get_template( 'checkout/order-receipt.php', array( 'order' => $order ) );

				} else {
					/* translators: %s: order status */
					wc_print_notice( sprintf( __( 'This order&rsquo;s status is &ldquo;%s&rdquo;&mdash;it cannot be paid for. Please contact us if you need assistance.', 'essential-addons-for-elementor-lite' ), wc_get_order_status_name( $order->get_status() ) ), 'error' );
				}
			} else {
				wc_print_notice( __( 'Sorry, this order is invalid and cannot be paid for.', 'essential-addons-for-elementor-lite' ), 'error' );
			}
		} else {
			wc_print_notice( __( 'Invalid order.', 'essential-addons-for-elementor-lite' ), 'error' );
		}

		do_action( 'after_woocommerce_pay' );
	}

	/**
	 * Show the coupon.
	 */
	public static function checkout_coupon_template() {
		$settings = self::get_settings();

		?>
        <div class="woo-checkout-coupon">
            <div class="ea-coupon-icon">
				<?php Icons_Manager::render_icon( $settings['ea_woo_checkout_coupon_icon'], [ 'aria-hidden' => 'true' ] ); ?>
            </div>
			<?php wc_get_template('checkout/form-coupon.php', array('checkout' => WC()->checkout(),)); ?>
        </div>
	<?php }

	/**
	 * Show the login.
	 */
	public static function checkout_login_template() {
		$settings = self::get_settings();

		if ( is_user_logged_in() || 'no' === get_option( 'woocommerce_enable_checkout_login_reminder' ) ) {
			return;
		}

		?>
        <div class="woo-checkout-login">
            <div class="ea-login-icon">
				<?php Icons_Manager::render_icon( $settings['ea_woo_checkout_login_icon'], [ 'aria-hidden' => 'true' ] ); ?>
            </div>
			<?php wc_get_template('checkout/form-login.php', array('checkout' => WC()->checkout(),)); ?>
        </div>
	<?php }

	/**
	 * Show the login.
	 */
	public static function checkout_order_review_template() {
		$settings = self::get_settings();
		?>
		<?php do_action('woocommerce_checkout_before_order_review_heading'); ?>
		<h3 id="order_review_heading" class="woo-checkout-section-title"><?php esc_html_e( 'Your order', 'essential-addons-for-elementor-lite' ); ?></h3>

		<?php do_action('woocommerce_checkout_before_order_review'); ?>

		<div class="ea-woo-checkout-order-review">
			<?php self::checkout_order_review_default($settings); ?>
		</div>

		<?php do_action('woocommerce_checkout_after_order_review'); ?>
	<?php }

	/**
	 * Show the order review.
	 */
	public static function checkout_order_review_default($settings) {
		?>

		<div class="ea-checkout-review-order-table">
			<ul class="ea-order-review-table">
                <?php
                if( $settings['ea_woo_checkout_layout'] == 'default' ) { ?>
                    <li class="table-header">
                        <div class="table-col-1"><?php echo $settings['ea_woo_checkout_table_product_text']; ?></div>
                        <div class="table-col-2"><?php echo $settings['ea_woo_checkout_table_quantity_text']; ?></div>
                        <div class="table-col-3"><?php echo $settings['ea_woo_checkout_table_price_text']; ?></div>
                    </li>
                <?php }
                ?>

				<?php
				do_action( 'woocommerce_review_order_before_cart_contents' );

				foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
					$_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

					if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
						?>
						<li class="table-row <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">
							<div class="table-col-1 product-thum-name">
								<div class="product-thumbnail">
									<?php
									$thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );
									echo $thumbnail; // PHPCS: XSS ok.
									?>
								</div>
								<div class="product-name">
									<?php echo apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php if( $settings['ea_woo_checkout_layout'] == 'split' ) {
									    echo apply_filters( 'woocommerce_checkout_cart_item_quantity', ' <strong class="product-quantity">' . sprintf( '&times;&nbsp;%s', $cart_item['quantity'] ) . '</strong>', $cart_item, $cart_item_key );
									} // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo wc_get_formatted_cart_item_data( $cart_item ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								</div>
							</div>
                            <?php if( $settings['ea_woo_checkout_layout'] == 'default' ) { ?>
							<div class="table-col-2 product-quantity">
								<?php echo apply_filters( 'woocommerce_checkout_cart_item_quantity', ' <strong class="product-quantity">' . $cart_item['quantity'] . '</strong>', $cart_item, $cart_item_key ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</div>
                            <?php } ?>
							<div class="table-col-3 product-total">
								<?php echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</div>
						</li>
						<?php
					}
				}

				do_action( 'woocommerce_review_order_after_cart_contents' );
				?>
			</ul>

			<div class="ea-order-review-table-footer">
				<?php
				if($settings['ea_woo_checkout_shop_link'] == 'yes') { ?>
					<div class="back-to-shop">
						<a class="back-to-shopping" href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>">
							<i class="fas fa-long-arrow-alt-left"></i><?php echo $settings['ea_woo_checkout_shop_link_text']; ?>
						</a>
					</div>
				<?php } ?>

				<div class="footer-content">
					<div class="cart-subtotal">
						<div><?php esc_html_e( 'Subtotal', 'essential-addons-for-elementor-lite' ); ?></div>
						<div><?php wc_cart_totals_subtotal_html(); ?></div>
					</div>

					<?php foreach ( WC()->cart->get_coupons() as $code => $coupon ) : ?>
						<div class="cart-discount coupon-<?php echo esc_attr( sanitize_title( $code ) ); ?>">
							<div><?php wc_cart_totals_coupon_label( $coupon ); ?></div>
							<div><?php wc_cart_totals_coupon_html( $coupon ); ?></div>
						</div>
					<?php endforeach; ?>

					<?php if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) : ?>
						<?php do_action( 'woocommerce_review_order_before_shipping' ); ?>
						<div class="shipping-area">
							<?php
							WC()->cart->calculate_totals();
							wc_cart_totals_shipping_html();
							?>
						</div>
						<?php do_action( 'woocommerce_review_order_after_shipping' ); ?>
					<?php endif; ?>

					<?php foreach ( WC()->cart->get_fees() as $fee ) : ?>
						<div class="fee">
							<div><?php echo esc_html( $fee->name ); ?></div>
							<div><?php wc_cart_totals_fee_html( $fee ); ?></div>
						</div>
					<?php endforeach; ?>

					<?php if ( wc_tax_enabled() && ! WC()->cart->display_prices_including_tax() ) : ?>
						<?php if ( 'itemized' === get_option( 'woocommerce_tax_total_display' ) ) : ?>
							<?php foreach ( WC()->cart->get_tax_totals() as $code => $tax ) : // phpcs:ignore WordPress.WP.GlobalVariablesOverride.OverrideProhibited ?>
								<div class="tax-rate tax-rate-<?php echo esc_attr( sanitize_title( $code ) ); ?>">
									<div><?php echo esc_html( $tax->label ); ?></div>
									<div><?php echo wp_kses_post( $tax->formatted_amount ); ?></div>
								</div>
							<?php endforeach; ?>
						<?php else : ?>
							<div class="tax-total">
								<div><?php echo esc_html( WC()->countries->tax_or_vat() ); ?></div>
								<div><?php wc_cart_totals_taxes_total_html(); ?></div>
							</div>
						<?php endif; ?>
					<?php endif; ?>

					<?php do_action( 'woocommerce_review_order_before_order_total' ); ?>

					<div class="order-total">
						<div><?php esc_html_e( 'Total', 'essential-addons-for-elementor-lite' ); ?></div>
						<div><?php wc_cart_totals_order_total_html(); ?></div>
					</div>
				</div>
			</div>
		</div>

		<?php
	}

	/**
	 * Show the default layout.
	 */
	public static function render_default_template_($checkout, $settings) {
		?>

		<?php if( 'yes' == $settings['ea_section_woo_login_show']) : ?>
			<?php self::ea_render_login($settings); ?>
		<?php endif; ?>

		<?php
		// If checkout registration is disabled and not logged in, the user cannot checkout.
		if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
			echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
			return;
		}
		?>
		<?php do_action( 'woocommerce_before_checkout_form', $checkout ); ?>

		<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

			<?php if ( $checkout->get_checkout_fields() ) : ?>

				<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

				<div class="col2-set" id="customer_details">
					<div class="col-1">
						<?php do_action( 'woocommerce_checkout_billing' ); ?>
					</div>

					<div class="col-2">
						<?php do_action( 'woocommerce_checkout_shipping' ); ?>
					</div>
				</div>

				<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

			<?php endif; ?>

			<div class="woo-checkout-payment">
				<h3 id="payment-title" class="woo-checkout-section-title"><?php esc_html_e( 'Payment Methods', 'essential-addons-for-elementor-lite' ); ?></h3>

				<?php woocommerce_checkout_payment(); ?>
			</div>

		</form>

		<?php
		do_action('woocommerce_after_checkout_form', $checkout);

	}

	/**
	 * Added all actions
	 */
	public function ea_woo_checkout_add_actions() {
		add_action( 'woocommerce_before_checkout_form', [ $this, 'checkout_login_template' ], 10 );
		add_action( 'woocommerce_before_checkout_form', [ $this, 'checkout_coupon_template' ], 10 );
		add_action( 'woocommerce_before_checkout_form', [ $this, 'checkout_order_review_template' ], 9 );
    }
	public static function ea_render_login($settings){
		ob_start();?>
        <div class="woo-checkout-login">
            <div class="ea-login-icon">
				<?php Icons_Manager::render_icon( $settings['ea_woo_checkout_login_icon'], [ 'aria-hidden' => 'true' ] ); ?>
            </div>
			<div class="woocommerce-form-login-toggle">
            <?php wc_print_notice( apply_filters( 'woocommerce_checkout_login_message', esc_html__( 'Returning customer?', 'woocommerce' ) ) . ' <a href="#" class="showlogin">' . esc_html__( 'Click here to login', 'woocommerce' ) . '</a>', 'notice' ); ?>
        </div>
        <?php

        woocommerce_login_form(
            array(
                'message'  => esc_html__( 'If you have shopped with us before, please enter your details below. If you are a new customer, please proceed to the Billing section.', 'woocommerce' ),
                'redirect' => wc_get_checkout_url(),
                'hidden'   => true,
            )
        );?>
        </div>
		<?php echo ob_get_clean();
	}

}




