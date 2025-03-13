/**
 * Random Description Block
 * 
 * Displays a random description from a list every time the page loads or when navigating between pages.
 */

// Register the block
( function( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var useBlockProps = blockEditor.useBlockProps;
	var TextControl = components.TextControl;
	var Button = components.Button;
	var Panel = components.Panel;
	var PanelBody = components.PanelBody;
	var ToggleControl = components.ToggleControl;
	var SelectControl = components.SelectControl;
	var TextareaControl = components.TextareaControl;
	var RadioControl = components.RadioControl;
	var __ = i18n.__;
	var RichText = blockEditor.RichText;
	var Placeholder = components.Placeholder;
	var Icon = components.Icon;
	var createBlock = blocks.createBlock;
	var useSelect = wp.data.useSelect; // Add this to access site data

	blocks.registerBlockType( 'custom/superswank-random-description', {
		title: __( 'Super-Swank Random Description' ),
		icon: 'format-quote',
		category: 'widgets',
		description: __( 'Display a random tagline from your collection each time the page loads or when navigating between pages.' ),
		keywords: [ 'description', 'tagline', 'random', 'cycle', 'swank', 'super-swank' ],
		example: {
            attributes: {
                descriptions: ['Example random tagline'],
                align: 'center',
                textColor: '#333333',
                backgroundColor: '#f8f9f9'
            },
        },
		// Add transforms to enable block conversions
        transforms: {
            from: [
                {
                    type: 'block',
                    blocks: ['core/site-tagline'],
                    transform: function(attributes) {
                        // Get the site tagline content
                        var siteTagline = attributes.content || '';
                        
                        // Return a new random description block with the site tagline as the first description
                        return createBlock('custom/superswank-random-description', {
                            descriptions: [siteTagline],
                            // Copy over styling attributes where applicable
                            align: attributes.align,
                            textColor: attributes.textColor,
                            backgroundColor: attributes.backgroundColor,
                            style: attributes.style
                        });
                    }
                }
            ],
            to: [
                {
                    type: 'block',
                    blocks: ['core/site-tagline'],
                    transform: function(attributes) {
                        // Get the first description or use an empty string as fallback
                        var firstDescription = (attributes.descriptions && attributes.descriptions.length > 0) 
                            ? attributes.descriptions[0] 
                            : '';
                        
                        // Return a new site tagline block with the content from the first description
                        return createBlock('core/site-tagline', {
                            content: firstDescription,
                            // Copy over styling attributes where applicable
                            align: attributes.align,
                            textColor: attributes.textColor,
                            backgroundColor: attributes.backgroundColor,
                            style: attributes.style
                        });
                    }
                }
            ]
        },
		supports: {
			// Add paragraph block style support
			align: true,
			alignWide: true,
			anchor: true,
			color: {
				background: true,
				text: true,
				gradients: true,
			},
			typography: {
				fontSize: true,
				lineHeight: true,
				__experimentalFontFamily: true,
				__experimentalFontStyle: true,
				__experimentalFontWeight: true,
				__experimentalLetterSpacing: true,
				__experimentalTextTransform: true,
				__experimentalTextDecoration: true,
			},
			spacing: {
				margin: true,
				padding: true,
			},
			__experimentalBorder: {
				color: true,
				radius: true,
				style: true,
				width: true,
			},
			__experimentalSelector: '.wp-block-superswank-random-description',
		},
		attributes: {
			descriptions: {
				type: 'array',
				default: ['']
			},
			tagline: {
				type: 'string',
				default: ''
			},
			className: {
				type: 'string'
			},
			// Add paragraph style attributes
			align: {
				type: 'string',
			},
			backgroundColor: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},
			gradient: {
				type: 'string',
			},
			fontSize: {
				type: 'string',
			},
			style: {
				type: 'object',
			},
			// Animation option
			animation: {
				type: 'boolean',
				default: true
			},
			// Import option
			bulkImport: {
				type: 'string',
				default: ''
			},
			// Flag to track if this is a new block
			isNewBlock: {
				type: 'boolean',
				default: true
			}
		},

		// Define the edit interface
		edit: function( props ) {
			var blockProps = useBlockProps();
			var descriptions = props.attributes.descriptions;
			var className = props.attributes.className;
			var animation = props.attributes.animation;
			var bulkImport = props.attributes.bulkImport;
			var isNewBlock = props.attributes.isNewBlock;
			
			// Get the site tagline from WordPress core
			var siteTagline = useSelect(function(select) {
				return select('core').getEditedEntityRecord('root', 'site').description;
			}, []);
			
			// If this is a new block and there's only an empty description, add the site tagline
			if (isNewBlock && descriptions.length === 1 && !descriptions[0] && siteTagline) {
				// Set the site tagline as the first description
				setTimeout(function() {
					props.setAttributes({ 
						descriptions: [siteTagline],
						isNewBlock: false // Mark as initialized
					});
				}, 0);
			} else if (isNewBlock) {
				// Mark as initialized even if there's no tagline
				props.setAttributes({ isNewBlock: false });
			}
			
			// State for import mode (replace or append)
			var [importMode, setImportMode] = wp.element.useState('replace');
			
			// Get block controls from WordPress
			var BlockControls = blockEditor.BlockControls;
			var InspectorControls = blockEditor.InspectorControls;
			var AlignmentToolbar = blockEditor.AlignmentToolbar;

			// Function to add a new description field
			function addDescription() {
				var newDescriptions = descriptions.concat(['']);
				props.setAttributes({ descriptions: newDescriptions });
			}

			// Function to remove a description field
			function removeDescription(index) {
				var newDescriptions = [...descriptions];
				newDescriptions.splice(index, 1);
				props.setAttributes({ descriptions: newDescriptions });
			}

			// Function to update a description
			function updateDescription(index, value) {
				var newDescriptions = [...descriptions];
				newDescriptions[index] = value;
				props.setAttributes({ descriptions: newDescriptions });
			}
			
			// Function to handle bulk import
			function handleBulkImport() {
				if (!bulkImport.trim()) return;
				
				// Split by newlines and filter out empty items
				var items = bulkImport.split('\n')
					.map(item => item.trim())
					.filter(item => item.length > 0);
					
				if (items.length > 0) {
					if (importMode === 'append') {
						// Append to existing taglines
						props.setAttributes({ 
							descriptions: [...descriptions, ...items],
							bulkImport: '' 
						});
					} else {
						// Replace existing taglines
						props.setAttributes({ 
							descriptions: items,
							bulkImport: '' 
						});
					}
				}
			}

			// Function to handle file import
			function handleFileImport(event) {
				var file = event.target.files[0];
				if (!file) return;
				
				var fileType = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 
							  file.name.toLowerCase().endsWith('.md') ? 'md' : 'unknown';
				
				if (fileType === 'unknown') {
					alert('Please upload a CSV or Markdown file.');
					return;
				}
				
				var reader = new FileReader();
				reader.onload = function(e) {
					var content = e.target.result;
					var items = [];
					
					if (fileType === 'csv') {
						// Parse CSV - simple implementation that handles quoted values
						var rows = content.split(/\r?\n/).filter(row => row.trim());
						items = rows.map(function(row) {
							// Handle both quoted and unquoted values
							if (row.includes('"')) {
								// Extract from quotes if present (simple implementation)
								var match = row.match(/"([^"]*)"/);
								return match ? match[1].trim() : row.trim();
							} else {
								// For CSV with multiple columns, just take first column
								return row.split(',')[0].trim();
							}
						});
					} else if (fileType === 'md') {
						// Parse Markdown - extract lines that could be taglines
						// This handles both bullet points and regular lines
						var lines = content.split(/\r?\n/).filter(line => line.trim());
						items = lines.map(function(line) {
							// Remove markdown bullet points and other common formatting
							return line.replace(/^[-*+•]|#|\*\*|\*|__|_/g, '').trim();
						}).filter(line => line.length > 0);
					}
					
					// Filter out empty items and update
					items = items.filter(item => item.trim().length > 0);
					
					if (items.length > 0) {
						if (importMode === 'append') {
							// Append to existing taglines
							props.setAttributes({ descriptions: [...descriptions, ...items] });
						} else {
							// Replace existing taglines
							props.setAttributes({ descriptions: items });
						}
						// Reset the file input
						event.target.value = '';
					} else {
						alert('No valid taglines found in the file.');
					}
				};
				reader.readAsText(file);
			}

			// Determine the preview text
			var previewText = descriptions[Math.floor(Math.random() * descriptions.length)];

			// Create the block editor interface
			return el(
				'div',
				blockProps,
				// Add BlockControls for alignment
				el(
					BlockControls,
					null,
					el(
						AlignmentToolbar,
						{
							value: props.attributes.align,
							onChange: function(newAlign) {
								props.setAttributes({ align: newAlign });
							}
						}
					)
				),
				// Add InspectorControls for colors, typography, etc.
				el(
					InspectorControls,
					null,
					// Taglines Panel
					el(
						PanelBody,
						{
							title: __( 'Taglines' ),
							initialOpen: true
						},
						// Tagline Management Interface
						el(
							'div',
							{ className: 'superswank-random-description-sidebar' },
							descriptions.map(function(description, index) {
								return el(
									'div',
									{ key: index, className: 'sidebar-description-row' },
									el(
										TextControl,
										{
											label: __( 'Tagline #' + (index + 1) ),
											value: description,
											onChange: function(value) {
												updateDescription(index, value);
											}
										}
									),
									el(
										Button,
										{
											isDestructive: true,
											onClick: function() {
												removeDescription(index);
											},
											disabled: descriptions.length <= 1,
											icon: 'trash',
											label: __( 'Remove' )
										}
									)
								);
							}),
							el(
								Button,
								{
									isPrimary: true,
									onClick: addDescription,
									icon: 'plus',
									className: 'sidebar-add-button'
								},
								__( 'Add Tagline' )
							),
							descriptions.length > 1 && el(
								'p',
								{ className: 'sidebar-helper-text' },
								__( 'You have ' + descriptions.length + ' taglines that will cycle randomly.' )
							)
						)
					),
					el(
						PanelBody,
						{
							title: __( 'Animation Settings' ),
							initialOpen: false
						},
						el(
							ToggleControl,
							{
								label: __( 'Enable fade-in animation' ),
								checked: animation,
								onChange: function(value) {
									props.setAttributes({ animation: value });
								},
								help: __( 'Animate the description when it changes' )
							}
						)
					),
					el(
						PanelBody,
						{
							title: __( 'Bulk Import' ),
							initialOpen: false
						},
						// Add import mode selection
						el(
							RadioControl,
							{
								label: __( 'Import Mode' ),
								selected: importMode,
								options: [
									{ label: __( 'Replace existing taglines' ), value: 'replace' },
									{ label: __( 'Append to existing taglines' ), value: 'append' }
								],
								onChange: function(value) {
									setImportMode(value);
								}
							}
						),
						el(
							TextareaControl,
							{
								label: __( 'Import Multiple Taglines' ),
								value: bulkImport,
								onChange: function(value) {
									props.setAttributes({ bulkImport: value });
								},
								help: __( 'Enter one tagline per line' ),
								rows: 5
							}
						),
						el(
							Button,
							{
								isPrimary: true,
								onClick: handleBulkImport,
								disabled: !bulkImport.trim()
							},
							__( 'Import Taglines' )
						),
						// Add file import section with a divider
						el('hr', { className: 'sidebar-divider', style: { margin: '20px 0 15px', borderTop: '1px solid #e0e0e0' } }),
						el(
							'p',
							{ className: 'file-import-label' },
							__( 'Import from file (CSV or Markdown):' )
						),
						el(
							'input',
							{
								type: 'file',
								accept: '.csv,.md',
								onChange: handleFileImport,
								className: 'file-import-input',
								id: 'file-import-' + props.clientId // Use clientId to make it unique
							}
						),
						el(
							'p',
							{ className: 'file-import-help' },
							__( 'Upload a CSV or Markdown file containing your taglines. For CSV, the first column will be used. For Markdown, each line or bullet point will become a tagline.' )
						),
						
						// Add a divider before the export section
						el('hr', { className: 'sidebar-divider', style: { margin: '20px 0 15px', borderTop: '1px solid #e0e0e0' } }),
						
						// Add export functionality
						el(
							'p',
							{ className: 'file-export-label' },
							__( 'Export your taglines:' )
						),
						el(
							Button,
							{
								isPrimary: true,
								onClick: function() {
									// Only export if there are taglines
									if (descriptions.length === 0) {
										alert('No taglines to export.');
										return;
									}
									
									// Create CSV content
									var csvContent = descriptions.map(function(tagline) {
										// Escape quotes and wrap in quotes to handle commas in taglines
										return '"' + tagline.replace(/"/g, '""') + '"';
									}).join('\n');
									
									// Create a blob and download link
									var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
									var link = document.createElement('a');
									var url = URL.createObjectURL(blob);
									
									// Set up and trigger download
									link.setAttribute('href', url);
									link.setAttribute('download', 'super-swank-taglines.csv');
									link.style.visibility = 'hidden';
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
								},
								className: 'sidebar-export-button',
								disabled: descriptions.length === 0
							},
							__( 'Export Taglines as CSV' )
						),
						el(
							'p',
							{ className: 'file-export-help' },
							__( 'Download your taglines as a CSV file that you can save for backup or import into other blocks.' )
						)
					)
				),
				
				// Main content area - just show the preview and instructions
				el(
					'div',
					{ className: 'superswank-random-description-main-editor' },
					el(
						Placeholder,
						{
							icon: el(Icon, { icon: 'format-quote' }),
							label: __( 'Super-Swank Random Description Block' ),
							instructions: __( 'Add your taglines in the block settings panel →' ),
							isColumnLayout: true
						},
						el(
							'div',
							{ className: 'superswank-random-description-preview' },
							el(
								'h5',
								{},
								__( 'Preview:' )
							),
							el(
								'p',
								{ 
									className: 'site-description wp-block-superswank-random-description',
									style: {
										textAlign: props.attributes.align,
										color: props.attributes.textColor,
										backgroundColor: props.attributes.backgroundColor,
									}
								},
								previewText
							),
							descriptions.length > 1 && el(
								'p',
								{ className: 'helper-text' },
								__( 'One of your ' + descriptions.length + ' taglines will be randomly selected when the page loads.' )
							)
						)
					)
				)
			);
		},

		// Define the frontend display
		save: function( props ) {
			var blockProps = useBlockProps.save({
				className: props.attributes.align ? 'has-text-align-' + props.attributes.align : '',
				style: {
					color: props.attributes.textColor,
					backgroundColor: props.attributes.backgroundColor,
				}
			});
			var descriptions = props.attributes.descriptions || [''];
			var className = props.attributes.className || '';
			var animation = props.attributes.animation !== undefined ? props.attributes.animation : true;
			
			// Ensure descriptions are valid strings
			descriptions = descriptions.map(function(desc) {
				return typeof desc === 'string' ? desc : '';
			});
			
			// We'll use PHP to render the random description on the frontend
			// This save function just outputs the data we need and preserves styling
			try {
				// Process style attribute to ensure it's safe for JSON
				var styleObj = props.attributes.style || {};
				var safeStyleObj = {};
				
				// Only include simple properties that can be safely serialized
				if (styleObj.typography) {
					safeStyleObj.typography = {};
					for (var key in styleObj.typography) {
						if (typeof styleObj.typography[key] === 'string') {
							safeStyleObj.typography[key] = styleObj.typography[key];
						}
					}
				}
				
				if (styleObj.spacing) {
					safeStyleObj.spacing = {};
					for (var key in styleObj.spacing) {
						if (typeof styleObj.spacing[key] === 'string') {
							safeStyleObj.spacing[key] = styleObj.spacing[key];
						}
					}
				}
				
				if (styleObj.border) {
					safeStyleObj.border = {};
					for (var key in styleObj.border) {
						if (typeof styleObj.border[key] === 'string') {
							safeStyleObj.border[key] = styleObj.border[key];
						}
					}
				}
				
				return el(
					'div',
					blockProps,
					el(
						'div',
						{ 
							className: 'wp-block-superswank-random-description-container',
							'data-descriptions': JSON.stringify(descriptions),
							'data-align': props.attributes.align || '',
							'data-text-color': props.attributes.textColor || '',
							'data-background-color': props.attributes.backgroundColor || '',
							'data-style': JSON.stringify(safeStyleObj),
							'data-class-name': className,
							'data-animation': animation,
						}
					)
				);
			} catch (e) {
				// Fallback render if JSON processing fails
				return el(
					'div',
					blockProps,
					el(
						'p',
						{ className: 'wp-block-superswank-random-description' },
						descriptions[0] || ''
					)
				);
			}
		}
	} );
} )( 
	window.wp.blocks, 
	window.wp.element, 
	window.wp.blockEditor, 
	window.wp.components,
	window.wp.i18n
);