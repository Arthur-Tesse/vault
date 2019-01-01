object Repositories {

    infix fun String.named(name: String) =
            HostConfig(url = this,
                       name = name)

    operator fun String.unaryPlus() =
            Kobalt.addRepo(HostConfig(this))

    operator fun HostConfig.unaryPlus() =
            Kobalt.addRepo(this)
}