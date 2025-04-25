pipeline {
    agent any
    //Hola
    tools {
        maven 'Maven 3.9.9'
        jdk 'Java 21'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Compilando proyecto...'
                sh 'chmod +x ./mvnw'  // Agregar este paso
                sh './mvnw clean install'
            }
        }

        stage('Tests') {
            steps {
                echo 'Ejecutando tests...'
                sh './mvnw test'
            }
        }

        stage('Empaquetar') {
            steps {
                echo 'Empaquetando...'
                sh './mvnw package -DskipTests'
            }
        }

        stage('Análisis de Código') {
            steps {
                echo 'Analizando código con SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    sh './mvnw sonar:sonar -Dsonar.host.url=http://172.18.0.6:9000 -Dsonar.login=admin -Dsonar.password=admin'
                }
            }
        }

        stage('Publicar en Nexus') {
            steps {
                echo 'Publicando artefactos en Nexus...'
                withCredentials([usernamePassword(credentialsId: 'nexus-admin', 
                                                 usernameVariable: 'NEXUS_USER', 
                                                 passwordVariable: 'NEXUS_PASSWORD')]) {
                    sh '''
                        ./mvnw deploy -DskipTests \
                        -DaltDeploymentRepository=nexus::default::http://172.18.0.3:8081/repository/maven-releases/ \
                        -DrepositoryId=nexus \
                        -Durl=http://172.18.0.3:8081/repository/maven-releases/ \
                        -Dusername=${NEXUS_USER} \
                        -Dpassword=${NEXUS_PASSWORD}
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Desplegar en Desarrollo') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Desplegando en ambiente de desarrollo...'
                // Comandos para desplegar en servidor de desarrollo
            }
        }

        stage('Desplegar en Producción') {
            when {
                branch 'main'
            }
            steps {
                echo 'Desplegando en producción...'
                // Comandos para desplegar en servidor de producción
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito!'
            // Enviar notificación de éxito
        }
        failure {
            echo 'El pipeline ha fallado!'
            // Enviar notificación de fallo
        }
    }
}
