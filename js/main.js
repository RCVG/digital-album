
$(document).ready(function() {
    // Show loading screen for 2 seconds
    setTimeout(function() {
        $('.loading-screen').fadeOut(500, function() {
            $('.container').fadeIn(500);
        });
    }, 20000);
    let hasUserInteracted = false;
    const backgroundMusic = document.getElementById('backgroundMusic');
    const pageFlipSound = new Audio('./page-flip.mp3');
    pageFlipSound.volume = 0.2;
    backgroundMusic.volume = 0.5; // Reduced volume for background music

    // Wait for first user interaction to enable audio
    $(document).one('click touchstart', function() {
        hasUserInteracted = true;
        $('.sound-status').fadeOut();
        $('body').addClass('sound-enabled');

        // Play background music
        try {
            backgroundMusic.play().catch(error => {
                console.log('Background music playback failed:', error);
            });
        } catch (error) {
            console.log('Error starting background music:', error);
        }
    });


    // Initialize flipbook
    $("#flipbook").turn({
        width: 900,
        height: 600,
        autoCenter: true,
        gradients: true,
        duration: 2000, // Set flip duration to 2 seconds (2000ms)
        pages: $('.page').length, // Automatically count pages
        display: 'double',
        when: {
            turning: function(event, page, view) {
                if (hasUserInteracted) {
                    pageFlipSound.currentTime = 0;
                    pageFlipSound.play().catch(() => {});
                }
            }
        }
    });
    // Add page numbers
    $('#flipbook .page').each(function (index) {
        const pageNumber = index + 1; // Page numbers start from 1
        $(this).append(`<div class="page-number">${pageNumber}</div>`);
    });
    // Simple navigation
    $("#prev").on('click', function(e) {
        e.preventDefault();
        $("#flipbook").turn("previous");
    });

    $("#next").on('click', function(e) {
        e.preventDefault();
        $("#flipbook").turn("next");
    });

    // Keyboard navigation
    $(document).on('keydown', function(e) {
        if (e.keyCode === 37) {
            $("#flipbook").turn("previous");
        } else if (e.keyCode === 39) {
            $("#flipbook").turn("next");
        }
    });

    // Handle window resize
    $(window).on('resize', function() {
        // Debounce resize events
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(function() {
            $("#flipbook").turn("size", 
                Math.min(900, $(window).width() - 40),
                Math.min(600, ($(window).width() - 40) * 0.667)
            );
        }, 200);
    });

    // Initial resize check
    $(window).trigger('resize');
});