pipeline {
  agent any

  environment {
    IMAGE_NAME = 'brainbell-app'
  }

  stages {
    stage('Clone Repository') {
      steps {
        git 'https://github.com/nayangchawhan/brainbell.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build React App') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${IMAGE_NAME}")
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        script {
          // Stop old container if it exists
          sh 'docker rm -f brainbell-running || true'

          // Run the new one
          docker.image("${IMAGE_NAME}").run("-d --name brainbell-running -p 3000:80")
        }
      }
    }
  }
}
