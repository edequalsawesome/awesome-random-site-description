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
 * Plugin Name:       Super-Swank Random Description Block
 * Plugin URI:        https://edequalsaweso.me/random-site-description
 * Description:       This will add a block that can cycle through a bunch of different site descriptions for you every time the page is reloaded
 * Version:           1.2.4
 * Author:            eD! Thomas
 * Author URI:        https://edequalsaweso.me/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       random-description-block
 * Domain Path:       /languages
 */
 
function register_random_description_block() {
     // Register the block script
     wp_register_script(
         'random-description-block',
         // References the JS file relative to this plugin file
         plugin_dir_url(__FILE__) . 'js/random-description-block.js',
         array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ),
         filemtime(plugin_dir_path(__FILE__) . 'js/random-description-block.js')
     );
 
     // Register the block style for the editor
     wp_register_style(
         'random-description-block-editor',
         // References the CSS file relative to this plugin file
         plugin_dir_url(__FILE__) . 'css/random-description-block-editor.css',
         array( 'wp-edit-blocks' ),
         filemtime(plugin_dir_path(__FILE__) . 'css/random-description-block-editor.css')
     );
 
     // Register the block style for the frontend
     wp_register_style(
         'random-description-block',
         // References the CSS file relative to this plugin file
         plugin_dir_url(__FILE__) . 'css/random-description-block.css',
         array(),
         filemtime(plugin_dir_path(__FILE__) . 'css/random-description-block.css')
     );
     
     // Register the frontend script
     wp_register_script(
         'random-description-frontend',
         plugin_dir_url(__FILE__) . 'js/random-description-frontend.js',
         array('jquery'),
         filemtime(plugin_dir_path(__FILE__) . 'js/random-description-frontend.js'),
         true
     );

     // Register the block
     register_block_type( 'custom/superswank-random-description', array(
         'editor_script' => 'random-description-block',
         'editor_style' => 'random-description-block-editor',
         'style' => 'random-description-block',
         'render_callback' => 'render_random_description_block',
         'attributes' => array(
             'descriptions' => array(
                 'type' => 'array',
                 'default' => array('')
             ),
             'className' => array(
                 'type' => 'string'
             ),
             'align' => array(
                 'type' => 'string'
             ),
             'backgroundColor' => array(
                 'type' => 'string'
             ),
             'textColor' => array(
                 'type' => 'string'
             ),
             'style' => array(
                 'type' => 'object'
             ),
             'animation' => array(
                 'type' => 'boolean',
                 'default' => true
             )
         )
     ) );
     
     // Add additional block category for our custom blocks if needed
     add_filter('block_categories_all', function($categories) {
         // Check if our category already exists
         $category_slugs = wp_list_pluck($categories, 'slug');
         if (in_array('custom-blocks', $category_slugs)) {
             return $categories;
         }
         
         // Add our custom category
         return array_merge(
             $categories,
             array(
                 array(
                     'slug'  => 'custom-blocks',
                     'title' => __('Custom Blocks', 'random-description-block'),
                     'icon'  => null,
                 ),
             )
         );
     });
 }
 add_action( 'init', 'register_random_description_block' );

