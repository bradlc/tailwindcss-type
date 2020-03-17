const polyFluidSizing = require('./polyFluidSizing.js')

module.exports = function type({ rootFontSize = 16 }) {
  return ({ theme, addComponents, e, variants: getVariants }) => {
    let typeStyles = theme('type')
    let output = []

    for (let name of Object.keys(typeStyles)) {
      let { fontSize, fontFamily, crop, richText, ...props } = typeStyles[name]
      let selector = `.${e(`type-${name}`)}`
      let beforeSelector = `${selector}::before`
      let afterSelector = `${selector}::after`
      let rules = {}

      if (richText) {
        richText = Array.isArray(richText) ? richText : [richText]
        selector = richText.reduce((selectors, tag) => {
          return `${selectors}, .rich-text ${tag}`
        }, selector)
        beforeSelector = richText.reduce((selectors, tag) => {
          return `${selectors}, .rich-text ${tag}::before`
        }, beforeSelector)
        afterSelector = richText.reduce((selectors, tag) => {
          return `${selectors}, .rich-text ${tag}::after`
        }, afterSelector)
      }

      rules[selector] = props

      if (crop) {
        rules[selector].paddingTop = rules[selector].paddingBottom = 1

        rules[`${beforeSelector}, ${afterSelector}`] = {
          content: '""',
          display: 'block',
          width: 0,
          height: 0
        }

        rules[beforeSelector] = {
          marginBottom: getTopCropStyle(crop, props.lineHeight)
        }

        rules[`${afterSelector}`] = {
          marginTop: getBottomCropStyle(crop, props.lineHeight)
        }
      }

      let {
        [selector]: { fontSize: baseFontSize },
        ...responsiveFontSizeComponents
      } = polyFluidSizing(selector, 'fontSize', fontSize, {
        rem: true,
        rootFontSize
      })

      rules[selector].fontSize = baseFontSize
      if (fontFamily) {
        rules[selector].fontFamily =
          fontFamily.constructor === Array
            ? fontFamily
                .map(f => (/[^a-z-]/i.test(f) ? `"${f}"` : f))
                .join(', ')
            : fontFamily
      }
      rules = { ...rules, ...responsiveFontSizeComponents }

      output.push(rules)
    }

    let variants = getVariants('type')
    addComponents(
      Array.isArray(variants) && variants.length > 0
        ? { [`@variants ${variants.join(',')}`]: output }
        : output
    )
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
