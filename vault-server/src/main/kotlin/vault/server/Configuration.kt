package vault.server

import com.mongodb.ServerAddress
import joptsimple.ArgumentAcceptingOptionSpec
import joptsimple.OptionParser
import joptsimple.OptionSet
import joptsimple.OptionSpec
import java.io.File
import java.util.*

class Configuration(vararg args: String) {

    val vaultPort: Int
    val mongoName: String
    val mongoHost: String
    val mongoPort: Int
    val webDir: File
    val jwtSecret: String

    init {

        val parser = OptionParser()
        val vaultPortOption = parser("p",
                                     "vault-port",
                                     description = "Vault's port")
                .withRequiredArg()
                .typedAs<Int>()
                .defaultsTo(8080)
        val mongoHostOption = parser("mh",
                                     "mongo-host",
                                     description = "MongoDB's host")
                .withRequiredArg()
                .typedAs<String>()
                .defaultsTo(ServerAddress.defaultHost())
        val mongoNameOption = parser("mn",
                                     "mongo-name",
                                     description = "Vault database's name in MongoDB")
                .withRequiredArg()
                .typedAs<String>()
                .defaultsTo("vault")
        val mongoPortOption = parser("mp",
                                     "mongo-port",
                                     description = "MongoDB's port")
                .withRequiredArg()
                .typedAs<Int>()
                .defaultsTo(ServerAddress.defaultPort())
        val webDirOption = parser("w",
                                  "wd",
                                  "web",
                                  description = "Vault's web directory")
                .withRequiredArg()
                .typedAs<File>()
                .defaultsTo(File("www"))
        val jwtSecretOption = parser("jwt",
                                     description = "JWT's secret string")
                .withRequiredArg()
                .typedAs<String>()
                .defaultsTo(UUID.randomUUID()
                                    .toString())
        val parsed = parser.parse(*args)
        mongoName = parsed[mongoNameOption]
        mongoHost = parsed[mongoHostOption]
        mongoPort = parsed[mongoPortOption]
        vaultPort = parsed[vaultPortOption]
        webDir = parsed[webDirOption]
                .canonicalFile
                .absoluteFile
        jwtSecret = parsed[jwtSecretOption]
    }

    private operator fun OptionParser.invoke(
            vararg options: String,
            description: String
    ) =
            acceptsAll(listOf(*options),
                       description)

    private inline fun <reified T : Any> ArgumentAcceptingOptionSpec<*>.typedAs() =
            ofType(T::class.java)

    private operator fun <V> OptionSet.get(spec: OptionSpec<V>): V =
            valueOf(spec)
}