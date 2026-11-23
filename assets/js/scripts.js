window.onload = (e) => {
    // Credit: https://stackoverflow.com/questions/28576636/mouse-click-and-drag-instead-of-horizontal-scroll-bar-to-view-full-content-of-c
    let mouseDown = false;
    let startX, scrollLeft;
    const sliders = document.querySelectorAll('.gallery');

    const startDragging = (e, slider) => {
        mouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    const stopDragging = (e, slider) => {
        mouseDown = false;
    }

    const move = (e, slider) => {
        e.preventDefault();
        if(!mouseDown) { return; }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
    }

    // this funciton is AI to scale the images properly
    const resizeGallery = slider => {
        const sizeSetter = slider.querySelector('img.size-setter');
        if (!sizeSetter || !sizeSetter.naturalWidth || !sizeSetter.naturalHeight) { return; }

        const maxHeight = window.innerHeight * 0.6;
        const maxWidth = window.innerWidth * 0.85;
        const setterScale = Math.min(
            1,
            maxHeight / sizeSetter.naturalHeight,
            maxWidth / sizeSetter.naturalWidth
        );
        const setterHeight = sizeSetter.naturalHeight * setterScale;

        for (const image of slider.querySelectorAll('img')) {
            if (!image.naturalWidth || !image.naturalHeight) { continue; }

            const scale = Math.min(
                setterHeight / image.naturalHeight,
                maxWidth / image.naturalWidth
            );
            image.style.width = `${image.naturalWidth * scale}px`;
            image.style.height = `${image.naturalHeight * scale}px`;
        }
    }

    // Add the event listeners
    for (const slider of sliders) {
        slider.addEventListener('mousemove', event => move(event, slider));
        slider.addEventListener('mousedown', event => startDragging(event, slider));
        slider.addEventListener('mouseup', event => stopDragging(event, slider));
        slider.addEventListener('mouseleave', event => stopDragging(event, slider));

        resizeGallery(slider);
        window.addEventListener('resize', () => resizeGallery(slider));

        // Some maths to start the gallery already scrolled
        let scrollWidth = slider.scrollWidth;
        let scrollAmount = (scrollWidth - window.innerWidth) / 2;
        slider.scroll(scrollAmount, 0);
    }
}