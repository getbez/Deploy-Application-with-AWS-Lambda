export async function handler(event) {

  console.log("preflight request ok")

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': '*'
    }

  }

}
