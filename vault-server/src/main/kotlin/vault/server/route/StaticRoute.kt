package vault.server.route

import io.ktor.application.call
import io.ktor.http.content.file
import io.ktor.http.content.files
import io.ktor.http.content.static
import io.ktor.response.respondFile
import io.ktor.routing.Route
import io.ktor.routing.get
import vault.server.configuration

fun Route.pages() {

    get {

        call.respondFile(configuration.webDir,
                         "index.html")
    }

    get("obj/{uuid}") {

        call.respondFile(configuration.webDir,
                         "object.html")
    }

    get("licenses") {

        call.respondFile(configuration.webDir,
                         "licenses.html")
    }

    get("search") {

        call.respondFile(configuration.webDir,
                         "search_results.html")
    }

    get("admin") {

        call.respondFile(configuration.webDir,
                         "admin.html")
    }
}

fun Route.assets() {

    file("favicon.ico",
         configuration.webDir.resolve("favicon.png"))
    file("favicon.png",
         configuration.webDir.resolve("favicon.png"))

    static(remotePath = "assets") {

        files(configuration.webDir.resolve("assets"))
    }
}