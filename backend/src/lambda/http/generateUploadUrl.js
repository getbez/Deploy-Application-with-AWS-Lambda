import { PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

const s3Client = new S3Client()
AWSXRay.captureAWSv3Client(s3Client);

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const bucketName = process.env.TODO_IMAGES_BUCKET
  const urlExpiration = 3600 * 24
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}