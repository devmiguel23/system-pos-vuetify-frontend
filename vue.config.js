module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        publish: ['github'],

        productName: "Auto Repuestos",
        appId: 'arpos.com',
        win: {
          target: [
            "nsis"
          ],
          icon: 'public/favicon.ico',
          requestedExecutionLevel: "requireAdministrator"
        },
        nsis: {
          installerIcon: "public/favicon.ico",
          uninstallerIcon: "public/favicon.ico",
          uninstallDisplayName: "Uninstall ARPOS",
          // license: "license.txt",
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        }
      },
      nodeIntegration: true,
      // customFileProtocol: './'
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
