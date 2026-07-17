
pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t tamp-education:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                    docker stop tamp-education || true
                    docker rm tamp-education || true

                    docker run -d \
                    --name tamp-education \
                    -p 8080:80 \
                    tamp-education:latest
                '''
            }
        }
    }
}