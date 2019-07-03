plugins {
    
    kotlin("jvm") version "1.3.40"
    id("org.openjfx.javafxplugin") version "0.0.7"
    application
}

dependencies {
    
    implementation(kotlin("stdlib"))
    implementation(project(":vault-data"))
    implementation("com.beust:klaxon:5.0.7")
    implementation("io.ktor:ktor-client:1.2.2")
    implementation("io.ktor:ktor-client-apache:1.2.2")
    implementation("org.controlsfx:controlsfx:11.0.0")
    implementation("com.vladsch.flexmark:flexmark:0.50.16")
    implementation("com.vladsch.flexmark:flexmark-ext-gfm-strikethrough:0.50.16")
    implementation("com.vladsch.flexmark:flexmark-ext-ins:0.50.16")
    implementation("com.vladsch.flexmark:flexmark-ext-tables:0.50.16")
    implementation("com.vladsch.flexmark:flexmark-ext-autolink:0.50.16")
    implementation("com.vladsch.flexmark:flexmark-ext-emoji:0.50.16")
}

repositories { 
    
    jcenter()
}

javafx {

    version = "12.0.1"
    modules = listOf("javafx.fxml", "javafx.web")
}