<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://edequalsaweso.me
 * @since             1.2
 * @package           Random_Site_Description
 *
 * @wordpress-plugin
 * Plugin Name:       Awesome Random Description Block
 * Plugin URI:        https://edequalsaweso.me/random-site-description
 * Description:       This will add a block that can cycle through a bunch of different site descriptions for you every time the page is reloaded
 * Version:           1.5.0
 * Author:            eD! Thomas
 * Author URI:        https://edequalsaweso.me/
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       awesome-random-description-block
 * Domain Path:       /languages
 */
 
// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants
define( 'SUPER_SWANK_RANDOM_SITE_DESCRIPTION_VERSION', '1.5.0' );
define( 'SUPER_SWANK_RANDOM_DESCRIPTION_BLOCK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SUPER_SWANK_RANDOM_DESCRIPTION_BLOCK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'SUPER_SWANK_RANDOM_DESCRIPTION_BLOCK_PLUGIN_FILE', __FILE__ );
define( 'SUPER_SWANK_RANDOM_DESCRIPTION_BLOCK_PLUGIN_BASE', plugin_basename( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 */
function activate_super_swank_random_description_block() {
	// Add any activation functionality here if needed
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_super_swank_random_description_block() {
	// Add any deactivation functionality here if needed
}

register_activation_hook( __FILE__, 'activate_super_swank_random_description_block' );
register_deactivation_hook( __FILE__, 'deactivate_super_swank_random_description_block' );

/**
 * Load plugin text domain for translations.
 */
function super_swank_random_description_block_load_textdomain() {
	load_plugin_textdomain( 'awesome-random-description-block', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'super_swank_random_description_block_load_textdomain' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require_once SUPER_SWANK_RANDOM_DESCRIPTION_BLOCK_PLUGIN_DIR . 'includes/class-awesome-random-description-block.php';