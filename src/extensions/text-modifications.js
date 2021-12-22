let markyText = (text) => {
  return [
    // ADMONITIONS
    {
      type: 'lang',
      regex: /!!! (\w*) "(.*)"\n(.*)/g,
      replace: '<div class="callout callout-$1"><strong class="callout-title">$2:</strong> $3</div>'
    },
    // SUBSCRIPT
    {
      type: 'lang',
      regex: /~(\d{1})~/g,
      replace: '<sub>$1</sub>'
    },
    // SUPERSCRIPT
    {
      type: 'lang',
      regex: /\^(\d|\w)\^/g,
      replace: '<sup>$1</sup>'
    },
    // TABLE
    {
      type: 'output',
      regex: '<table>',
      replace: '<table class="table">'
    },
    // HIGHLIGHTED TEXT
    {
      type: 'output',
      regex: /==(.*)==/g,
      replace: '<mark>$1</mark>'
    },
  ]
}

module.exports = {
  markyText
}