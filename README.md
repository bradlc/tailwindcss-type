# tailwindcss-type

```js
module.exports = {
  theme: {
    type: {
      h1: {
        fontSize: {
          '400px': '44px',
          '1200px': '64px'
        },
        // http://text-crop.eightshapes.com/
        crop: {
          top: 13,
          bottom: 16,
          fontSize: 64,
          lineHeight: 1.15625
        },
        // any other type-related properties...
        letterSpacing: '0.04545em',
        fontFamily: ['Helvetica', 'sans-serif'],
        fontWeight: 700,
        lineHeight: 1.15625
      }
    }
  },
  plugins: [
    require('tailwindcss-type')({ rootFontSize: 16 })
  ]
}
```

### Output

```css
.type-h1 {
  font-family: Helvetica, sans-serif;
  font-size: 4.4rem;
  font-weight: 700;
  line-height: 1.15625;
  letter-spacing: 0.04545em;
  padding-top: 1px;
  padding-bottom: 1px;
}

.type-h1::before,
.type-h1::after {
  content: "";
  display: block;
  width: 0;
  height: 0;
}

.type-h1::before {
  margin-bottom: calc(-0.20313em - 1px);
}

.type-h1::after {
  margin-top: calc(-0.25em - 1px);
}

@media (min-width: 25em) {
  .type-h1 {
    font-size: calc(2.5vw + 3.4rem);
  }
}

@media (min-width: 75em) {
  .type-h1 {
    font-size: 6.4rem;
  }
}
```
