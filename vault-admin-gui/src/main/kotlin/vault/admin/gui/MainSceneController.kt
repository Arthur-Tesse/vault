package vault.admin.gui

import com.beust.klaxon.json
import com.vladsch.flexmark.ext.autolink.AutolinkExtension
import com.vladsch.flexmark.ext.emoji.EmojiExtension
import com.vladsch.flexmark.ext.emoji.internal.EmojiReference
import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension
import com.vladsch.flexmark.ext.ins.InsExtension
import com.vladsch.flexmark.ext.tables.TablesExtension
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import io.ktor.client.HttpClient
import io.ktor.client.call.call
import io.ktor.client.call.receive
import io.ktor.client.engine.apache.Apache
import io.ktor.client.request.header
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import javafx.beans.property.SimpleStringProperty
import javafx.event.EventHandler
import javafx.fxml.FXML
import javafx.scene.Node
import javafx.scene.control.*
import javafx.scene.control.cell.TextFieldTableCell
import javafx.scene.input.KeyCode
import javafx.scene.input.KeyEvent
import javafx.scene.input.MouseButton
import javafx.scene.input.MouseEvent
import javafx.scene.layout.FlowPane
import javafx.scene.layout.VBox
import javafx.scene.paint.Color
import javafx.scene.shape.Circle
import javafx.scene.text.Font
import javafx.scene.web.WebView
import javafx.stage.Modality
import javafx.util.StringConverter
import kotlinx.coroutines.runBlocking
import org.controlsfx.control.textfield.TextFields
import vault.data.TaggedObjectType
import java.util.*
import javafx.util.Pair as FXPair

class MainSceneController {

    @FXML
    lateinit var resources: ResourceBundle
    @FXML
    lateinit var basicInfoPane: VBox
    @FXML
    lateinit var basicInfoButton: VBox
    @FXML
    lateinit var tagsPane: VBox
    @FXML
    lateinit var tagsButton: VBox
    @FXML
    lateinit var contentPane: SplitPane
    @FXML
    lateinit var contentButton: VBox
    @FXML
    lateinit var metadataPane: VBox
    @FXML
    lateinit var metadataButton: VBox
    @FXML
    lateinit var typeChooser: ComboBox<TaggedObjectType>
    @FXML
    lateinit var tagsFlow: FlowPane
    @FXML
    lateinit var tagInput: TextField
    @FXML
    lateinit var contentEnabledCheckbox: CheckBox
    @FXML
    lateinit var contentMarkdownArea: TextArea
    @FXML
    lateinit var contentPreview: WebView
    @FXML
    lateinit var metadataTableView: TableView<ObservablePair<String, String>>
    @FXML
    lateinit var metadataNameColumn: TableColumn<ObservablePair<String, String>, String>
    @FXML
    lateinit var metadataValueColumn: TableColumn<ObservablePair<String, String>, String>
    @FXML
    lateinit var metadataNameInput: TextField
    @FXML
    lateinit var metadataValueInput: TextField
    @FXML
    lateinit var tokenStatus: Circle
    @FXML
    lateinit var nameInput: TextField

    private val httpClient = HttpClient(Apache)
    private val metadataNamePresets = listOf("duration",
                                             "kitsu-id",
                                             "format",
                                             "resolution",
                                             "author",
                                             "file-count",
                                             "availability"
    )
    private var accessToken = SimpleStringProperty()

    private val extensions = listOf(AutolinkExtension.create(),
                                    EmojiExtension.create(),
                                    StrikethroughExtension.create(),
                                    TablesExtension.create(),
                                    InsExtension.create())
    private val parser = Parser.builder()
            .extensions(extensions)
            .build()
    private val renderer = (HtmlRenderer.builder()
            .extensions(extensions)
            .set(EmojiExtension.ROOT_IMAGE_PATH,
                 EmojiReference.githubUrl) as HtmlRenderer.Builder)
            .build()

