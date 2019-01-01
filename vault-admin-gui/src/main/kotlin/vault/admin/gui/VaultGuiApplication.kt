package vault.admin.gui

import javafx.application.Application
import javafx.fxml.FXMLLoader
import javafx.scene.Parent
import javafx.scene.Scene
import javafx.scene.image.Image
import javafx.stage.Stage
import java.util.*

fun main(args: Array<String>) {

    Application.launch(VaultGuiApplication::class.java)
}

class VaultGuiApplication : Application() {


    companion object ApplicationStatics {

        lateinit var stage: Stage
            private set
        lateinit var application: Application
            private set
        val favicon = Image(this::class.java.getResourceAsStream("/assets/favicon.png"))
    }

    override fun init() {
        super.init()
        application = this
    }

    override fun start(primaryStage: Stage) {

        stage = primaryStage
        realStart()
    }

    private fun realStart() {

        val loader = FXMLLoader(VaultGuiApplication::class.java.getResource("/assets/main_scene.fxml"))
        val resources = ResourceBundle.getBundle("lang/all",
                                                 Locale.getDefault())
        loader.resources = resources
        loader.load<Parent>()
        val scene = Scene(loader.getRoot())
        stage.scene = scene
        stage.title = resources.getString("windowTitle.main")
        stage.icons += favicon
        stage.show()
    }

    override fun stop() {
        super.stop()
    }
}