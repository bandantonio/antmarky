let markyText = (text) => {
  return [
    // CROSS-FILES LINKS md -> html
    {
      type: 'output',
      regex: /<a href="([\s\S]*?).md(#[\s\S]*?)?">([\s\S]*?)<\/a>/g,
      replace: '<a href="$1.html$2">$3</a>'
    },
    // ADMONITIONS
    {
      type: 'output',
      regex: /\<p>::: (\w*) "(.*)"\n([\S\s]*?):::<\/p>/g,
      replace: '<div class="callout callout-$1"><strong class="callout-title">$2</strong><p>$3</p></div>'
    },
    // SUBSCRIPT
    {
      type: 'output',
      regex: /~(\d{1})~/g,
      replace: '<sub>$1</sub>'
    },
    // SUPERSCRIPT
    {
      type: 'output',
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
    }
  ]
}

module.exports = {
  markyText
}