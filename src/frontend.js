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
            // Create a temporary element to measure the new tagline
            const tempElement = document.createElement('p');
            tempElement.style.visibility = 'hidden';
            tempElement.style.position = 'absolute';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.textContent = randomTagline;
            block.appendChild(tempElement);
            
            // Get the width of the new tagline
            const newWidth = tempElement.offsetWidth;
            block.removeChild(tempElement);
            
            // If block has animation, trigger a new animation
            if (block.classList.contains('has-animation')) {
                // Reset animation
                contentElement.style.animation = 'none';
                contentElement.offsetHeight; // Trigger reflow
                contentElement.style.animation = null;
                
                // Add fade-out class
                contentElement.classList.add('fade-out');
                
                // Wait for fade-out, then update content and fade in
                setTimeout(() => {
                    textElement.textContent = randomTagline;
                    contentElement.classList.remove('fade-out');
                    contentElement.style.animation = 'fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                }, 150); // Half of the CSS transition time
            } else {
                // Just update the content if no animation
                textElement.textContent = randomTagline;
            }
        }
    });
}); 