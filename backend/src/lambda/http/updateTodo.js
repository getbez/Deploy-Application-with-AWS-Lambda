import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = event.body
  
  //todo validation
  console.log("updating todo with id", todoId)

  await dynamoDBClient.update({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: "testUser" //todo: update to current user
    },
    Item: updatedTodo
  });
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedTodo: updatedTodo,
    })
  }
}
