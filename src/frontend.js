/**
 * Frontend JavaScript for Random Description Block.
 * 
 * Displays a random tagline from the available options each time the page loads.
 */

document.addEventListener('DOMContentLoaded', function() {
    const randomDescriptionBlocks = document.querySelectorAll('.wp-block-random-description');
    
    randomDescriptionBlocks.forEach(function(block) {
        const taglines = JSON.parse(block.getAttribute('data-taglines') || '[]');
        
        if (taglines.length === 0) return;
        
        // Select a random tagline
        const randomIndex = Math.floor(Math.random() * taglines.length);
        const randomTagline = taglines[randomIndex];
        
        // Update the block content
        if (randomTagline) {
            const contentElement = block.querySelector('.random-description-content p');
            if (contentElement) {
                contentElement.textContent = randomTagline;
            }
        }
    });
}); 