import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE
const UserIdIndex = process.env.TODOS_USER_ID_INDEX
AWSXRay.captureAWSv3Client(dynamoDBClient);

export async function handler(event) {
  const scanCommand = {
    TableName: todosTable
  }
  const result = await dynamoDBClient.query({
    TableName: todosTable,
    IndexName: UserIdIndex,
    KeyConditionExpression: 'userId = :currentUserId',
    ExpressionAttributeValues: {
      ':currentUserId': getUserId(event)
    },
    ScanIndexForward: false
  })
  const items = result.Items

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
    },
    body: JSON.stringify({
      items
    })
  }

}
