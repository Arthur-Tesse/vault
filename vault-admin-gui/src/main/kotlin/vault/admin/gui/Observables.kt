package vault.admin.gui

import javafx.beans.property.SimpleObjectProperty

class ObservablePair<K, V>(
        first: K,
        second: V) {

    private val first = SimpleObjectProperty<K>()
    private val second = SimpleObjectProperty<V>()

    fun firstProperty() =
            first

    fun setFirst(newfirst: K) =
            first.set(newfirst)

    fun getFirst() =
            first.get()

    fun secondProperty() =
            second

    fun setSecond(newsecond: V) =
            second.set(newsecond)

    fun getSecond() =
            second.get()

    init {
        setFirst(first)
        setSecond(second)
    }
}