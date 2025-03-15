/**
 * Registers the Random Description block.
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import './style.scss';
import './editor.scss';
import Edit from './edit';
import metadata from './block.json';

/**
 * Register the block
 */
registerBlockType(metadata.name, {
    ...metadata,
    /**
     * @see ./edit.js
     */
    edit: Edit,
    /**
     * Save is handled server-side by PHP callback
     */
    save: () => null,
}); 