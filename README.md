# Awesome Random Description Block

A lightweight, accessible WordPress Gutenberg block that displays random site descriptions/taglines with immediate loading and comprehensive customization options.

## Description

The Awesome Random Description Block allows you to create a collection of taglines or descriptions that will randomly display each time a page is loaded. It's perfect for adding dynamic, engaging content to your site header, footer, or any page where you want to showcase different aspects of your brand or message. The block displays a random tagline immediately upon page load with no flash or delay.

## Features

- **Easy Management**: Add, edit, and remove taglines directly from the Gutenberg editor
- **Text Alignment Controls**: Full support for left, center, right, and justify text alignment
- **Bulk Import**: Import multiple taglines at once via text input or CSV file upload
- **Export Functionality**: Export your taglines to CSV for backup or sharing
- **Immediate Display**: Random taglines appear instantly with no flash or loading delay
- **Responsive Design**: Works beautifully on all device sizes
- **Accessibility**: Built with proper ARIA labels and semantic HTML
- **Customizable Styling**: Full support for WordPress theme colors, typography, and spacing
- **Performance Optimized**: Lightweight, efficient loading, and minimal resource usage
- **Block API v3**: Built with the latest WordPress block standards

## Installation

### From WordPress Admin

1. Go to Plugins > Add New
2. Search for "Awesome Random Description Block"
3. Install and activate the plugin

### Manual Installation

1. Upload the plugin files to the `/wp-content/plugins/awesome-random-description-block` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Gutenberg editor to add the 'Awesome Random Description' block to your pages

## Usage

1. **Add the Block**: Insert the "Awesome Random Description" block from the Gutenberg block inserter
2. **Add Taglines**: Use the block settings panel to add your taglines one by one, or use the bulk import feature
3. **Customize**: Adjust typography, colors, spacing, text alignment, and other styling options to match your theme
4. **Publish**: Save your page and watch your taglines rotate randomly on each page load

## Performance & Accessibility

### Performance Optimizations
- **Server-Side Randomization**: Random taglines are selected server-side for immediate display
- **No Flash Effect**: Taglines appear instantly without any visual delay or replacement
- **Minimal Dependencies**: Streamlined codebase with only essential dependencies
- **Optimized Build Process**: Minified and optimized assets
- **Lightweight Frontend**: No JavaScript required for basic functionality

### Accessibility Features
- **ARIA Live Regions**: Screen readers are notified of content changes
- **Semantic HTML**: Proper heading structure and meaningful markup
- **Keyboard Navigation**: Full keyboard accessibility support
- **High Contrast Support**: Works with high contrast themes and modes

## Frequently Asked Questions

### How often do the descriptions change?

The descriptions change each time a page is loaded or refreshed. Each visitor will see a random tagline from your collection, selected server-side for immediate display.

### Can I use this with any theme?

Yes, the Awesome Random Description Block is designed to work with any WordPress theme that supports Gutenberg blocks.

### Are there any animations?

No, the block displays taglines immediately without any animations or transitions. This ensures fast loading and eliminates any flash effects.

### Can I style the block?

Absolutely! The block supports all WordPress block styling options including:
- Typography (font size, weight, style)
- Colors (text and background)
- Spacing (margin and padding)
- Text alignment (left, center, right, justify)
- Custom CSS classes

### Can I export my taglines?

Yes, you can export all your taglines to a CSV file using the export button in the block settings.

### Can I import taglines in bulk?

Yes, you can import multiple taglines at once by:
1. Typing or pasting them in the bulk import text area (one per line)
2. Uploading a CSV file with your taglines

## Technical Details

- **WordPress Version**: 5.0+
- **PHP Version**: 7.4+
- **Block API Version**: 3
- **Dependencies**: WordPress core only
- **File Size**: < 50KB total

## Changelog

### 1.7.0 (Current - Text Alignment Support)
* **Text Alignment Feature Added**
* Added full text alignment controls with left, center, right, and justify options
* Implemented standard WordPress block toolbar alignment buttons
* Added proper text alignment validation and sanitization
* Enhanced CSS styling with explicit text alignment class support
* Improved block compatibility with WordPress theme standards
* Maintains all existing functionality while adding new alignment capabilities

### 1.6.1 (Security Hardened)
* **Security Enhancement Update**
* Fixed critical CSS injection vulnerability with comprehensive input validation
* Enhanced file upload security with type, size, and content validation
* Implemented robust input sanitization for all user inputs
* Added capability checks and user permission validation
* Enhanced CSV import security with injection prevention
* Added comprehensive attribute validation and type checking
* Improved error handling and resource protection
* Enhanced information disclosure prevention
* Strengthened output sanitization using WordPress security functions

### 1.6.0 (Streamlined)
* **Major Streamlining Update**
* Removed all animation functionality for immediate display
* Implemented server-side random tagline selection
* Eliminated flash effect on page load
* Further optimized performance with minimal frontend JavaScript
* Enhanced accessibility with simplified, immediate content display
* Reduced bundle size and improved loading speed

### 1.5.0 (Optimized)
* Fixed all naming inconsistencies (removed legacy "super-swank" references)
* Optimized frontend script loading (only loads when block is present)
* Improved accessibility with motion preference support
* Streamlined codebase and removed unnecessary files
* Enhanced performance with efficient animations
* Fixed data attribute mismatches between PHP and JavaScript
* Updated to use consistent CSS class names throughout
* Improved error handling and code quality

### 1.4.1
* Improved animation performance and smoothness
* Enhanced CSS transitions for better user experience
* Fixed animation timing issues

### 1.4.0
* Upgraded to Block API version 3
* Improved performance and compatibility
* Enhanced block registration

### 1.3.0
* Added smooth animations with fade effects
* Improved accessibility with ARIA labels
* Enhanced responsive design
* Added animation control settings

### 1.2.5
* Added bulk import functionality for taglines
* Added CSV export feature for taglines
* Improved user interface with better button spacing
* Enhanced block settings panel organization

## Development

### Building the Plugin

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run start
```

### Linting

```bash
npm run lint:js
npm run lint:css
```

## Support

For support, feature requests, or bug reports, please visit [our website](https://edequalsaweso.me/random-site-description) or contact the plugin author.

## License

This plugin is licensed under the GPL-3.0+ license.