export const lightTheme = {
    colors: {
      primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
      success: {
        50: '#ECFDF5',
        500: '#10B981',
        600: '#059669',
      },
      warning: {
        50: '#FFFBEB',
        500: '#F59E0B',
        600: '#D97706',
      },
      danger: {
        50: '#FEF2F2',
        500: '#EF4444',
        600: '#DC2626',
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
      },
      text: {
        primary: '#1F2937',
        secondary: '#4B5563',
        tertiary: '#6B7280',
      },
      border: {
        primary: '#E5E7EB',
        secondary: '#D1D5DB',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  };
  
  export const darkTheme = {
    colors: {
      primary: {
        50: '#1E3A8A',
        100: '#1E40AF',
        200: '#1D4ED8',
        300: '#2563EB',
        400: '#3B82F6',
        500: '#60A5FA',
        600: '#93C5FD',
        700: '#BFDBFE',
        800: '#DBEAFE',
        900: '#EFF6FF',
      },
      gray: {
        50: '#111827',
        100: '#1F2937',
        200: '#374151',
        300: '#4B5563',
        400: '#6B7280',
        500: '#9CA3AF',
        600: '#D1D5DB',
        700: '#E5E7EB',
        800: '#F3F4F6',
        900: '#F9FAFB',
      },
      success: {
        50: '#064E3B',
        500: '#10B981',
        600: '#34D399',
      },
      warning: {
        50: '#78350F',
        500: '#F59E0B',
        600: '#FBBF24',
      },
      danger: {
        50: '#7F1D1D',
        500: '#EF4444',
        600: '#F87171',
      },
      background: {
        primary: '#111827',
        secondary: '#1F2937',
        tertiary: '#374151',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#F3F4F6',
        tertiary: '#E5E7EB',
      },
      border: {
        primary: '#374151',
        secondary: '#4B5563',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.14)',
    },
  };
  
  // Define breakpoints for responsive design
  export const breakpoints = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };
  
  // Define font sizes
  export const fontSizes = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  };
  
  // Define spacing scale
  export const spacing = {
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  };
  
  // Define z-index values for consistent layering
  export const zIndices = {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  };
  
  // Animation timing functions and durations
  export const animation = {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      fastest: '0.05s',
      faster: '0.1s',
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s',
      slower: '0.5s',
      slowest: '0.7s',
    },
  };
  
  // Typography styles
  export const typography = {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  };
  
  // Export all theme configurations
  export const theme = {
    light: lightTheme,
    dark: darkTheme,
    breakpoints,
    fontSizes,
    spacing,
    zIndices,
    animation,
    typography,
  };
  
  export default theme;
  