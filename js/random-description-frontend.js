/**
 * Random Description Block - Frontend JavaScript
 * 
 * This script handles the client-side random tagline selection and rotation.
 * It ensures random taglines are shown even when the page is cached.
 */

(function($) {
    'use strict';
    
    // Store shown taglines for each block to avoid repeats
    var shownTaglines = {};
    
    // Initialize global blocks array
    window.randomDescriptionBlocks = window.randomDescriptionBlocks || [];
    
    // Safely access array data with fallbacks
    function safeGet(obj, path, fallback) {
        try {
            var result = obj;
            var pathParts = path.split('.');
            
            for (var i = 0; i < pathParts.length; i++) {
                if (result === null || result === undefined) {
                    return fallback;
                }
                result = result[pathParts[i]];
            }
            
            return (result === null || result === undefined) ? fallback : result;
        } catch (e) {
            return fallback;
        }
    }
    
    // Main initialization function
    window.initRandomDescription = function(blockId) {
        // Validate input
        if (!blockId || typeof blockId !== 'string') {
            return;
        }
        
        try {
            var $wrapper = $('#' + blockId);
            var $active = $('#' + blockId + '-active');
            
            if (!$wrapper.length || !$active.length) {
                return;
            }
            
            // Initialize shown taglines tracking for this block
            if (!shownTaglines[blockId]) {
                shownTaglines[blockId] = [];
            }
            
            // Get all available taglines
            var $items = $wrapper.find('.random-description-item');
            var totalItems = $items.length;
            
            if (totalItems < 1) {
                return;
            }
            
            // Select a random tagline that hasn't been shown yet
            var selectRandomTagline = function() {
                // If all taglines have been shown, reset tracking
                if (shownTaglines[blockId].length >= totalItems) {
                    shownTaglines[blockId] = [];
                }
                
                // Get indices of taglines not yet shown
                var availableIndices = [];
                $items.each(function() {
                    var index = parseInt($(this).data('index'), 10);
                    if (isNaN(index)) {
                        return; // Skip invalid indices
                    }
                    if (shownTaglines[blockId].indexOf(index) === -1) {
                        availableIndices.push(index);
                    }
                });
                
                // If somehow no indices are available, use the first one
                if (availableIndices.length === 0) {
                    return 0;
                }
                
                // Select random index from available ones
                var randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                
                // Mark as shown
                shownTaglines[blockId].push(randomIndex);
                
                return randomIndex;
            };
            
            // Update the visible tagline
            var updateVisibleTagline = function() {
                try {
                    var selectedIndex = selectRandomTagline();
                    var $selectedItem = $items.filter('[data-index="' + selectedIndex + '"]');
                    
                    if (!$selectedItem.length) {
                        return; // Safety check
                    }
                    
                    var selectedText = $selectedItem.text();
                    
                    // Check if animation is enabled
                    var hasAnimation = $wrapper.data('animation') === true;
                    
                    if (hasAnimation) {
                        // Apply animation when changing the text
                        $active.css('opacity', 0);
                        setTimeout(function() {
                            $active.text(selectedText);
                            $active.css('opacity', 1);
                        }, 300);
                    } else {
                        // Just change the text without animation
                        $active.text(selectedText);
                    }
                } catch (e) {
                    console.error('Error updating tagline:', e);
                }
            };
            
            // Initial selection
            updateVisibleTagline();
            
            // Store reference to this block's update function
            if (typeof window.randomDescriptionUpdate === 'undefined') {
                window.randomDescriptionUpdate = {};
            }
            window.randomDescriptionUpdate[blockId] = updateVisibleTagline;
        } catch (e) {
            console.error('Error initializing random description block:', e);
        }
    };
    
    // For Single Page Applications or History API navigation
    // Update taglines when page URL changes without full reload
    var lastUrl = window.location.href;
    
    try {
        setInterval(function() {
            var currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                
                // Update all random description blocks on "virtual" page change
                if (window.randomDescriptionBlocks && window.randomDescriptionBlocks.length) {
                    for (var i = 0; i < window.randomDescriptionBlocks.length; i++) {
                        var block = window.randomDescriptionBlocks[i];
                        var blockId = safeGet(block, 'id', '');
                        
                        if (blockId && window.randomDescriptionUpdate && window.randomDescriptionUpdate[blockId]) {
                            try {
                                window.randomDescriptionUpdate[blockId]();
                            } catch (e) {
                                console.error('Error updating block:', e);
                            }
                        }
                    }
                }
            }
        }, 500);
    } catch (e) {
        console.error('Error setting up URL change detection:', e);
    }
    
    // Initialize all blocks when DOM is ready
    $(document).ready(function() {
        try {
            if (window.randomDescriptionBlocks && window.randomDescriptionBlocks.length) {
                for (var i = 0; i < window.randomDescriptionBlocks.length; i++) {
                    var block = window.randomDescriptionBlocks[i];
                    var blockId = safeGet(block, 'id', '');
                    
                    if (blockId) {
                        initRandomDescription(blockId);
                    }
                }
            }
        } catch (e) {
            console.error('Error initializing blocks on DOM ready:', e);
        }
    });
    
})(jQuery); 