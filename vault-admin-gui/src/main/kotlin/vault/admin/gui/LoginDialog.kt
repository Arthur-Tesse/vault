package vault.admin.gui

import javafx.fxml.FXML
import javafx.fxml.FXMLLoader
import javafx.scene.control.*
import javafx.util.Callback
import java.util.*

class LoginDialog(
        resourceBundle: ResourceBundle) : Dialog<Pair<String, String>>() {

    init {

        title = resourceBundle.getString("windowTitle.login")
        val pane = LoginDialogPane(resourceBundle)
        dialogPane = pane
        resultConverter = Callback { buttonType: ButtonType? ->

            if (buttonType == null)
                return@Callback null
            else
                return@Callback Pair(pane.username.text,
                                     pane.password.text)
        }
    }

    private class LoginDialogPane(resourceBundle: ResourceBundle) : DialogPane() {

        @Suppress("unused")
        @FXML
        lateinit var password: PasswordField
        @Suppress("unused")
        @FXML
        lateinit var username: TextField

        init {

            val loader = FXMLLoader(this::class.java.getResource("/assets/login_dialog.fxml"))
            loader.setController(this)
            loader.resources = resourceBundle
            loader.setRoot(this)
            loader.load<Any>()
            this.buttonTypes += ButtonType(resourceBundle.getString("button.login"))
        }
    }
}