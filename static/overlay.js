function showstatus(object) {
    object.style.opacity = "1";
}

function out(object) {
    object.style.opacity = "1";
}

$(document).ready(function () {
    const containerSequences = [
        '.overlay .overlap-8',
        '.overlay .overlap-group',
        '.overlay .overlap-6',
        '.overlay .overlap-5',
        '.overlay .overlap-3',
    ];

    let currentIndex = 0;
    let isHandlingEnterKey = false; // Flag to prevent recursion
    let isHandlingBackKey = false; // Flag to prevent recursion

    function updateAnimationClasses(index) {
        const containers = $(containerSequences[currentIndex]);
        containers.removeClass('hovered active');
        containers.eq(index).addClass('hovered');
    }

    function handleEnterKey(index) {
        const containers = $(containerSequences[currentIndex]);
        if (!isHandlingEnterKey) {
            isHandlingEnterKey = true;
            // Change the window location to the charts page with the selected index as a parameter
            window.location.href = 'http://127.0.0.1:5000/home';
            containers.eq(index).addClass('active');
            isHandlingEnterKey = false;
            containers.removeClass('hovered active');
        }
    }

    function handleBackKey(index) {
        const containers = $(containerSequences[currentIndex]);
        if (!isHandlingBackKey) {
            isHandlingBackKey = true;
            // Change the window location to the charts page with the selected index as a parameter
            window.location.href = 'http://127.0.0.1:5000/home';
            containers.eq(index).addClass('active');
            isHandlingBackKey = false;
            containers.removeClass('hovered active');
        }
    }

    // Get the selectedContainer parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedContainerIndex = urlParams.get('selectedContainer');

    // Apply the animation to the container with the selected index
    if (selectedContainerIndex !== null) {
        currentIndex = parseInt(selectedContainerIndex);
        updateAnimationClasses(currentIndex);
    }

    function keyboardCursor() {
        const containers = $(containerSequences[currentIndex]);
        containers.css('cursor', 'none');

        containers.on('selectstart', false);

        containers.on('click', function () {
            let index = containers.index(this);
            handleEnterKey(index);
        });
    }

    $(document).on('keyup', e => {
        console.log('Key pressed:', e.key);

        const containers = $(containerSequences[currentIndex]);
        containers.removeClass('hovered active');

        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + containerSequences.length) % containerSequences.length;
            updateAnimationClasses(0); // Reset animation for the new set
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % containerSequences.length;
            updateAnimationClasses(0); // Reset animation for the new set
        } else if (e.key === 'Enter') {
            containers.eq(0).removeClass('hovered active');
            containers.eq(0).addClass('active');
            handleEnterKey(0); // Assume index 0 for Enter key
        }
        else if(e.key === 'q')
        {
            containers.eq(0).removeClass('hovered active');
            containers.eq(0).addClass('active');
            handleBackKey(0);
        }
    });

    keyboardCursor();
});
