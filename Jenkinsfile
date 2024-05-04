pipeline {
    agent any
    stages {
        stage('Build api') {
            steps {
                dir('holiday-calendar-lambda') {
                    bat 'sam build'
                }
            }
        }
        stage('Deploy api') {
            steps {
                withAWS(credentials: 'AWS Credentials') {
                    dir('holiday-calendar-lambda') {
                        bat 'sam deploy --config-env prod'
                    }
                }
            }
        }
    }
}
