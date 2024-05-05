pipeline {
    agent any
    stages {
        stage('Build API') {
            steps {
                dir('holiday-calendar-lambda') {
                    bat 'sam build'
                }
            }
        }
        stage('Deploy API') {
            steps {
                withAWS(credentials: 'AWS Credentials') {
                    dir('holiday-calendar-lambda') {
                        bat 'sam deploy --config-env prod --no-fail-on-empty-changeset'
                    }
                }
            }
        }
        stage('Configure UI') {
            steps {
                script {
                    apiUrl = getApiUrl()
                    replaceApiUrl apiUrl
                }
            }
        }
        stage('Install UI dependencies') {
            steps {
                dir('holiday-calendar-web') {
                    bat 'npm install'
                }
            }
        }
        stage('Build UI') {
            steps {
                dir('holiday-calendar-web') {
                    bat 'npm run build:prod'
                }
            }
        }
        stage('Create deployment package') {
            steps {
                dir('holiday-calendar-web') {
                    bat 'xcopy /Y "deployment\\Procfile" dist'
                    zip zipFile: 'dist/holiday-calendar-web.zip', dir: 'dist'
                }
            }
        }
    }
}

def getApiUrl() {
    withAWS(credentials: 'AWS Credentials') {
        script = '''
                 @echo off
                 aws cloudformation describe-stacks ^
                 --region ap-southeast-1 ^
                 --stack-name holiday-calendar-lambda ^
                 --query "Stacks[0].Outputs[?OutputKey==\'HolidayCalendarApi\'].OutputValue" ^
                 --output text
                 '''
        apiUrl = bat(script: script, returnStdout: true)
        return apiUrl.replaceAll('\\r?\\n$', '')
    }
}

def replaceApiUrl(apiUrl) {
    environmentFile = 'holiday-calendar-web/src/environments/environment.ts'
    content = readFile(environmentFile)
    newContent = content.replace('<prod-api-url-place-holder>', apiUrl)

    echo "Override environment.ts with: ${newContent}"
    writeFile(file: environmentFile, text: newContent)
}
