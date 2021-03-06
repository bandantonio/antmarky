module.exports = (Handlebars) => {
  Handlebars.registerHelper('emoji', (message, options) => {
    const emojies = {
      build: 'âī¸',
      chore: 'âšī¸',
      ci: 'đ',
      perf: 'đ',
      refactor: 'âģī¸',
      revert: 'âŽī¸',
      style: 'đ¨',
      test: 'â'
    }
    
    let match = message.match(/(\w*)(\([\w-]*?\))?:/);
    return match ? emojies[match[1]] + ' ' + message : message
  });
}