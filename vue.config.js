module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'arpos.com',
        productName: "Auto Repuestos",
        publish: ['github'],
        publish: [
          {
            provider: "github",
            owner: "devmiguel23",
            repo: "system-pos-vuetify-frontend"
          }
        ],
        win: {
          "publish": [
            "github"
          ],
          target: [
            "nsis",
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
