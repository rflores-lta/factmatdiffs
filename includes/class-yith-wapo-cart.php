<?php
/**
 * WAPO Cart Class
 *
 * @author  Corrado Porzio <corradoporzio@gmail.com>
 * @package YITH\ProductAddOns
 * @version 2.0.0
 */

defined( 'YITH_WAPO' ) || exit; // Exit if accessed directly.

if ( ! class_exists( 'YITH_WAPO_Cart' ) ) {

	/**
	 *  YITH_WAPO Cart Class
	 */
	class YITH_WAPO_Cart {

		/**
		 * Single instance of the class
		 *
		 * @var YITH_WAPO_Instance
		 */
		public static $instance;

		/**
		 * Returns single instance of the class
		 *
		 * @return YITH_WAPO_Instance
		 */
		public static function get_instance() {
			return ! is_null( self::$instance ) ? self::$instance : self::$instance = new self();
		}

		/**
		 * Constructor
		 */
		public function __construct() {

			// Loop add to cart button.
			if ( 'select' === get_option( 'yith_wapo_button_in_shop' ) ) {
				add_filter( 'woocommerce_product_add_to_cart_url', array( $this, 'add_to_cart_url' ), 50, 1 );
				add_action( 'woocommerce_product_add_to_cart_text', array( $this, 'add_to_cart_text' ), 10, 1 );
				add_filter( 'woocommerce_add_to_cart_validation', array( $this, 'add_to_cart_validation' ), 50, 2 );
			}

			// Add options to cart item.
			add_filter( 'woocommerce_add_cart_item_data', array( $this, 'add_cart_item_data' ), 25, 2 );
			// Display custom product thumbnail in cart.
			if ( 'yes' === get_option( 'yith_wapo_show_image_in_cart', 'no' ) ) {
				add_filter( 'woocommerce_cart_item_thumbnail', array( $this, 'cart_item_thumbnail' ), 10, 3 );
			}
			// Display options in cart and checkout page.
			add_filter( 'woocommerce_get_item_data', array( $this, 'get_item_data' ), 25, 2 );
			// Before calculate totals.
			add_action( 'woocommerce_before_calculate_totals', array( $this, 'before_calculate_totals' ), 9999, 1 );
			// Update cart total
			// add_filter( 'woocommerce_calculated_total', array( $this, 'custom_calculated_total' ), 10, 2 );
			// Add order item meta.
			add_action( 'woocommerce_add_order_item_meta', array( $this, 'add_order_item_meta' ), 10, 3 );
		}

		/**
		 * Add to cart validation
		 *
		 * @param bool $passed Passed.
		 * @param int  $product_id Product ID.
		 * @return false|mixed
		 */
		public function add_to_cart_validation( $passed, $product_id ) {

			// Disable add_to_cart_button class on shop page.
			if ( is_ajax() && ! isset( $_REQUEST['yith_wapo_is_single'] ) && yith_wapo_product_has_blocks( $product_id ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				return false;
			}

			return $passed;
		}

		/**
		 * Set the data for the cart item in cart object.
		 *
		 * @param array $cart_item_data Cart item data.
		 * @param int   $product_id Product ID.
		 * @param array $post_data Post data.
		 * @param bool  $sold_individually Sold individually.
		 * @return mixed
		 */
		public function add_cart_item_data( $cart_item_data, $product_id, $post_data = null, $sold_individually = false ) {
			if ( is_null( $post_data ) ) {
				$post_data = $_POST; // phpcs:ignore WordPress.Security.NonceVerification.Missing
			}
			$data = array();
			if ( isset( $post_data['yith_wapo'] ) && is_array( $post_data['yith_wapo'] ) ) {
				$cart_item_data['yith_wapo_product_img'] = $post_data['yith_wapo_product_img'];
				foreach ( $post_data['yith_wapo'] as $index => $option ) {
					foreach ( $option as $key => $value ) {
						$cart_item_data['yith_wapo_options'][ $index ][ $key ] = $value;
						$data[ $key ] = $value;
					}
				}
			}
			return $cart_item_data;
		}

		/**
		 * Change the product image with the addon one (if selected).
		 *
		 * @param string $_product_img Product image.
		 * @param array  $cart_item Cart item.
		 * @param string $cart_item_key Cart item key.
		 * @return mixed|string
		 */
		public function cart_item_thumbnail( $_product_img, $cart_item, $cart_item_key ) {
			if ( isset( $cart_item['yith_wapo_product_img'] ) ) {
				$image_url = $cart_item['yith_wapo_product_img'];
				if ( ! empty( $image_url ) ) {
					return '<img src="' . $image_url . '" />';
				}
			}
			return $_product_img;
		}

		/**
		 * Update cart items info.
		 *
		 * @param array $cart_data Cart data.
		 * @param array $cart_item Cart item.
		 * @return mixed
		 */
		public function get_item_data( $cart_data, $cart_item ) {

			// Avoid show addons of child products of YITH Composite Products.
			if ( isset( $cart_item['yith_wcp_child_component_data'] ) ) {
				return $cart_data;
			}

			if ( ! empty( $cart_item['yith_wapo_options'] ) ) {
				// $total_options_price = 0; phpcs:ignore Squiz.PHP.CommentedOutCode.Found
				$cart_data_array          = array();
				$first_free_options_count = 0;
				$currency_rate            = yith_wapo_get_currency_rate();
				foreach ( $cart_item['yith_wapo_options'] as $index => $option ) {
					foreach ( $option as $key => $value ) {
						if ( $key && '' !== $value ) {

							$explode = explode( '-', $key );
							if ( isset( $explode[1] ) ) {
								$addon_id  = $explode[0];
								$option_id = $explode[1];
							} else {
								$addon_id  = $key;
								$option_id = $value;
							}

							$info = yith_wapo_get_option_info( $addon_id, $option_id );

							if ( 'percentage' === $info['price_type'] ) {
								$_product = wc_get_product( $cart_item['product_id'] );
								// WooCommerce Measurement Price Calculator (compatibility).
								if ( isset( $cart_item['pricing_item_meta_data']['_price'] ) ) {
									$product_price = $cart_item['pricing_item_meta_data']['_price']; } else {
									$product_price = floatval( $_product->get_price() ); }

									$option_percentage      = floatval( $info['price'] );
									$option_percentage_sale = floatval( $info['price_sale'] );
									$option_price           = ( $product_price / 100 ) * $option_percentage;
									$option_price_sale      = ( $product_price / 100 ) * $option_percentage_sale;
							} elseif ( 'multiplied' === $info['price_type'] ) {
								$option_price      = floatval( $info['price'] ) * (float) $value * (float) $currency_rate;
								$option_price_sale = floatval( $info['price'] ) * (float) $value * (float) $currency_rate;
							} elseif ( 'characters' === $info['price_type'] ) {
								$option_price      = floatval( $info['price'] ) * strlen( $value ) * (float) $currency_rate;
								$option_price_sale = floatval( $info['price'] ) * strlen( $value ) * (float) $currency_rate;
							} else {
								$option_price      = floatval( $info['price'] ) * (float) $currency_rate;
								$option_price_sale = floatval( $info['price_sale'] ) * (float) $currency_rate;
							}

							$sign = 'decrease' === $info['price_method'] ? '-' : '+';

							// First X free options check.
							if ( 'yes' === $info['addon_first_options_selected'] && $first_free_options_count < $info['addon_first_free_options'] ) {
								$option_price = 0;
								$first_free_options_count++;
							} else {
								$option_price = $option_price_sale > 0 ? $option_price_sale : $option_price;
							}

							$cart_data_name = $info['addon_label'] ?? '';

							if ( in_array( $info['addon_type'], array( 'checkbox', 'color', 'label', 'radio', 'select' ), true ) ) {
								$value = ! empty( $info['label'] ) ? $info['label'] : ( $info['tooltip'] ?? '' );
							} elseif ( 'product' === $info['addon_type'] ) {
								$option_product_info = explode( '-', $value );
								$option_product_id   = $option_product_info[1];
								$option_product_qty  = $option_product_info[2];
								$option_product      = wc_get_product( $option_product_id );
								$value               = $option_product->get_title();

								// product prices.
								$product_price = $option_product->get_price();
								if ( 'product' === $info['price_method'] ) {
									$option_price = $product_price;
								} elseif ( 'discount' === $info['price_method'] ) {
									$option_discount_value = $option_price;
									$option_price          = $product_price - $option_discount_value;
									if ( 'percentage' === $info['price_type'] ) {
										$option_price = $product_price - ( ( $product_price / 100 ) * $option_discount_value );
									}
								}
							} elseif ( 'file' === $info['addon_type'] ) {
								$file_url = explode( '/', $value );
								$value    = '<a href="' . $value . '" target="_blank">' . end( $file_url ) . '</a>';
							} else {
								$cart_data_name = $info['label'];
							}

							$option_price = '' !== $option_price ? ( $option_price + ( ( $option_price / 100 ) * yith_wapo_get_tax_rate() ) ) : 0;

							if ( 'yes' === get_option( 'yith_wapo_show_options_in_cart' ) ) {
								if ( ! isset( $cart_data_array[ $cart_data_name ] ) ) {
									$cart_data_array[ $cart_data_name ] = '';
								}
								$cart_data_array[ $cart_data_name ] .= '<div>' . $value . ( '' !== $option_price && floatval( 0 ) !== $option_price ? ' (' . $sign . wc_price( $option_price ) . ')' : '' ) . '</div>';
							}

							if ( ! apply_filters( 'yith_wapo_show_options_grouped_in_cart', true ) ) {
								$cart_data[] = array(
									'name'    => $info['label'],
									'display' => $value,
								);
							}
						}
					}
				}
				if ( apply_filters( 'yith_wapo_show_options_grouped_in_cart', true ) ) {
					foreach ( $cart_data_array as $key => $value ) {
						$key = rtrim( $key, ':' );
						if ( '' === $key ) {
							$key = __( 'Option', 'yith-woocommerce-product-add-ons' );
						}
						$cart_data[] = array(
							'name'    => $key,
							'display' => $value,
						);
					}
				}
			}
			return $cart_data;
		}

		// Calculate cart items prices.

		/**
		 * Before calculate totals
		 *
		 * @param object $cart Cart.
		 */
		public function before_calculate_totals( $cart ) {

			// This is necessary for WC 3.0+.
			if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
				return; }

			// Avoiding hook repetition (when using price calculations for example).
			// if ( did_action( 'woocommerce_before_calculate_totals' ) >= 2 ) { return; }.

			// Loop through cart items.
			foreach ( $cart->get_cart() as $cart_item ) {

				// Avoid sum addons price of child products of YITH Composite Products.
				if ( isset( $cart_item['yith_wcp_child_component_data'] ) ) {
					continue;
				}

				// Avoid sum addons price of child products of YITH Product Bundles.
				if ( isset( $cart_item['bundled_by'] ) ) {
					continue;
				}

				$wapo_price = yit_get_prop( $cart_item['data'], 'yith_wapo_price' );
				if ( ! empty( $cart_item['yith_wapo_options'] ) && ! $wapo_price ) {
					$total_options_price      = 0;
					$first_free_options_count = 0;
					$currency_rate            = yith_wapo_get_currency_rate();
					foreach ( $cart_item['yith_wapo_options'] as $index => $option ) {
						foreach ( $option as $key => $value ) {
							if ( $key && '' !== $value ) {

								$explode = explode( '-', $key );
								if ( isset( $explode[1] ) ) {
									$addon_id  = $explode[0];
									$option_id = $explode[1];
								} else {
									$addon_id  = $key;
									$option_id = $value;
								}

								$info = yith_wapo_get_option_info( $addon_id, $option_id );

								if ( 'percentage' === $info['price_type'] ) {
									$_product = wc_get_product( $cart_item['product_id'] );
									// WooCommerce Measurement Price Calculator (compatibility).
									if ( isset( $cart_item['pricing_item_meta_data']['_price'] ) ) {
										$product_price = $cart_item['pricing_item_meta_data']['_price'];
									} else {
										$product_price = floatval( $_product->get_price() );
									}
									$option_percentage      = floatval( $info['price'] );
									$option_percentage_sale = floatval( $info['price_sale'] );
									$option_price           = ( $product_price / 100 ) * $option_percentage;
									$option_price_sale      = ( $product_price / 100 ) * $option_percentage_sale;
								} elseif ( 'multiplied' === $info['price_type'] ) {
									$option_price      = (float) $info['price'] * (float) $value;
									$option_price_sale = (float) $info['price'] * (float) $value;
								} elseif ( 'characters' === $info['price_type'] ) {
									$option_price      = (float) $info['price'] * strlen( $value );
									$option_price_sale = (float) $info['price'] * strlen( $value );
								} else {
									$option_price      = (float) $info['price'];
									$option_price_sale = (float) $info['price_sale'];
								}

								// First X free options check.
								if ( 'yes' === $info['addon_first_options_selected'] && $first_free_options_count < $info['addon_first_free_options'] ) {
									$first_free_options_count++;
								} else {
									$option_price = $option_price_sale > 0 ? $option_price_sale : $option_price;

									if ( 'product' === $info['addon_type'] && ( 'product' === $info['price_method'] || 'discount' === $info['price_method'] ) ) {
										$option_product_info = explode( '-', $value );
										$option_product_id   = $option_product_info[1];
										$option_product_qty  = $option_product_info[2];
										$option_product      = wc_get_product( $option_product_id );
										$value               = $option_product->get_title();
										$product_price       = $option_product->get_price();
										if ( 'product' === $info['price_method'] ) {
											$option_price = $product_price;
										} elseif ( 'discount' === $info['price_method'] ) {
											$option_discount_value = $option_price;
											$option_price          = $product_price - $option_discount_value;
											if ( 'percentage' === $info['price_type'] ) {
												$option_price = $product_price - ( ( $product_price / 100 ) * $option_discount_value );
											}
										}
										$total_options_price += floatval( $option_price );

									} elseif ( 'decrease' === $info['price_method'] ) {
										$total_options_price -= floatval( $option_price );
									} else {
										$total_options_price += floatval( $option_price );
									}
								}
							}
						}
					}

					$cart_item_price     = $cart_item['data']->get_price() / $currency_rate;
					$total_options_price = $total_options_price / $currency_rate;

					/* phpcs:ignore Squiz.PHP.CommentedOutCode.Found
					 * Multi Currency test
					var_dump( $cart_item_price, $total_options_price );
					add_action( 'yith_wcmcs_pre_product_price', function( $cart_item_price, $total_options_price ) {
						return $cart_item_price + $total_options_price;
					}, 10, 3 );
					*/

					$cart_item['data']->set_price( $cart_item_price + $total_options_price );
					yit_set_prop( $cart_item['data'], 'yith_wapo_price', true );

				}
			}

		}

		/**
		 * Add order item meta
		 *
		 * @param int    $item_id Item ID.
		 * @param array  $cart_item Cart item.
		 * @param string $cart_item_key Cart item key.
		 */
		public function add_order_item_meta( $item_id, $cart_item, $cart_item_key ) {
			if ( isset( $cart_item['yith_wapo_options'] ) && ! isset( $cart_item['yith_wcp_child_component_data'] ) ) {
				foreach ( $cart_item['yith_wapo_options'] as $index => $option ) {
					foreach ( $option as $key => $value ) {
						if ( $key && '' !== $value ) {

							$explode = explode( '-', $key );
							if ( isset( $explode[1] ) ) {
								$addon_id  = $explode[0];
								$option_id = $explode[1];
							} else {
								$addon_id  = $key;
								$option_id = $value;
							}

							$info = yith_wapo_get_option_info( $addon_id, $option_id );

							if ( 'percentage' === $info['price_type'] ) {
								$_product = wc_get_product( $cart_item['product_id'] );
								// WooCommerce Measurement Price Calculator (compatibility).
								if ( isset( $cart_item['pricing_item_meta_data']['_price'] ) ) {
									$product_price = $cart_item['pricing_item_meta_data']['_price'];
								} else {
									$product_price = floatval( $_product->get_price() );
								}
								$option_percentage      = floatval( $info['price'] );
								$option_percentage_sale = floatval( $info['price_sale'] );
								$option_price           = ( $product_price / 100 ) * $option_percentage;
								$option_price_sale      = ( $product_price / 100 ) * $option_percentage_sale;
							} elseif ( 'multiplied' === $info['price_type'] ) {
								$option_price      = $info['price'] * $value;
								$option_price_sale = $info['price'] * $value;
							} elseif ( 'characters' === $info['price_type'] ) {
								$option_price      = $info['price'] * strlen( $value );
								$option_price_sale = $info['price'] * strlen( $value );
							} else {
								$option_price      = $info['price'];
								$option_price_sale = $info['price_sale'];
							}

							$sign = 'decrease' === $info['price_method'] ? '-' : '+';

							$option_price = $option_price_sale > 0 ? $option_price_sale : $option_price;

							$name = ( ( isset( $info['addon_label'] ) && '' !== $info['addon_label'] ) ? $info['addon_label'] : '' );

							if ( in_array( $info['addon_type'], array( 'checkbox', 'color', 'label', 'radio', 'select' ), true ) ) {
								$value = rtrim( $info['label'], ':' );
							} elseif ( in_array( $info['addon_type'], array( 'product' ), true ) ) {
								$option_product_info = explode( '-', $value );
								$option_product_id   = $option_product_info[1];
								$option_product_qty  = $option_product_info[2];
								$option_product      = wc_get_product( $option_product_id );
								$value               = $option_product->get_title();

								// Product prices.
								$product_price = $option_product->get_price();
								if ( 'product' === $info['price_method'] ) {
									$option_price = $product_price;
								} elseif ( 'discount' === $info['price_method'] ) {
									$option_discount_value = $option_price;
									$option_price          = $product_price - $option_discount_value;
									if ( 'percentage' === $info['price_type'] ) {
										$option_price = $product_price - ( ( $product_price / 100 ) * $option_discount_value );
									}
								}

								// Stock.
								if ( $option_product->get_manage_stock() ) {
									$qty       = ( isset( $cart_item['quantity'] ) && $cart_item['quantity'] > 1 ) ? $cart_item['quantity'] : 1;
									$stock_qty = $option_product->get_stock_quantity() - $qty;
									wc_update_product_stock( $option_product, $stock_qty, 'set' );
									wc_delete_product_transients( $option_product );
								}
							} elseif ( 'file' === $info['addon_type'] ) {
								$file_url = explode( '/', $value );
								$value    = '<a href="' . $value . '" target="_blank">' . end( $file_url ) . '</a>';
							} else {
								$name = rtrim( $info['label'], ':' );
							}

							if ( '' === $name ) {
								$name = __( 'Option', 'yith-woocommerce-product-add-ons' );
							}

							$display_value = $value . ( '' !== $option_price && floatval( 0 ) !== $option_price ? ' (' . $sign . wc_price( $option_price ) . ')' : '' );

							wc_add_order_item_meta( $item_id, $name, $display_value );
						}
					}
				}
			}
		}

		/**
		 * Add to cart URL
		 *
		 * @param string $url URL.
		 * @return false|string|WP_Error
		 */
		public function add_to_cart_url( string $url = '' ) {
			global $product;
			$product_id = yit_get_base_product_id( $product );
			if ( yith_wapo_product_has_blocks( $product_id ) ) {
				return get_permalink( $product_id );
			}
			return $url;
		}

		/**
		 * Add to cart text
		 *
		 * @param string $text Text.
		 * @return false|mixed|string|void
		 */
		public function add_to_cart_text( string $text = '' ) {
			global $product, $post;
			if ( is_object( $product ) && ! is_single( $post ) && yith_wapo_product_has_blocks( $product->get_id() ) ) {
				return get_option( 'yith_wapo_select_options_label', 'Select options' );
			}
			return $text;
		}

	}
}

/**
 * Unique access to instance of YITH_WAPO_Cart class
 *
 * @return YITH_WAPO_Cart
 */
function YITH_WAPO_Cart() { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.FunctionNameInvalid
	return YITH_WAPO_Cart::get_instance();
}