    @FXML
    fun initialize() {

        (TextFields.bindAutoCompletion(metadataNameInput) { request ->

            if (request.isCancelled)
                return@bindAutoCompletion emptyList<String>()
            metadataNamePresets.filter {
                it.startsWith(request.userText,
                              ignoreCase = true)
            }
        }).apply {

            setHideOnEscape(true)
        }
        accessToken.addListener { _, _, new ->

            tokenStatus.fill = if (new.isNullOrBlank()) Color.RED else Color.GREEN
        }
        typeChooser.converter = object : StringConverter<TaggedObjectType>() {

            override fun toString(obj: TaggedObjectType?): String {

                if (obj == null)
                    return ""
                return _l("objectType.${obj.name.toLowerCase()}")
            }

            override fun fromString(str: String) =
                    TaggedObjectType.valueOf(str.toUpperCase())

        }

        typeChooser.items.addAll(TaggedObjectType.values())
        contentEnabledCheckbox.selectedProperty()
                .addListener { _, _, new ->
                    contentButton.isDisable = !new
                }
        contentPane.dividers[0].positionProperty()
                .addListener { _, _, _ ->
                    contentPane.setDividerPosition(0,
                                                   .5)
                }
        contentMarkdownArea.textProperty()
                .addListener { _, _, newValue ->

                    contentPreview.engine.loadContent(renderer.render(parser.parse(newValue)))
                }
        metadataNameColumn.setCellValueFactory { it.value.firstProperty() }
        metadataNameColumn.prefWidthProperty()
                .bind(metadataTableView.widthProperty()
                              .divide(2))
        metadataValueColumn.setCellValueFactory { it.value.secondProperty() }
        metadataValueColumn.cellFactory = TextFieldTableCell.forTableColumn()
        metadataValueColumn.prefWidthProperty()
                .bind(metadataTableView.widthProperty()
                              .divide(2))
        metadataTableView.columns
                .forEach { it.disableReordering() }
        switchPane(basicInfoPane,
                   basicInfoButton)
    }

    fun categoryClicked(mouseEvent: MouseEvent) {

        if (mouseEvent.source !is Node || mouseEvent.button != MouseButton.PRIMARY)
            return
        if ((mouseEvent.source as Node).isDisable)
            return

        switchPane(when ((mouseEvent.source as Node)) {

                       basicInfoButton -> basicInfoPane
                       contentButton   -> contentPane
                       metadataButton  -> metadataPane
                       tagsButton      -> tagsPane
                       else            -> throw RuntimeException("WTF !")
                   },
                   mouseEvent.source as VBox)
    }

    private fun switchPane(
            pane: Node,
            tab: VBox) {

        arrayOf(basicInfoPane,
                contentPane,
                metadataPane,
                tagsPane,
                basicInfoButton,
                contentButton,
                metadataButton,
                tagsButton).forEach {

            it.removeCssClass("active")
        }

        tab.addCssClass("active")
        pane.addCssClass("active")
        pane.toFront()
        pane.requestFocus()
    }

    fun addTag() {

        if (!tagInput.text.matches("[A-Za-z0-9-]+".toRegex())) {

            showAlert(title = _l("windowTitle.error"),
                      header = _l("alert.invalidTag.header"),
                      content = _l("alert.invalidTag.content"),
                      type = Alert.AlertType.ERROR)
            return
        }

        if (tagInput.text !in tagsFlow.children.asSequence().filterIsInstance(Label::class.java).map(Label::getText))
            tagsFlow.children
                    .add(Label(tagInput.text)
                                 .apply {

                                     font = Font(font.family,
                                                 14.0)
                                     onMouseClicked = EventHandler { event ->

                                         if (event.button == MouseButton.PRIMARY && event.clickCount >= 2)
                                             tagsFlow.children
                                                     .remove(this)
                                     }
                                 })
        tagInput.clear()
    }

    fun tagInputKeyPressed(keyEvent: KeyEvent) {

        if (keyEvent.code == KeyCode.ENTER)
            addTag()
    }

    fun deleteSelectedMetadata() {

        metadataTableView.items
                .removeAll(metadataTableView.selectionModel
                                   .selectedItems)
    }

