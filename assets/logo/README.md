# OpenLifeOS Logo Assets

## 🎨 Logo Gallery

### Primary Logo (Light Mode)
<div align="center">
  <img src="./openlifeos-logo.svg" alt="OpenLifeOS Logo" width="480" />
</div>

**Usage:** Standard applications, light backgrounds, documentation headers

---

### Dark Mode Logo
<div align="center" style="background: #1a1a1a; padding: 20px; border-radius: 8px;">
  <img src="./openlifeos-logo-dark.svg" alt="OpenLifeOS Logo Dark Mode" width="480" />
</div>

**Usage:** Dark themes, terminal applications, night mode interfaces

---

### Icon Only
<div align="center">
  <img src="./openlifeos-icon.svg" alt="OpenLifeOS Icon" width="160" />
</div>

**Usage:** App icons, favicons, social media avatars, compact spaces

---

### Vertical Layout
<div align="center">
  <img src="./openlifeos-logo-vertical.svg" alt="OpenLifeOS Vertical Logo" width="320" />
</div>

**Usage:** Mobile layouts, splash screens, vertical banners

---

### Horizontal Extended
<div align="center">
  <img src="./openlifeos-logo-horizontal.svg" alt="OpenLifeOS Horizontal Logo" width="720" />
</div>

**Usage:** Wide headers, email signatures, presentation slides

---

## 🚀 Quick Start

### HTML Implementation
```html
<!-- Primary Logo -->
<img src="/assets/logo/openlifeos-logo.svg" alt="OpenLifeOS" height="40">

<!-- Responsive Dark Mode -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/assets/logo/openlifeos-logo-dark.svg">
  <img src="/assets/logo/openlifeos-logo.svg" alt="OpenLifeOS" height="40">
</picture>

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/assets/logo/openlifeos-icon.svg">
```

### React/JSX
```jsx
import logo from '@/assets/logo/openlifeos-logo.svg';
import logoDark from '@/assets/logo/openlifeos-logo-dark.svg';
import { useTheme } from '@/hooks/useTheme';

function Logo() {
  const { isDark } = useTheme();
  return <img src={isDark ? logoDark : logo} alt="OpenLifeOS" className="h-10" />;
}
```

### CSS Background
```css
.logo {
  background-image: url('/assets/logo/openlifeos-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 240px;
  height: 80px;
}

/* Automatic dark mode switching */
@media (prefers-color-scheme: dark) {
  .logo {
    background-image: url('/assets/logo/openlifeos-logo-dark.svg');
  }
}
```

## 📋 File Structure

```
assets/logo/
├── openlifeos-logo.svg            # Primary logo (240x80)
├── openlifeos-logo-dark.svg       # Dark mode variant (240x80)
├── openlifeos-icon.svg            # Icon only (80x80)
├── openlifeos-logo-vertical.svg   # Vertical layout (160x180)
├── openlifeos-logo-horizontal.svg # Extended horizontal (360x80)
├── BRAND_GUIDELINES.md            # Complete brand guidelines
└── README.md                      # This file
```

## 🎨 Design Elements

### Color Palette

#### Primary Gradient
<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%); height: 40px; border-radius: 4px;"></div>

`#667eea` → `#764ba2` → `#f093fb`

#### Accent Gradient
<div style="background: linear-gradient(90deg, #f5576c 0%, #f093fb 100%); height: 40px; border-radius: 4px;"></div>

`#f5576c` → `#f093fb`

### Key Features

- **Neural Network Design**: Represents distributed AI intelligence
- **Pulsing Core**: Animated center symbolizing continuous learning
- **Gradient Colors**: Modern, vibrant palette expressing innovation
- **Scalable SVG**: Perfect quality at any size
- **Built-in Animation**: CSS animations for dynamic presentation

## 📚 Resources

- [Brand Guidelines](./BRAND_GUIDELINES.md) - Complete brand usage documentation
- [OpenLifeOS Website](https://openlifeos.ai) - Official website
- [GitHub Repository](https://github.com/openlifeos) - Source code and issues

## 📄 License

These logo assets are part of the OpenLifeOS project. Usage should comply with the project's open-source license and brand guidelines.

---

*For questions about logo usage or custom implementations, please refer to the [Brand Guidelines](./BRAND_GUIDELINES.md) or open an issue on GitHub.*