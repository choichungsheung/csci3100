/**
 * Determines the appropriate icon color (black or white) based on the background color's grayscale value.
 * @param {string} color - The background color in hex format (e.g., "#FFFFFF").
 * @returns {string} - Returns "#4D4D4D" (black) for light backgrounds or "#fff" (white) for dark backgrounds.
 */
export const getIconColor = (color) => {
    // Convert hex color to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate grayscale value
    const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

    // Return black or white based on the grayscale value
    return grayscale > 127 ? '#4D4D4D' : '#fff';
};