// Register frontend scripts and styles
function register_random_description_frontend_assets() {
    // Only load on the frontend when the block is present
    if (!is_admin() && has_block('custom/superswank-random-description')) {
        wp_enqueue_style('random-description-block');
        wp_enqueue_script('random-description-frontend');
        
        // Initialize empty data structure to avoid JavaScript errors
        wp_localize_script('random-description-frontend', 'randomDescriptionData', array(
            'blocks' => array(),
            'version' => '1.2.4'
        ));
    }
}
add_action('wp_enqueue_scripts', 'register_random_description_frontend_assets');

 /**
  * Renders the random description block on the frontend.
  * 
  * This function takes the block attributes and renders the HTML for the random description
  * with a JavaScript-powered rotating mechanism to avoid caching issues.
  * 
  * @param array $attributes The block attributes.
  * @param string $content The block content.
  * @return string The HTML output.
  */
 function render_random_description_block($attributes, $content) {
     // Ensure attributes is an array to prevent errors
     if (!is_array($attributes)) {
         $attributes = array();
     }
     
     // Extract the descriptions array from the block attributes with validation
     $descriptions = isset($attributes['descriptions']) && is_array($attributes['descriptions']) 
         ? array_map('sanitize_text_field', $attributes['descriptions']) 
         : array('');
     
     // If there's only one description, just return it without JS handling
     if (count($descriptions) <= 1) {
         $selected_description = !empty($descriptions[0]) ? $descriptions[0] : '';
         return build_description_html($selected_description, $attributes);
     }
     
     // Create a unique ID for this block instance - avoid using serialize()
     // Instead use only stable attributes to generate the ID
     $id_parts = array(
         'count' => count($descriptions),
         'class' => isset($attributes['className']) ? sanitize_html_class($attributes['className']) : '',
         'align' => isset($attributes['align']) ? sanitize_text_field($attributes['align']) : '',
     );
     $block_id = 'rdb_' . substr(md5(json_encode($id_parts)), 0, 12) . '_' . uniqid();
     
     // Get animation setting
     $animation = isset($attributes['animation']) ? (bool)$attributes['animation'] : true;
     
     // Build styling information
     $styling = build_description_styles($attributes);
     
     // Enqueue the frontend script if not already done
     if (!wp_script_is('random-description-frontend', 'enqueued')) {
         wp_enqueue_script('random-description-frontend');
     }
     
     // Add data that will be used by the JavaScript
     wp_localize_script('random-description-frontend', 'randomDescriptionData', array(
         'blocks' => array() // Will be populated via JavaScript
     ));
     
     // Build the HTML structure for the JavaScript-powered tagline rotator
     $output = '<div id="' . esc_attr($block_id) . '" class="random-description-block-wrapper" ';
     $output .= 'data-animation="' . ($animation ? 'true' : 'false') . '" ';
     $output .= 'style="display:none;">';
     
     // Add all descriptions as hidden elements
     foreach ($descriptions as $index => $description) {
         $output .= '<div class="random-description-item" data-index="' . esc_attr($index) . '">';
         $output .= esc_html($description);
         $output .= '</div>';
     }
     
     // Add the container for the active description
     $output .= '</div>';
     
     // Add visible container with classes and styles
     $output .= '<p id="' . esc_attr($block_id) . '-active" ';
     $output .= 'class="' . esc_attr($styling['classes']) . '" ';
     $output .= $styling['style_string'];
     $output .= 'data-block-id="' . esc_attr($block_id) . '">';
     
     // Add a loading placeholder that will be replaced by JavaScript
     // Also include the first description as fallback for non-JS browsers
     $output .= esc_html($descriptions[0]);
     
     $output .= '</p>';
     
     // Use a proper script registration rather than inline script
     static $block_counter = 0;
     $block_counter++;
     
     // Add script to initialize block - in a more WordPress-friendly way
     wp_add_inline_script('random-description-frontend', 
         'document.addEventListener("DOMContentLoaded", function() {
             if (typeof randomDescriptionBlocks === "undefined") {
                 window.randomDescriptionBlocks = [];
             }
             window.randomDescriptionBlocks.push({
                 id: "' . esc_js($block_id) . '",
                 animation: ' . ($animation ? 'true' : 'false') . '
             });
             if (typeof initRandomDescription === "function") {
                 initRandomDescription("' . esc_js($block_id) . '");
             }
         });',
         'after'
     );
     
     return $output;
 }

/**
 * Helper function to build the styling information for the description.
 * 
 * @param array $attributes The block attributes.
 * @return array The styling information (classes and style string).
 */
