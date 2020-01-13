const polyFluidSizing = require('./polyFluidSizing.js')

module.exports = function type({ rootFontSize = 16 }) {
  return ({ theme, addComponents, e }) => {
    let typeStyles = theme('type')
    let output = []

    for (let name of Object.keys(typeStyles)) {
      let { fontSize, fontFamily, crop, ...props } = typeStyles[name]
      let className = e(`type-${name}`)
      let rules = {}

      rules[`.${className}`] = props

      if (crop) {
        rules[`.${className}`].paddingTop = rules[
          `.${className}`
        ].paddingBottom = 1

        rules[`.${className}::before, .${className}::after`] = {
          content: '""',
          display: 'block',
          width: 0,
          height: 0
        }

        rules[`.${className}::before`] = {
          marginBottom: getTopCropStyle(crop, props.lineHeight)
        }

        rules[`.${className}::after`] = {
          marginTop: getBottomCropStyle(crop, props.lineHeight)
        }
      }

      let {
        [`.${className}`]: { fontSize: baseFontSize },
        ...responsiveFontSizeComponents
      } = polyFluidSizing(`.${className}`, 'fontSize', fontSize, {
        rem: true,
        rootFontSize
      })

      rules[`.${className}`].fontSize = baseFontSize
      if (fontFamily) {
        rules[`.${className}`].fontFamily =
          fontFamily.constructor === Array
            ? fontFamily
                .map(f => (/[^a-z-]/i.test(f) ? `"${f}"` : f))
                .join(', ')
            : fontFamily
      }
      rules = { ...rules, ...responsiveFontSizeComponents }

      output.push(rules)
    }

    addComponents(output)
  }
}

function getTopCropStyle(crop, lineHeight) {
  let {
    top: topCrop,
    bottom: bottomCrop,
    fontSize: cropFontSize,
    lineHeight: cropLineHeight
  } = crop

  let dynamicTopCrop =
    Math.max(topCrop + (lineHeight - cropLineHeight) * (cropFontSize / 2), 0) /
    cropFontSize

  return `calc(${(-dynamicTopCrop)
    .toFixed(5)
    .replace(/0+$/, '')
    .replace(/\.$/, '')}em - 1px)`
}

function getBottomCropStyle(crop, lineHeight) {
  let {
    top: topCrop,
    bottom: bottomCrop,
    fontSize: cropFontSize,
    lineHeight: cropLineHeight
  } = crop

  let dynamicBottomCrop =
    Math.max(
      bottomCrop + (lineHeight - cropLineHeight) * (cropFontSize / 2),
      0
    ) / cropFontSize

  return `calc(${(-dynamicBottomCrop)
    .toFixed(5)
    .replace(/0+$/, '')
    .replace(/\.$/, '')}em - 1px)`
}
