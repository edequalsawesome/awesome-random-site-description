/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    TextControl,
    Button,
    SelectControl,
    TextareaControl,
    Placeholder,
    Modal
} from '@wordpress/components';
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the Random Description block
 */
export default function Edit({ attributes, setAttributes, clientId, isSelected }) {
    const {
        taglines = [],
        textAlign,
        style
    } = attributes;

    const [showBulkImportModal, setShowBulkImportModal] = useState(false);
    const [bulkImportText, setBulkImportText] = useState('');
    const [csvFile, setCsvFile] = useState(null);

    // Get site description from WordPress
    const siteDescription = useSelect(select => {
        return select('core').getSite()?.description || '';
    }, []);

    // Add a tagline
    const addTagline = () => {
        const newTaglines = [...taglines, ''];
        setAttributes({ taglines: newTaglines });
    };

    // Remove a tagline by index
    const removeTagline = (index) => {
        const newTaglines = [...taglines];
        newTaglines.splice(index, 1);
        setAttributes({ taglines: newTaglines });
    };

    // Update a tagline by index
    const updateTagline = (index, value) => {
        const newTaglines = [...taglines];
        newTaglines[index] = value;
        setAttributes({ taglines: newTaglines });
    };

    // Handle bulk import
    const handleBulkImport = () => {
        if (!bulkImportText.trim()) return;
        
        const newTaglines = bulkImportText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        setAttributes({ taglines: [...taglines, ...newTaglines] });
        setBulkImportText('');
        setShowBulkImportModal(false);
    };

    // Handle CSV file import
    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const newTaglines = lines
                .map(line => line.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"'))
                .filter(line => line.length > 0);
                
            setAttributes({ taglines: [...taglines, ...newTaglines] });
        };
        reader.readAsText(file);
        setCsvFile(null);
        setShowBulkImportModal(false);
    };

    // UseEffect to auto-import site tagline if no taglines exist
    useEffect(() => {
        if (taglines.length === 0 && siteDescription) {
            setAttributes({ taglines: [siteDescription] });
        }
    }, [siteDescription]);

    // Block props with styles
    const blockProps = useBlockProps({
        className: `has-text-align-${textAlign || 'center'}`
    });

    // Combine classes
    blockProps.className = `${blockProps.className} ${attributes.className || ''}`;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Taglines', 'super-swank-random-description-block')} initialOpen={true}>
                    <div className="taglines-panel">
                        {taglines.length === 0 ? (
                            <p>{__('No taglines added yet. Add some below!', 'super-swank-random-description-block')}</p>
                        ) : (
                            taglines.map((tagline, index) => (
                                <div key={index} className="tagline-item">
                                    <TextControl
                                        value={tagline}
                                        onChange={(value) => updateTagline(index, value)}
                                    />
                                    <Button
                                        isDestructive
                                        onClick={() => removeTagline(index)}
                                        icon="no-alt"
                                        label={__('Remove tagline', 'super-swank-random-description-block')}
                                    />
                                </div>
                            ))
                        )}
                        
                        <div className="tagline-actions">
                            <Button
                                isPrimary
                                onClick={addTagline}
                                icon="plus"
                            >
                                {__('Add Tagline', 'super-swank-random-description-block')}
                            </Button>
                            
                            <Button
                                isSecondary
                                onClick={() => setShowBulkImportModal(true)}
                            >
                                {__('Bulk Import', 'super-swank-random-description-block')}
                            </Button>
                        </div>
                    </div>
                </PanelBody>
                
                <PanelBody title={__('Layout', 'super-swank-random-description-block')} initialOpen={false}>
                    <SelectControl
                        label={__('Text Alignment', 'super-swank-random-description-block')}
                        value={textAlign}
                        options={[
                            { label: __('Left', 'super-swank-random-description-block'), value: 'left' },
                            { label: __('Center', 'super-swank-random-description-block'), value: 'center' },
                            { label: __('Right', 'super-swank-random-description-block'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ textAlign: value })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div {...blockProps}>
                {taglines.length === 0 ? (
                    <Placeholder
                        icon="format-quote"
                        label={__('Random Description', 'super-swank-random-description-block')}
                        instructions={__('Add taglines in the block settings to display a random one each time the page loads.', 'super-swank-random-description-block')}
                    >
                        <Button
                            isPrimary
                            onClick={addTagline}
                        >
                            {__('Add Your First Tagline', 'super-swank-random-description-block')}
                        </Button>
                    </Placeholder>
                ) : (
                    <div className="random-description-preview">
                        <div className="random-description-content">
                            <p>{taglines[0] || __('Your random tagline will appear here', 'super-swank-random-description-block')}</p>
                            <div className="random-description-info">
                                <span className="random-description-count">
                                    {__('You have', 'super-swank-random-description-block')} {taglines.length} {taglines.length === 1 ? __('tagline', 'super-swank-random-description-block') : __('taglines', 'super-swank-random-description-block')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {showBulkImportModal && (
                <Modal
                    title={__('Bulk Import Taglines', 'super-swank-random-description-block')}
                    onRequestClose={() => setShowBulkImportModal(false)}
                >
                    <div className="bulk-import-modal">
                        <TextareaControl
                            label={__('Enter one tagline per line:', 'super-swank-random-description-block')}
                            value={bulkImportText}
                            onChange={setBulkImportText}
                            rows={10}
                        />
                        
                        <div className="bulk-import-divider">
                            <span>{__('OR', 'super-swank-random-description-block')}</span>
                        </div>
                        
                        <div className="bulk-import-file">
                            <label htmlFor="tagline-csv">{__('Import from CSV:', 'super-swank-random-description-block')}</label>
                            <input
                                id="tagline-csv"
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleFileImport}
                            />
                        </div>
                        
                        <div className="bulk-import-actions">
                            <Button
                                isPrimary
                                onClick={handleBulkImport}
                                disabled={!bulkImportText.trim()}
                            >
                                {__('Import Text', 'super-swank-random-description-block')}
                            </Button>
                            
                            <Button
                                isSecondary
                                onClick={() => setShowBulkImportModal(false)}
                            >
                                {__('Cancel', 'super-swank-random-description-block')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
} 