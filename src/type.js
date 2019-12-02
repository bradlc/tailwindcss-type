const polyFluidSizing = require('./polyFluidSizing.js')

module.exports = function type({ theme, addComponents, e }) {
  let typeStyles = theme('type')
  let output = {}

  for (let name of Object.keys(typeStyles)) {
    let { fontSize, crop, ...props } = typeStyles[name]
    let className = e(`type-${name}`)

    output[`.${className}`] = {
      ...props,
      paddingTop: 1,
      paddingBottom: 1
    }

    output[`.${className}::before, .${className}::after`] = {
      content: '""',
      display: 'block',
      width: 0,
      height: 0
    }

    output[`.${className}::before`] = {
      marginBottom: getTopCropStyle(crop, props.lineHeight)
    }

    output[`.${className}::after`] = {
      marginTop: getBottomCropStyle(crop, props.lineHeight)
    }

    let {
      [`.${className}`]: { fontSize: baseFontSize },
      ...responsiveFontSizeComponents
    } = polyFluidSizing(`.${className}`, 'fontSize', fontSize, {
      rem: true,
      rootFontSize: 10
    })

    output[`.${className}`].fontSize = baseFontSize
    output = { ...output, ...responsiveFontSizeComponents }
  }

  addComponents(output)
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
