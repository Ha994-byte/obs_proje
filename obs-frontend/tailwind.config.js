export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#121E2D',          // FSM Navy
        secondary: '#D4AF37',        // FSM Gold
        tertiary: '#337AB7',         // FSM Blue
        background: '#f8f9fa',       // Neutral light bg
        'background-alt': '#F4F6F8',   // Striped table row bg
        'border-subtle': '#E2E8F0',    // Clean divider borders
      },
      borderRadius: {
        DEFAULT: '0.25rem', // 4px (Standard buttons, inputs)
        md: '0.375rem',     // 6px
        lg: '0.5rem',       // 8px (Cards and containers)
        xl: '0.75rem',      // 12px
        '2xl': '1rem',      // 16px
      }
    }
  },
  plugins: []
};
