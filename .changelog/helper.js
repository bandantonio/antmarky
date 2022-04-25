module.exports = (Handlebars) => {
  Handlebars.registerHelper('emoji', (message, options) => {
    const emojies = {
      build: '⚙️',
      chore: 'ℹ️',
      ci: '🚀',
      perf: '🚄',
      refactor: '♻️',
      revert: '⏮️',
      style: '🎨',
      test: '✅'
    }
    
    let match = message.match(/(\w*)(\([\w-]*?\))?:/);
    return match ? emojies[match[1]] + ' ' + message : message
  });
}