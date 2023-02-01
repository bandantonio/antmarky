import DefaultSettings from "./interfaces/DefaultSettings";

const defaultSettings: DefaultSettings = {
  docsDirectory: 'docs',
  outputDirectory: 'public',
  assetsDirectory: 'src/assets',
  userStaticAssetsDirectory: 'static',
  viewsDirectory: 'src/views',
  errorPage: {
    title: 'Not Found',
    html: '<p>Oops, no content found</p>'
  }
}
export default defaultSettings;
