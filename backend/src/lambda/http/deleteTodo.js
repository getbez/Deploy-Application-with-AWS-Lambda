import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'


const dynamoDBClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  
  const todoId = event.pathParameters.todoId
  console.log("deleting to do with id", todoId)
  const params = {
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: "testUser" //todo: update to current user
    },
  };

  dynamoDBClient.delete(params, function (error,data) {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not delete todo' });
    }
    res.status(200).json(data);
  });
  
}

