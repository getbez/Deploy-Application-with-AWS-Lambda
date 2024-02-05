import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE
AWSXRay.captureAWSv3Client(dynamoDBClient);

export async function handler(event) {

  const newTodoDetails = JSON.parse(event.body)
  console.log("newTodoDetails ", newTodoDetails)

  if(! newTodoDetails.name){
    await cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: 'FailedRequestsCount',
          Unit: 'Count',
          Value: 1
        }
      ],
      Namespace: 'Udagram/Serveless'
    })
    
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
      },
      body: JSON.stringify({
        message: "name can not be empty",
      })
    }
  }

  const newTodo = {
    todoId: uuidv4(),
    userId: getUserId(event),
    done: false,
    attachmentUrl: 'N/A',
    ...newTodoDetails
  }

  await dynamoDBClient.put({
    TableName: todosTable,
    Item: newTodo
  });

  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
    },
    body: JSON.stringify({
      newTodo: newTodo,
    })
  }

}

