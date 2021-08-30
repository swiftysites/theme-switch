# Theme Switch

Allow users to pick between dark, light or automatic color scheme for your website.

![Theme Switch](doc/theme-switch.gif)

# Usage

Reference the `theme-switch.js` script somewhere in your HTML.

```html
<script src="https://cdn.jsdelivr.net/gh/swiftysites/theme-switch@release/src/theme-switch.min.js"></script>
```

Include your CSS for the dark color scheme and assign an `id` to the link.

```html
<link id="darkCSSLink" rel="stylesheet" href="/assets/dark.css" media="(prefers-color-scheme: dark)" />
```

Instantiate `<theme-switch>` providing it with the ID of the CSS link.

```html
<theme-switch stylesheet-id="darkCSSLink"></<theme-switch>
```

## Configure color

Use the `color` attribute to customize the control's color in any of the formats accepted by the CSS language. The default color is `blue`. 

```html
<theme-switch … color=""></<theme-switch>
```

Use the `color-dark` attribute to customize the color in dark mode. It defaults to the main control's color.

```html
<theme-switch … color="green" color="darkgreen"></<theme-switch>
```

# Browsers/systems with no color scheme preference

In cases where `prefers-color-scheme` is not natively supported you can still use Theme Switch to provide support for dark mode. The _Auto_ option will be removed from the control and light mode will automatically become the default theme.
