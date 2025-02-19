// this will add custom properties to Req object since express doesnot have you custom properties in Request object
// types/express.d.ts
namespace Express {
  export interface Request {
    authuser: { id: string; name: string };
  }
}
