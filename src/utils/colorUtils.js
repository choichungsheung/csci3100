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
    return grayscale > 175 ? '#4D4D4D' : '#fff';
};


/**
 * Converts a hex color and opacity level to an rgba color string.
 * @param {string} hex - The hex color code (e.g., "#RRGGBB" or "#RGB").
 * @param {number} opacity - The opacity level (0 to 1).
 * @returns {string} The rgba color string (e.g., "rgba(r, g, b, opacity)").
 */
export const hexToRgba = (hex, opacity) => {
    if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
        return '';
    }

    let r, g, b;

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default hexToRgba;