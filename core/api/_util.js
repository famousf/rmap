const handleErrors = (error) => {
  console.log(error)
}
// Utility to observe changes on an element's attribute
const observeFlagState = (flagId, callback) => {
    // Get the target DOM element by ID
    const flagElement = document.getElementById(flagId);

    if (!flagElement) {
        console.error(`Element with ID "${flagId}" not found.`);
        return;
    }

    // Set up a MutationObserver to watch attribute changes
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                const newState = flagElement.getAttribute('data-state');
                if (newState === 'true') {
                    callback(); // Execute the callback when the state is "true"
                    observer.disconnect(); // Stop observing after execution
                }
            }
        }
    });

    // Start observing the `data-state` attribute
    observer.observe(flagElement, { attributes: true });
}
const blendWithWhite = (color, factor) => {
  const white = [255, 255, 255]; // White in RGB
  const targetColor = color.match(/\d+/g).map(Number); // Extract RGB values from the input color

  // Interpolate each channel
  const blendedColor = targetColor.map((channel, i) =>
    Math.round(white[i] * (1 - factor) + channel * factor)
  );

  return `rgb(${blendedColor[0]}, ${blendedColor[1]}, ${blendedColor[2]})`;
}
