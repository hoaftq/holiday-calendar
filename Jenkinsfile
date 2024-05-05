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
        stage('Create UI package') {
            steps {
                dir('holiday-calendar-web') {
                    bat 'xcopy /Y "deployment\\Procfile" dist'
                    zip zipFile: 'dist/holiday-calendar-web.zip', dir: 'dist', overwrite: true
                }
            }
        }
        stage('Upload UI package') {
            steps {
                dir('holiday-calendar-web') {
                    withAWS(credentials: 'AWS Credentials') {
                        bat 'aws s3 cp dist/holiday-calendar-web.zip s3://elasticbeanstalk-holiday-calendar-ap-southeast-1'
                    }
                }
            }
        }
        stage('Create UI Elastic Beanstalk environment') {
            steps {
                dir('holiday-calendar-web/deployment') {
                    withAWS(credentials: 'AWS Credentials', region: 'ap-southeast-1') {
                        script {
                            webStackName = 'holiday-calendar-web'
                            if (isStackExisting(webStackName)) {
                                echo "Elastic Beanstalk stack ${webStackName} already exists. Deploying new source code."
                                deployNewCode()
                            } else {
                                echo 'Create new Elastic Beanstalk stack.'
                                createWebStack(webStackName)
                            }
                        }
                    }
                }
            }
        }
    }
}

def getApiUrl() {
    withAWS(credentials: 'AWS Credentials', region: 'ap-southeast-1') {
        script = '''
                 @echo off
                 aws cloudformation describe-stacks ^
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

def isStackExisting(stackName) {
    script = """
             @echo off
             aws cloudformation list-stacks ^
             --query \"StackSummaries[?StackName == '${stackName}' && StackStatus == 'CREATE_COMPLETE']\"
             """
    output = bat(script: script, returnStdout: true)
    return output.contains(stackName)
}

def createWebStack(webStackName) {
    bat """
        aws cloudformation create-stack ^
        --stack-name ${webStackName} ^
        --template-body file://template.yaml ^
        --capabilities CAPABILITY_NAMED_IAM
        """
}

def deployNewCode() {
    version = createNewVersion()
    bat """
        aws elasticbeanstalk create-application-version ^
        --application-name holiday-calendar-web ^
        --version-label ${version} ^
        --source-bundle S3Bucket=elasticbeanstalk-holiday-calendar-ap-southeast-1,S3Key=holiday-calendar-web.zip
        """
    bat """
        aws elasticbeanstalk update-environment ^
        --environment-name holiday-calendar-web ^
        --version-label ${version}
        """
}

def createNewVersion() {
    new Date().format('yyyyMMdd-HHmmss-SSS')
}
