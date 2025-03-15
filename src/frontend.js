/**
 * Frontend JavaScript for Random Description Block.
 * 
 * Displays a random tagline from the available options each time the page loads.
 */

document.addEventListener('DOMContentLoaded', function() {
    const randomDescriptionBlocks = document.querySelectorAll('.wp-block-random-description');
    
    randomDescriptionBlocks.forEach(function(block) {
        const taglines = JSON.parse(block.getAttribute('data-taglines') || '[]');
        const contentElement = block.querySelector('.random-description-content');
        const textElement = contentElement?.querySelector('p');
        
        if (!taglines.length || !contentElement || !textElement) return;
        
        // Select a random tagline
        const randomIndex = Math.floor(Math.random() * taglines.length);
        const randomTagline = taglines[randomIndex];
        
        if (randomTagline) {
            // If block has animation, trigger a new animation
            if (block.classList.contains('has-animation')) {
                // Reset animation
                contentElement.style.animation = 'none';
                contentElement.offsetHeight; // Trigger reflow
                contentElement.style.animation = null;
                
                // Update content and trigger animation
                textElement.textContent = randomTagline;
                contentElement.style.animation = 'fadeInUp 0.5s ease-out forwards';
            } else {
                // Just update the content if no animation
                textElement.textContent = randomTagline;
            }
        }
    });
}); 