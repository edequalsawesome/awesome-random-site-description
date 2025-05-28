/**
 * WordPress dependencies
 */
import { registerBlockStyle } from '@wordpress/blocks';

/**
 * Register block styles.
 */
registerBlockStyle('awesome-random-description/random-description', [
    {
        name: 'default',
        label: 'Default',
        isDefault: true,
    },
    {
        name: 'fancy',
        label: 'Fancy',
    },
    {
        name: 'minimal',
        label: 'Minimal',
    },
    {
        name: 'bold',
        label: 'Bold',
    }
]); 