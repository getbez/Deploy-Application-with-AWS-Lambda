import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE
AWSXRay.captureAWSv3Client(dynamoDBClient);

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = event.body
  
  //todo validation
  console.log(`updating todo with id ${todoId} updatedTodo ${event.body}`)

  await dynamoDBClient.update({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: getUserId(event)
    },
    UpdateExpression: "set done = :done, attachmentUrl = :url",
    ExpressionAttributeValues: {
        ":done": updatedTodo.done ? updatedTodo.done : false,
        ":url": updatedTodo.attachmentUrl ? updatedTodo.attachmentUrl : 'N/A'
    }
  });
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
    }
  }
}
