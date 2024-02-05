import Axios from 'axios'
import jsonwebtoken, { decode, verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`

export async function handler(event) {
  try {
    const jwtToken = getToken(event.authorizationToken)
    console.info(`got jwtToken: ${jwtToken}`);
    const jwksResponse = await fetch(jwksUrl)
    const jwks_uri = jwksResponse.json();

    let kid = parseKid(jwtToken);
    console.log(`kid: ${kid}`)

    const [firstKey] = jwks_uri.keys(kid);
    const publicKey = jwktopem(firstKey);
    verify(jwtToken, publicKey)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
