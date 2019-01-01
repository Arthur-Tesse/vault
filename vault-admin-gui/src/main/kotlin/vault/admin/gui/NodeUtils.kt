@file:JvmName("NodeUtils")

package vault.admin.gui

import javafx.scene.Node
import javafx.scene.control.TableColumn
import javafx.scene.control.TableColumnBase


fun Node.removeCssClass(cssClass: String) {
    if (cssClass in styleClass) styleClass.remove(cssClass)
}

fun Node.addCssClass(cssClass: String) {
    if (cssClass !in styleClass) styleClass.add(cssClass)
}

fun TableColumn<*, *>.disableReordering() {

    (TableColumnBase::class.java.methods
            .first { "setReorderable" in it.name })(this,
                                                    false)
}