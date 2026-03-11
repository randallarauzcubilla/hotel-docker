import jwt from 'jsonwebtoken'

export function verificarToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return null
  }
}