function build_description_styles($attributes) {
    // Ensure attributes is an array
    if (!is_array($attributes)) {
        $attributes = array();
    }
    
    // Get stored style attributes with validation
    $align = isset($attributes['align']) ? sanitize_text_field($attributes['align']) : '';
    $text_color = isset($attributes['textColor']) ? sanitize_text_field($attributes['textColor']) : '';
    $background_color = isset($attributes['backgroundColor']) ? sanitize_text_field($attributes['backgroundColor']) : '';
    
    // Get and validate style attribute
    $style_attr = array();
    if (isset($attributes['style'])) {
        if (is_array($attributes['style'])) {
            $style_attr = $attributes['style']; 
        } elseif (is_string($attributes['style'])) {
            // Handle case where style might be a JSON string
            $decoded = json_decode($attributes['style'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $style_attr = $decoded;
            }
        }
    }
    
    // Get custom class from the advanced panel
    $custom_class = isset($attributes['className']) ? sanitize_html_class($attributes['className']) : '';
    
    // Check if animation is enabled (default to true if not set)
    $animation = isset($attributes['animation']) ? (bool)$attributes['animation'] : true;
    
    // Build classes
    $classes = 'site-description wp-block-superswank-random-description';
    if (!empty($align)) {
        $classes .= ' has-text-align-' . $align;
    }
    if (!empty($text_color) && strpos($text_color, '#') === 0) {
        $classes .= ' has-text-color';
    }
    if (!empty($background_color) && strpos($background_color, '#') === 0) {
        $classes .= ' has-background';
    }
    if (!empty($custom_class)) {
        $classes .= ' ' . $custom_class;
    }
    if ($animation) {
        $classes .= ' has-animation';
    }
    
    // Build inline styles
    $styles = array();
    if (!empty($text_color)) {
        $styles[] = 'color:' . $text_color;
    }
    if (!empty($background_color)) {
        $styles[] = 'background-color:' . $background_color;
    }
    
    // Safe function to process style properties
    $process_style_property = function($property, $value) {
        if (empty($value) || !is_string($value)) {
            return false;
        }
        
        $safe_property = sanitize_key($property);
        $safe_value = sanitize_text_field($value);
        
        return array($safe_property, $safe_value);
    };
    
    // Process additional styles from the style attribute
    if (!empty($style_attr) && is_array($style_attr)) {
        // Process typography with validation
        if (isset($style_attr['typography']) && is_array($style_attr['typography'])) {
            foreach ($style_attr['typography'] as $prop => $value) {
                $result = $process_style_property($prop, $value);
                if ($result) {
                    // Convert camelCase to kebab-case for CSS properties
                    $css_prop = preg_replace('/([a-z])([A-Z])/', '$1-$2', $result[0]);
                    $css_prop = strtolower($css_prop);
                    $styles[] = $css_prop . ':' . $result[1];
                }
            }
        }
        
        // Process spacing with validation
        if (isset($style_attr['spacing']) && is_array($style_attr['spacing'])) {
            foreach ($style_attr['spacing'] as $prop => $value) {
                $result = $process_style_property($prop, $value);
                if ($result) {
                    $styles[] = $result[0] . ':' . $result[1];
                }
            }
        }
        
        // Process border with validation
        if (isset($style_attr['border']) && is_array($style_attr['border'])) {
            foreach ($style_attr['border'] as $prop => $value) {
                $result = $process_style_property($prop, $value);
                if ($result) {
                    $styles[] = 'border-' . $result[0] . ':' . $result[1];
                }
            }
        }
    }
    
    // Create a safe style string
    $style_string = '';
    if (!empty($styles)) {
        $style_string = ' style="' . esc_attr(implode(';', $styles)) . '"';
    }
    
    return array(
        'classes' => $classes,
        'style_string' => $style_string
    );
}

/**
 * Helper function to build the HTML for the description with all styling attributes.
 * 
 * This function takes the selected description text and attributes, and builds
 * the HTML with all the styling options applied.
 * 
 * @param string $description_text The selected description text.
 * @param array $attributes The block attributes.
 * @return string The HTML output.
 */
function build_description_html($description_text, $attributes) {
    // Just use our styling function to get consistent style handling
    $styling = build_description_styles($attributes);
    
    // Sanitize the description text
    $description_text = sanitize_text_field($description_text);
    
    // Build the HTML 
    $output = '<p class="' . esc_attr($styling['classes']) . '"';
    $output .= $styling['style_string'];
    $output .= '>' . esc_html($description_text) . '</p>';
    
    return $output;
}