package vault.data

import java.time.LocalDateTime
import java.util.*

data class TaggedObject(
        val uuid: UUID = UUID.randomUUID(),
        val name: String,
        val type: TaggedObjectType,
        val added: LocalDateTime = LocalDateTime.now(),
        val tags: MutableList<String> = mutableListOf(),
        val metadata: MutableMap<String, String> = mutableMapOf()
) {

    init {

        if (name.trim().isBlank())
            throw IllegalArgumentException("TaggedObject can't have a blank name")
    }
}