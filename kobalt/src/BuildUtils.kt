import kotlin.reflect.KProperty
import com.beust.kobalt.project as kProject

const val GROUP = "vault"
const val VERSION = "0-SNAPSHOT"

fun <T> declare(
        toDeclare: T,
        init: T.() -> Unit) =
        init(toDeclare)

fun Dependencies.compile(
        group: String,
        name: String,
        version: String
) =
        compile("$group:$name:$version")

private val projects = mutableMapOf<String, Project>()

fun project(init: Project.() -> Unit = {}): ReadOnlyProperty<Nothing?, Project> {

    return object : ReadOnlyProperty<Nothing?, Project> {
        override fun getValue(
                thisRef: Nothing?,
                property: KProperty<*>
        ): Project {
            val projectName = property.name
            if (projectName in projects)
                return projects[projectName]!!
            val project = kProject {

                this.name = projectName
                this.artifactId = projectName
                this.directory = projectName
                this.group = GROUP
                this.version = VERSION
            }.apply(init)
            projects[projectName] = project
            return project
        }
    }
}