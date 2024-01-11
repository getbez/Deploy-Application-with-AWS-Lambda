import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {

  const newTodo = event.body
  console.log("event.body: ", newTodo)


  console.log("saving new todo")
  const todoId = uuidv4()
  newTodo.todoId = todoId
  newTodo.userId = "testUser"

  await dynamoDBClient.put({
    TableName: todosTable,
    Item: newTodo
  });
  // console.log("created a new to do", result);
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newTodo: newTodo,
    })
  }

}

