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
	 * @return string Block content.
	 */
	public function render_block( $attributes ) {
		// Enqueue the frontend script.
		wp_enqueue_script( $this->slug . '-frontend' );

		// Get taglines from attributes.
		$taglines = isset( $attributes['taglines'] ) ? $attributes['taglines'] : array();

		// If we have no taglines, try to use the site tagline.
		if ( empty( $taglines ) ) {
			$site_description = get_bloginfo( 'description' );
			if ( ! empty( $site_description ) ) {
				$taglines = array( $site_description );
			}
		}

		// If still no taglines, return empty content.
		if ( empty( $taglines ) ) {
			return '';
		}

		// Get first tagline as placeholder.
		$first_tagline = $taglines[0];

		// Build styles.
		$styles = $this->build_styles( $attributes );

		// Build class names.
		$class_names = array('wp-block-random-description');
		
		// Add alignment class if set
		if ( isset( $attributes['align'] ) ) {
			$class_names[] = 'align' . $attributes['align'];
		}
		
		// Add text alignment class if set
		if ( isset( $attributes['textAlign'] ) ) {
			$class_names[] = 'has-text-align-' . $attributes['textAlign'];
		}
		
		// Add custom className if set
		if ( isset( $attributes['className'] ) ) {
			$class_names[] = $attributes['className'];
		}

		// Add block style class if set
		if ( isset( $attributes['style']['className'] ) ) {
			$class_names[] = $attributes['style']['className'];
		}

		// Encode taglines for front-end JavaScript.
		$taglines_json = htmlspecialchars( json_encode( $taglines ), ENT_QUOTES, 'UTF-8' );

		// Build HTML.
		$html = sprintf(
			'<div class="%1$s" style="%2$s" data-taglines="%3$s">
				<div class="random-description-content">
					<p>%4$s</p>
				</div>
			</div>',
			esc_attr( implode( ' ', $class_names ) ),
			esc_attr( $styles ),
			$taglines_json,
			esc_html( $first_tagline )
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
		if ( ! empty( $style['spacing'] ) ) {
			$spacing = $style['spacing'];

			// Handle padding
			if ( ! empty( $spacing['padding'] ) ) {
				$padding = $spacing['padding'];
				$padding_css = '';

				$padding_css .= isset( $padding['top'] ) ? $padding['top'] . ' ' : '0 ';
				$padding_css .= isset( $padding['right'] ) ? $padding['right'] . ' ' : '0 ';
				$padding_css .= isset( $padding['bottom'] ) ? $padding['bottom'] . ' ' : '0 ';
				$padding_css .= isset( $padding['left'] ) ? $padding['left'] : '0';

				$styles[] = 'padding:' . $padding_css;
			}

			// Handle margin
			if ( ! empty( $spacing['margin'] ) ) {
				$margin = $spacing['margin'];
				$margin_css = '';

				$margin_css .= isset( $margin['top'] ) ? $margin['top'] . ' ' : '0 ';
				$margin_css .= '0 '; // Right margin is not supported
				$margin_css .= isset( $margin['bottom'] ) ? $margin['bottom'] . ' ' : '0 ';
				$margin_css .= '0'; // Left margin is not supported

				$styles[] = 'margin:' . $margin_css;
			}
		}

		return implode( ';', $styles );
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