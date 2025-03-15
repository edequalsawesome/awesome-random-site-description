# Super-Swank Random Description Block

Add a block that cycles through different taglines/descriptions each time your page loads or when visitors navigate between pages, because you're a real extra silly goose.

## Description

The Super-Swank Random Description Block allows you to create a collection of taglines or descriptions that will randomly cycle each time a page is loaded or when visitors navigate between pages. It's perfect for adding variety and keeping your site feeling fresh and dynamic.

**Features:**
* Display a random tagline from your collection each time the page loads
* Manage unlimited taglines in a clean sidebar interface
* Auto-imports your existing site tagline to get you started quickly
* Import taglines from CSV and Markdown files
* Export your taglines as a CSV file for backup or sharing
* Bulk import option for pasting multiple taglines at once
* Choose to append or replace taglines when importing
* Caching-resistant implementation ensures taglines actually change
* Smooth fade-in animation effects (can be toggled on/off)
* Extensive typography controls (font family, size, weight, line height, etc.)
* Complete color controls including text, background, and gradients
* Spacing and border options for perfect positioning
* Mobile-responsive design
* Block alignment options (left, center, right, wide, full)
* Compatible with all WordPress themes
* Zero impact on page load performance
* Simple, intuitive interface

**Great for:**
* Adding variety to your site header
* Showcasing different aspects of your business
* Displaying random quotes or testimonials
* Creating dynamic and engaging user experiences

## Installation

1. Upload the plugin files to the `/wp-content/plugins/super-swank-random-description-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Gutenberg editor to add the 'Super-Swank Random Description' block to your pages or templates
4. Add as many taglines as you'd like, and the block will cycle through them randomly

## Frequently Asked Questions

*Can I control which tagline shows up?*

The plugin is designed to select taglines randomly, ensuring all taglines are shown before repeating any. You cannot control which specific tagline appears on a specific page load.

*Will the same visitor see different taglines?*

Yes, every time the page refreshes or when a visitor navigates to a different page and back, they'll likely see a different tagline.

*Can I style each tagline differently?*

Currently, all taglines in a single block share the same styling. However, you can add multiple instances of the block with different styling if needed.

*Does this work with any theme?*

Yes, the Super-Swank Random Description Block is designed to work with any WordPress theme that supports Gutenberg blocks.

*Can I use HTML in my taglines?*

For security reasons, the plugin escapes HTML content. You can use the block's formatting options for styling instead.

---

== Changelog ==

= 1.3.1 =
* Fixed spacing styles to properly handle WordPress CSS variables
* Added animation toggle for fade-in effect
* Removed block styles panel for simpler interface
* Improved animation performance with proper reflow handling
* Updated license from GPL-2.0+ to GPL-3.0+

= 1.3.0 =
* Simplified CSS class structure for improved styling and compatibility
* Updated main block CSS class from `.wp-block-random-description-block-random-description` to `.wp-block-random-description`
* Improved overall code organization and maintainability

= 1.2.5 =
* Restructured plugin folder to conform to WordPress/Gutenberg best practices
* Improved organization of block assets for better maintainability
* Implemented class-based approach in PHP code for improved modularity
* Enhanced build system for optimized asset delivery

= 1.2.4 =
* Added auto-import feature that populates your block with the site's existing tagline when first added
* Improved initial user experience by providing a pre-populated tagline to start with

= 1.2.3 =
* Added CSV export functionality: easily download your taglines as a CSV file
* Export feature provides a simple way to backup your taglines or share them between sites

= 1.2.2 =
* Added block transformations: now you can transform between Super-Swank Random Description and Site Tagline blocks
* This enables better integration with WordPress core blocks

= 1.2.1 =
* Improved UI: Fixed vertical alignment of the "Add Tagline" button text with the icon
* Enhanced button styling for better usability

= 1.2 =
* Renamed to Super-Swank Random Description Block
* Added ability to append or replace taglines when importing
* Added support for importing taglines from CSV and Markdown files
* Fixed caching issues that prevented taglines from changing
* Improved block editor interface

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.3.1 =
This update fixes spacing styles to properly handle WordPress CSS variables and adds a toggle for animation effects. If you're using custom spacing settings, they should now work correctly. Also updates the plugin license to GPL-3.0+.

= 1.3.0 =
This update simplifies the CSS class structure, making it easier to style the block with custom CSS. If you have any custom styles targeting the old class name, please update them to use the new simplified class name.

= 1.2.5 =
This update includes a major restructuring of the plugin codebase to follow modern WordPress development best practices, resulting in improved performance and maintainability.

= 1.2.4 =
This update automatically imports your existing site tagline when adding the block for the first time, giving you a better starting experience.

= 1.2.3 =
This update adds CSV export functionality, allowing you to download your taglines as a file for backup or sharing between sites.

= 1.2.2 =
This update adds block transformation capabilities, allowing you to convert between Super-Swank Random Description blocks and WordPress Site Tagline blocks.

= 1.2.1 =
This update includes UI improvements for better usability and visual consistency.

= 1.2 =
This update adds CSV and Markdown import functionality, fixes caching issues, and has a super-swank new name!

= 1.0.0 =
Initial release

== How to Use ==

1. **Add the Block**: Insert the "Super-Swank Random Description" block from the Gutenberg block inserter
2. **Add Taglines**: Type in as many different taglines as you'd like
3. **Style Your Block**: Use the block's formatting controls to customize typography, colors, spacing, etc.
4. **Advanced Options**: Configure animation settings and other options in the sidebar
5. **Bulk Import**: For adding many taglines at once, use the bulk import feature in the sidebar
6. **File Import**: Import taglines directly from CSV or Markdown files


For more detailed instructions and examples, visit [our website](https://edequalsaweso.me/random-site-description).