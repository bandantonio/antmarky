import ErrorPage from "./ErrorPage";

interface DefaultSettings {
    docsDirectory: string,
    outputDirectory: string
    assetsDirectory: string,
    userStaticAssetsDirectory: string,
    viewsDirectory: string,
    errorPage: ErrorPage
  }

  export default DefaultSettings;