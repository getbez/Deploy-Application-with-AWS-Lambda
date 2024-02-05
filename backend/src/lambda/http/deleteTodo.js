import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE
AWSXRay.captureAWSv3Client(dynamoDBClient);

export async function handler(event) {
  
  const todoId = event.pathParameters.todoId
  console.log("deleting to do with id", todoId)
  const params = {
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: getUserId(event)
    },
  };

  await dynamoDBClient.delete(params)

  console.log(`successfully deleted todo with id: ${todoId}`)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
    },
    body: JSON.stringify({
      todoId: todoId
    })
  }
  
}

