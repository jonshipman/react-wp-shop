<?php
/**
 * Square UP GQL registration
 *
 * @package React Build
 * @since 1.0.0
 */

/**
 * Registers the fields to query the sqaure settings.
 *
 * @return void.
 */
function rbld_register_square_field() {
	$wc_square_access_tokens                 = get_option( 'wc_square_access_tokens' );
	$wc_square_settings                      = get_option( 'wc_square_settings' );
	$woocommerce_square_credit_card_settings = get_option( 'woocommerce_square_credit_card_settings' );
	$wc_square_access_tokens                 = get_option( 'wc_square_access_tokens' );

	$square_settings = array(
		'wc_square_access_tokens'                 => $wc_square_access_tokens,
		'wc_square_settings'                      => $wc_square_settings,
		'woocommerce_square_credit_card_settings' => $woocommerce_square_credit_card_settings,
		'wc_square_access_tokens'                 => $wc_square_access_tokens,
	);

	register_graphql_object_type(
		'Square',
		array(
			'fields'      => array(),
			'description' => __( 'Square WooCommerce Settings', 'react-build' ),
		)
	);

	register_graphql_field(
		'RootQuery',
		'Square',
		array(
			'type'        => 'Square',
			'description' => __( 'Square WooCommerce Settings', 'react-build' ),
			'fields'      => array(),
			'resolve'     => function( $root, $args, $context, $info ) use ( $square_settings ) {
				return $square_settings;
			},
		)
	);

	$fields = array();

	foreach ( $square_settings as $option => $settings ) {
		$settings = maybe_unserialize( $settings );

		if ( is_array( $settings ) ) {
			foreach ( $settings as $_key => $value ) {
				if ( is_string( $value ) ) {
					$type = 'String';

					if ( 'no' === $value ) {
						$value = false;
						$type  = 'Boolean';
					}

					if ( 'yes' === $value ) {
						$value = true;
						$type  = 'Boolean';
					}

					$fields[ wp_boilerplate_nodes_camel_case( $_key ) ] = array(
						'type'        => $type,
						'description' => __( 'Square setting', 'react-build' ),
						'resolve'     => function() use ( $value ) {
							return $value;
						},
					);
				}
			}
		} else {
			$fields[ wp_boilerplate_nodes_camel_case( $option ) ] = array(
				'type'        => 'String',
				'description' => __( 'Square setting', 'react-build' ),
				'resolve'     => function() use ( $settings ) {
					return $settings;
				},
			);
		}
	}

	$fields['productionApplicationId'] = array(
		'type'        => 'String',
		'description' => __( 'Square setting', 'react-build' ),
		'resolve'     => function() use ( $settings ) {
			$square_application_id = 'sq0idp-wGVapF8sNt9PLrdj5znuKA';
			return apply_filters( 'wc_square_application_id', $square_application_id );
		},
	);

	$required = array( 'production', 'sandbox', 'sandboxApplicationId', 'productionLocationId', 'sandboxLocationId' );
	foreach ( $required as $r ) {
		if ( ! in_array( $r, array_keys( $fields ), true ) ) {
			$fields[ $r ] = array(
				'type'        => 'String',
				'description' => __( 'Square setting', 'react-build' ),
				'resolve'     => function() {
					return '';
				},
			);
		}
	}

	register_graphql_fields( 'Square', $fields );
}

add_action( 'graphql_register_types', 'rbld_register_square_field' );

/**
 * Converts the metaData input into $_POST
 *
 * @return void
 */
function rbld_square_post_update() {
	global $_POST;
	$json = file_get_contents( 'php://input' );
	$data = json_decode( $json );

	foreach ( $data as $key => $value ) {
		if ( 0 === strpos( $key, 'wc_' ) || 0 === strpos( $key, 'wc-' ) ) {
			$_POST[ $key ] = $value;
		}
	}
}

add_action( 'woocommerce_checkout_process', 'rbld_square_post_update' );
