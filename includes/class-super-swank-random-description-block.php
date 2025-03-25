<?php
/**
 * Random Description Block Class
 *
 * @package     Random_Site_Description
 * @since       1.2.4
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Super_Swank_Random_Description_Block class
 */
class Super_Swank_Random_Description_Block {

	/**
	 * Instance of this class
	 *
	 * @var object
	 */
	private static $instance = null;

	/**
	 * Plugin version
	 *
	 * @var string
	 */
	private $version = '1.2.5';

	/**
	 * Plugin slug
	 *
	 * @var string
	 */
	private $slug = 'super-swank-random-description-block';

	/**
	 * Constructor
	 */
	private function __construct() {
		// Register block.
		add_action( 'init', array( $this, 'register_block' ) );

		// Register frontend scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_assets' ) );

		// Add settings link to plugins page.
		add_filter( 'plugin_action_links_random-site-description/random-site-description.php', array( $this, 'add_plugin_links' ) );
	}

	/**
	 * Get instance of this class
	 *
	 * @return object
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register the block.
	 */
	public function register_block() {
		// Register block script and style.
		$asset_file = include plugin_dir_path( dirname( __FILE__ ) ) . 'build/index.asset.php';

		wp_register_script(
			$this->slug . '-editor',
			plugins_url( 'build/index.js', dirname( __FILE__ ) ),
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_register_style(
			$this->slug . '-editor',
			plugins_url( 'build/index.css', dirname( __FILE__ ) ),
			array(),
			$this->version
		);

		wp_register_style(
			$this->slug,
			plugins_url( 'build/style-index.css', dirname( __FILE__ ) ),
			array(),
			$this->version
		);

		// Register block.
		register_block_type_from_metadata(
			plugin_dir_path( dirname( __FILE__ ) ) . 'src/blocks/random-description',
			array(
				'editor_script'   => $this->slug . '-editor',
				'editor_style'    => $this->slug . '-editor',
				'style'           => $this->slug,
				'render_callback' => array( $this, 'render_block' ),
			)
		);

		// Set translations.
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( $this->slug . '-editor', 'super-swank-random-description-block', plugin_dir_path( dirname( __FILE__ ) ) . 'languages' );
		}
	}

	/**
	 * Register frontend assets.
	 */
	public function register_frontend_assets() {
		$asset_file = include plugin_dir_path( dirname( __FILE__ ) ) . 'build/frontend.asset.php';

		wp_register_script(
			$this->slug . '-frontend',
			plugins_url( 'build/frontend.js', dirname( __FILE__ ) ),
			array(),
			$asset_file['version'],
			true
		);
		
		// Automatically enqueue the script if we're not in the admin area
		if ( ! is_admin() && has_blocks() ) {
			wp_enqueue_script( $this->slug . '-frontend' );
		}
	}

	/**
	 * Render the block on the server side.
	 *
	 * @param array $attributes Block attributes.
	 * @param string $content Block content.
	 * @return string Block content.
	 */
	public function render_block( $attributes, $content ) {
		// Extract the attributes
		$class_name     = isset( $attributes['className'] ) ? $attributes['className'] : '';
		$style          = isset( $attributes['style'] ) ? $this->get_styles( $attributes['style'] ) : '';
		$align          = isset( $attributes['align'] ) ? 'align' . $attributes['align'] : '';
		$descriptions   = isset( $attributes['descriptions'] ) ? $attributes['descriptions'] : array();
		$interval       = isset( $attributes['interval'] ) ? intval( $attributes['interval'] ) : 5000;
		$animation      = isset( $attributes['animation'] ) ? $attributes['animation'] : 'fade';
		$current_description = isset( $descriptions[0] ) ? $descriptions[0] : '';

		// Add the align class if it exists
		if ( ! empty( $align ) ) {
			$class_name .= ' ' . $align;
		}

		// Encode the descriptions for use in data attribute
		$descriptions_json = htmlspecialchars( wp_json_encode( $descriptions ), ENT_QUOTES, 'UTF-8' );

		// Build the block HTML with accessibility attributes
		$html = sprintf(
			'<div class="wp-block-super-swank-random-description %1$s" style="%2$s" data-interval="%3$s" data-animation="%4$s" data-descriptions="%5$s" aria-live="polite" role="region" aria-label="Changing site description">
				<div class="random-description-content">
					<p>%6$s</p>
				</div>
			</div>',
			esc_attr( $class_name ),
			esc_attr( $style ),
			esc_attr( $interval ),
			esc_attr( $animation ),
			$descriptions_json,
			esc_html( $current_description )
		);

		return $html;
	}

	/**
	 * Build CSS styles from block attributes.
	 *
	 * @param array $attributes Block attributes.
	 * @return string Inline CSS styles.
	 */
	private function build_styles( $attributes ) {
		$styles = array();

		// Get style attribute
		$style = isset( $attributes['style'] ) ? $attributes['style'] : array();
		
		// Handle spacing styles
		if ( isset( $style['spacing'] ) ) {
			$spacing = $style['spacing'];
			
			// Handle padding
			if ( isset( $spacing['padding'] ) ) {
				foreach ( $spacing['padding'] as $side => $value ) {
					// Convert var:preset|spacing|60 to var(--wp--preset--spacing--60)
					if ( strpos( $value, 'var:preset|spacing|' ) === 0 ) {
						$spacing_value = str_replace( 'var:preset|spacing|', '', $value );
						$value = sprintf( 'var(--wp--preset--spacing--%s)', $spacing_value );
					}
					$styles[] = sprintf( 'padding-%s: %s', $side, $value );
				}
			}
			
			// Handle margin
			if ( isset( $spacing['margin'] ) ) {
				foreach ( $spacing['margin'] as $side => $value ) {
					// Convert var:preset|spacing|60 to var(--wp--preset--spacing--60)
					if ( strpos( $value, 'var:preset|spacing|' ) === 0 ) {
						$spacing_value = str_replace( 'var:preset|spacing|', '', $value );
						$value = sprintf( 'var(--wp--preset--spacing--%s)', $spacing_value );
					}
					$styles[] = sprintf( 'margin-%s: %s', $side, $value );
				}
			}
		}

		return ! empty( $styles ) ? implode( '; ', $styles ) : '';
	}

	/**
	 * Add links to plugin action links.
	 *
	 * @param array $links Existing links.
	 * @return array Modified links.
	 */
	public function add_plugin_links( $links ) {
		$plugin_links = array(
			'<a href="https://wordpress.org/support/plugin/random-site-description/" target="_blank">' . __( 'Support', 'super-swank-random-description-block' ) . '</a>',
		);
		return array_merge( $plugin_links, $links );
	}

}

// Initialize the class.
Super_Swank_Random_Description_Block::get_instance();