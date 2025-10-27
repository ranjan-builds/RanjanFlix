export const getTextColorForBackground = (rgb) => {
    // Function to calculate luminance based on RGB color
    const luminance = (r, g, b) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; // Standard luminance formula
    };
  
    // Get the luminance of the background color
    const luminanceValue = luminance(rgb[0], rgb[1], rgb[2]);
  
    // If luminance is above a certain threshold, return dark text (black), otherwise light text (white)
    return luminanceValue > 0.5 ? 'black' : 'white';
  };
  