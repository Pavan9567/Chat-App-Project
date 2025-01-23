window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const body = document.body;

    if (width <= 600) {
        body.style.transform = "scale(0.5)";
    } else if (width <= 700) {
        body.style.transform = "scale(0.75)";
    } else if (width <= 767) {
        body.style.transform = "scale(0.8)";
    } else if (width <= 1600) {
        body.style.transform = "scale(0.9)";
    } else {
        body.style.transform = "scale(1)";
    }
});
