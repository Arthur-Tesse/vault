package vault.server

import io.ktor.auth.Principal
import java.util.*

class User(
        uuid: UUID,
        username: String,
        val password: String
) : SimpleUser(uuid,
               username) {

    fun toSimpleUser() =
            SimpleUser(uuid,
                       username)
}

open class SimpleUser(
        val uuid: UUID,
        val username: String
) : Principal {

    override fun toString() =
            "User[uuid=$uuid, username=\"$username\"]"
}