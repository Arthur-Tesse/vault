plugins {

    kotlin("jvm") version "1.3.40"
    application
}

dependencies {

    implementation(kotlin("stdlib"))
    implementation("io.ktor:ktor-server-core:1.2.2")
    implementation("io.ktor:ktor-server-cio:1.2.2")
    implementation("io.ktor:ktor-html-builder:1.2.2")
    implementation("io.ktor:ktor-auth-jwt:1.2.2")
    implementation("ch.qos.logback:logback-classic:1.2.3")
    implementation("org.litote.kmongo:kmongo-native:3.10.2")
    implementation("net.sf.jopt-simple:jopt-simple:5.0.4")
    implementation("com.beust:klaxon:5.0.2")

    implementation(project(":vault-data"))
}

repositories {

    jcenter()
}

application.mainClassName = "vault.server.VServerKt"