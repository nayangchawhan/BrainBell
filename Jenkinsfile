pipeline {
  agent any

  environment {
    IMAGE_NAME = "brainbell-app"
    CONTAINER_NAME = "brainbell-container"
  }

  stages {

    stage('Checkout') {
      steps {
        git url: 'https://github.com/nayangchawhan/BrainBell.git', branch: 'main'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t $IMAGE_NAME ."
        }
      }
    }

    stage('Stop Existing Container (if any)') {
      steps {
        script {
          sh """
            if [ \$(docker ps -a -q -f name=$CONTAINER_NAME) ]; then
              docker stop $CONTAINER_NAME || true
              docker rm $CONTAINER_NAME || true
            fi
          """
        }
      }
    }

    stage('Run Docker Container') {
      steps {
        script {
          sh "docker run -d --name $CONTAINER_NAME -p 3000:3000 $IMAGE_NAME"
        }
      }
    }

  }

  post {
    failure {
      echo '❌ Build failed!'
    }
    success {
      echo '✅ Build and container deployment successful!'
    }
  }
}
