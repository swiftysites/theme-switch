# Theme Switch

Allow users to pick between dark, light or automatic color scheme for your website.

# Usage

Reference the `theme-switch.js` script somewhere in your HTML.

```html
<script src="theme-switch.js"></script>
```

Include your CSS for the dark color scheme and assign an `id` to the link.

```html
<link id="darkCSSLink" rel="stylesheet" href="/assets/dark.css" media="(prefers-color-scheme: dark)" />
```

Instantiate `<theme-switch>` providing it with the ID of the CSS link.

```html
<theme-switch stylesheet-id="darkCSSLink"></<theme-switch>
```
