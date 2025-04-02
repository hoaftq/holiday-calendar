pipeline {
    agent any
    tools {
        nodejs 'nodejs14'
    }
    stages {
        stage('Build API') {
            steps {
                dir('holiday-calendar-lambda') {
                    sh 'sam build --use-container --build-image public.ecr.aws/sam/build-java21:1.136.0'
                }
            }
        }

        stage('Deploy API') {
            steps {
                withAWS(credentials: 'holiday-calendar') {
                    dir('holiday-calendar-lambda') {
                        sh 'sam deploy --config-env prod --no-fail-on-empty-changeset'
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
                    sh 'npm install'
                }
            }
        }
        stage('Build UI') {
            steps {
                dir('holiday-calendar-web') {
                    sh 'npm run build:prod'
                }
            }
        }
        stage('Create UI package') {
            steps {
                dir('holiday-calendar-web') {
                    sh 'cp -f deployment/Procfile dist'
                    zip zipFile: 'dist/holiday-calendar-web.zip', dir: 'dist', overwrite: true
                }
            }
        }
        stage('Upload UI package') {
            steps {
                dir('holiday-calendar-web') {
                    withAWS(credentials: 'holiday-calendar') {
                        sh 'aws s3 cp dist/holiday-calendar-web.zip s3://elasticbeanstalk-holiday-calendar-ap-southeast-1'
                    }
                }
            }
        }
        stage('Create UI Elastic Beanstalk environment') {
            steps {
                dir('holiday-calendar-web/deployment') {
                    withAWS(credentials: 'holiday-calendar', region: 'ap-southeast-1') {
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
    withAWS(credentials: 'holiday-calendar', region: 'ap-southeast-1') {
        script = '''
                 aws cloudformation describe-stacks \
                 --stack-name holiday-calendar-lambda \
                 --query "Stacks[0].Outputs[?OutputKey==\'HolidayCalendarApi\'].OutputValue" \
                 --output text
                 '''
        apiUrl = sh(script: script, returnStdout: true)
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
             aws cloudformation list-stacks \
             --query \"StackSummaries[?StackName == '${stackName}' && StackStatus == 'CREATE_COMPLETE']\"
             """
    output = sh(script: script, returnStdout: true)
    return output.contains(stackName)
}

def createWebStack(webStackName) {
    sh """
        aws cloudformation create-stack \
        --stack-name ${webStackName} \
        --template-body file://template.yaml \
        --capabilities CAPABILITY_NAMED_IAM
        """
}

def deployNewCode() {
    version = createNewVersion()
    sh """
        aws elasticbeanstalk create-application-version \
        --application-name holiday-calendar-web \
        --version-label ${version} \
        --source-bundle S3Bucket=elasticbeanstalk-holiday-calendar-ap-southeast-1,S3Key=holiday-calendar-web.zip
        """
    sh """
        aws elasticbeanstalk update-environment \
        --environment-name holiday-calendar-web \
        --version-label ${version}
        """
}

def createNewVersion() {
    new Date().format('yyyyMMdd-HHmmss-SSS')
}
