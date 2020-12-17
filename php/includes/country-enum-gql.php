<?php
/**
 * Get Countries
 *
 * @package React Build
 * @since 1.0.0
 */

/**
 * Registers the Country objtype and Countries field.
 *
 * @return void
 */
function rbld_register_countries() {
	register_graphql_object_type(
		'Country',
		array(
			'fields'      => array(
				'abbr' => array(
					'description' => __( 'Country Abbreviation', 'react-build' ),
					'type'        => 'String',
				),
				'name' => array(
					'description' => __( 'Country Name', 'react-build' ),
					'type'        => 'String',
				),
			),
			'description' => __( 'A country\'s name and abbreviation', 'react-build' ),
		)
	);

	register_graphql_field(
		'RootQuery',
		'Countries',
		array(
			'type'        => array( 'list_of' => 'Country' ),
			'description' => __( 'Countries and their abbreviations', 'react-build' ),
			'fields'      => array(),
			'resolve'     => function( $root, $args, $context, $info ) {
				$wc_countries = new \WC_Countries();
				$countries    = $wc_countries->get_countries();
				$us_value = null;

				array_walk(
					$countries,
					function( &$value, $code ) use ( &$us_value ) {
						$_value = array(
							'abbr' => $code,
							'name' => $value,
						);

						if ( 'US' === $code ) {
							$us_value = $_value;
						} else {
							$value = $_value;
						}
					}
				);

				array_unshift( $countries, $us_value );

				return $countries;
			},
		)
	);
}

add_action( 'graphql_register_types', 'rbld_register_countries' );
