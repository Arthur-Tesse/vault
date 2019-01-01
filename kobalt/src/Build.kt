val repos = declare(Repositories) {

    +("https://jcenter.bintray.com/" named "JCenter")
}

val `vault-data` by project {

    dependencies {

        compile(group = "org.jetbrains.kotlin",
                name = "kotlin-stdlib",
                version = Versions.kotlin)
        compile(group = "com.beust",
                name = "klaxon",
                version = Versions.klaxon)
    }
}

val `vault-admin-gui` by project {

    dependsOn(`vault-data`)

    dependencies {

        compile(group = "org.jetbrains.kotlin",
                name = "kotlin-stdlib",
                version = Versions.kotlin)
        compile(group = "com.beust",
                name = "klaxon",
                version = Versions.klaxon)
        compile(group = "io.ktor",
                name = "ktor-client",
                version = Versions.ktor)
        compile(group = "io.ktor",
                name = "ktor-client-apache",
                version = Versions.ktor)
        compile(group = "org.openjfx",
                name = "javafx-fxml",
                version = Versions.openjfx)
        compile(group = "org.openjfx",
                name = "javafx-web",
                version = Versions.openjfx)
        compile(group = "com.vladsch.flexmark",
                name = "flexmark",
                version = Versions.flexmark)
        compile(group = "com.vladsch.flexmark",
                name = "flexmark-ext-gfm-strikethrough",
                version = Versions.flexmark)
        compile(group = "com.vladsch.flexmark",
                name = "flexmark-ext-ins",
                version = Versions.flexmark)
        compile(group = "com.vladsch.flexmark",
                name = "flexmark-ext-tables",
                version = Versions.flexmark)
        compile(group = "com.vladsch.flexmark",
                name = "flexmark-ext-autolink",
                version = Versions.flexmark)
        compile(group = "com.vladsch.flexmark",
                name = "flexmark-ext-emoji",
                version = Versions.flexmark)
        compile(group = "org.controlsfx",
                name = "controlsfx",
                version = Versions.controlsfx)
    }


    kotlinCompiler {

        args("-jvm-target",
             "1.8",
             "-language-version",
             "1.3")
    }
}

val `vault-server` by project {

    dependsOn(`vault-data`)

    dependencies {

        compile(group = "org.jetbrains.kotlin",
                name = "kotlin-stdlib",
                version = Versions.kotlin)
        compile(group = "io.ktor",
                name = "ktor-server-core",
                version = Versions.ktor)
        compile(group = "io.ktor",
                name = "ktor-server-cio",
                version = Versions.ktor)
        compile(group = "io.ktor",
                name = "ktor-html-builder",
                version = Versions.ktor)
        compile(group = "io.ktor",
                name = "ktor-auth-jwt",
                version = Versions.ktor)
        compile(group = "ch.qos.logback",
                name = "logback-classic",
                version = Versions.logback)
        compile(group = "org.litote.kmongo",
                name = "kmongo-native",
                version = Versions.kmongo)
        compile(group = "net.sf.jopt-simple",
                name = "jopt-simple",
                version = Versions.jOptSimple)
        compile(group = "com.beust",
                name = "klaxon",
                version = Versions.klaxon)
    }

    kotlinCompiler {

        args("-jvm-target",
             "1.8",
             "-language-version",
             "1.3")
    }
}

val `vault-frontend` by project {
}
        