    fun addMetadata() {

        if (!metadataValueInput.text.matches("[A-Za-z0-9- ]+".toRegex())
                || !metadataNameInput.text.matches("[A-Za-z0-9-]+".toRegex())
                || metadataNameInput.text.toLowerCase().trim() == "content") {
            showAlert(title = _l("windowTitle.error"),
                      header = _l("alert.invalidMetadata.header"),
                      content = _l("alert.invalidMetadata.content"),
                      type = Alert.AlertType.ERROR)
            return
        }

        val keyValuePair = ObservablePair<String, String>(metadataNameInput.text,
                                                          metadataValueInput.text)
        if (keyValuePair.getSecond() !in metadataTableView.items.map(ObservablePair<String, String>::getFirst))
            metadataTableView.items.add(keyValuePair)

        metadataValueInput.clear()
        metadataNameInput.clear()
    }

    fun metadataInputKeyPressed(keyEvent: KeyEvent) {

        if (keyEvent.code == KeyCode.ENTER)
            addMetadata()
    }

    fun metadataValueEditFinished(event: TableColumn.CellEditEvent<ObservablePair<String, String>, String>) {

        if (event.newValue.matches("[A-Za-z0-9-]+".toRegex()))
            metadataTableView.items[event.tablePosition.row].setSecond(event.newValue)
    }

    fun send() {

        if (!checkToken()) {

            showAlert("Object Transfer",
                      "Bad access token",
                      "Your access token is absent or isn't valid anymore.\nConsider getting a new one.",
                      Alert.AlertType.ERROR)
            return
        }
        val obj = (json {
            obj(

                    "name" to nameInput.text.ifBlank { throw IllegalArgumentException("name == null or empty") },
                    "type" to typeChooser.value.name,
                    "tags" to array(tagsFlow.children.map { (it as Label).text }),
                    "metadata" to obj(metadataTableView.items.map { it.getFirst() to it.getSecond() }
                                              .toMutableList()
                                              .apply {
                                                  if (contentEnabledCheckbox.isSelected)
                                                      add("content" to String(Base64.getEncoder()
                                                                                      .encode(contentMarkdownArea.text
                                                                                                      .ifBlank { throw IllegalArgumentException("content blank or null") }
                                                                                                      .toByteArray())))
                                              }))
        }).toJsonString()
        runBlocking {

            val call = httpClient.call("http://localhost:8080/api/object/") {

                method = HttpMethod.Put
                header(HttpHeaders.Authorization,
                       "Bearer ${accessToken.get()}")
                body = obj
            }
            if (call.response.status.value == 201)
                showAlert("Object Transfer",
                          "Success",
                          "The object is available with id ${call.response.receive<String>()}",
                          Alert.AlertType.NONE)
        }
    }

    private fun checkToken() =
            runBlocking {

                if (accessToken.get().isNullOrBlank())
                    return@runBlocking false
                val call = httpClient.call("http://localhost:8080/api/auth/test") {

                    method = HttpMethod.Get
                    header(HttpHeaders.Authorization,
                           "Bearer " + accessToken.get())
                }
                return@runBlocking call.response.status.value == 200 && call.response.receive<String>() == "OK"
            }

    fun refreshToken() {

        if (!checkToken()) with(LoginDialog(resources).showAndWait()) {

            if (isEmpty)
                return@refreshToken
            val userPass = get()
            accessToken.set(runBlocking {

                val call = httpClient.call("http://localhost:8080/api/auth/by-username/${userPass.first}") {

                    method = HttpMethod.Post
                    body = userPass.second
                }
                if (call.response.status.value == 200) call.response.receive<String>()
                else null
            })
        } else {

            showAlert(title = _l("windowTitle.information"),
                      header = _l("alert.validToken.header"),
                      content = _l("alert.validToken.content"),
                      type = Alert.AlertType.INFORMATION)
        }
    }

    @Suppress("FunctionName")
    private fun _l(key: String) =
            try {
                resources.getString(key)
            } catch (ex: Exception) {
                println("Couldn't find $key in i18n file. Falling")
                key
            }

    fun openOnGithub() =
            VaultGuiApplication.application.hostServices.showDocument("https://github.com/Arthur-Tesse/vault")
}

fun showAlert(
        title: String,
        header: String,
        content: String,
        type: Alert.AlertType) =
        Alert(type)
                .apply {

                    initOwner(VaultGuiApplication.stage)
                    initModality(Modality.APPLICATION_MODAL)
                    this.title = title
                    this.headerText = header
                    this.contentText = content
                }
                .showAndWait()!!