<?php
/**
 * WAPO Premium Class
 *
 * @author  Corrado Porzio <corradoporzio@gmail.com>
 * @package YITH\ProductAddOns
 * @version 2.0.0
 */

defined( 'YITH_WAPO' ) || exit; // Exit if accessed directly.

if ( ! class_exists( 'YITH_WAPO_Premium' ) ) {

	/**
	 *  YITH_WAPO Premium Class
	 */
	class YITH_WAPO_Premium extends YITH_WAPO {

		/**
		 * Get available addon types
		 *
		 * @return array
		 * @since 2.0.0
		 */
		public function get_available_addon_types() {
			$available_addon_types = array( 'checkbox', 'radio', 'text', 'textarea', 'color', 'number', 'select', 'label', 'product', 'date', 'file' );
			if ( defined( 'YITH_WAPO_PREMIUM' ) && YITH_WAPO_PREMIUM ) {
				return $available_addon_types;
			}
			return array();
		}

	}
}
