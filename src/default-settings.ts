interface ErrorPage {
  text: string,
  title: string
}

interface DefaultSettings {
  docsDirectory: string,
  outputDirectory: string
  assetsDirectory: string,
  viewsDirectory: string,
  errorPage: ErrorPage
}

const defaultSettings: DefaultSettings = {
  docsDirectory: 'docs',
  outputDirectory: 'public',
  assetsDirectory: 'assets',
  viewsDirectory: 'src/views',
  errorPage: {
    text: 'Oops, no content found',
    title: 'Not Found'
  }
}
export default defaultSettings;
