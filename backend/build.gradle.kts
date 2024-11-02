plugins {
	java
	jacoco
	checkstyle
	id("org.springframework.boot") version "3.3.5"
	id("io.spring.dependency-management") version "1.1.4"
	id("org.openapi.generator") version "7.1.0"
	id("com.github.ben-manes.versions") version "0.50.0"
}

group = "info.seltenheim"
version = "1.0.0-SNAPSHOT"
description = "ssponline-backend"

java {
	sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
	mavenLocal()
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-aop")
	implementation("org.springframework.retry:spring-retry")

	// database
	implementation("com.h2database:h2")
	implementation("org.liquibase:liquibase-core")

	// email
	implementation("com.mailjet:mailjet-client:5.2.5")

	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
}

tasks.test {
	useJUnitPlatform()
	setTestNameIncludePatterns(listOf(
		"*UT",
		"*IT",
	))
}

tasks.jacocoTestReport {
	reports {
		xml.required.set(true)
	}
}

tasks.bootBuildImage {
	imageName = "juliusse/ssponline-backend"
}

springBoot {
	buildInfo()
}

tasks.withType<JavaCompile> {
	options.encoding = "UTF-8"
}

checkstyle {
	toolVersion = "9.3"
	configFile = file("$projectDir/checkstyle.xml")
	maxWarnings = 0
	maxErrors = 0
}
