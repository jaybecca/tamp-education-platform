pipeline {
    agent any

    environment {
        IMAGE_NAME = "tamp-education:latest"
        CONTAINER_NAME = "tamp-education"
        HOST_PORT = "8080"
        CONTAINER_PORT = "80"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME} .
                """
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        ${IMAGE_NAME}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                    docker ps
                    docker images | grep tamp-education
                """
            }
        }
    }

    post {
        success {
            echo '✅ TAMP Education deployed successfully!'
        }

        failure {
            echo '❌ Pipeline failed. Check the console output.'
        }

        always {
            cleanWs()
        }
    }
}