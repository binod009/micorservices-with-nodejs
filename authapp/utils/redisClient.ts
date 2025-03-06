import { createClient, RedisClientType } from "redis";
import  Jwt, { JsonWebTokenError, JwtPayload }  from "jsonwebtoken";
import ApiError from "./ApiError";
require("dotenv").config();
interface CustomJwtPayload extends JwtPayload {
    // Add any custom properties that your token contains
    id: string;
    username: string;
  }
class ConnectRedis {
    public client: RedisClientType;
    private static instance: ConnectRedis;
    private constructor() {
        this.client = createClient();
        this.client.on('error', (err: Error) => console.error('Redis client error', err))
    }

    public static getInstance(): ConnectRedis {
        if (!ConnectRedis.instance) {
            ConnectRedis.instance = new ConnectRedis(); // Create a new instance if it doesn't exist
        }
        return ConnectRedis.instance; // Return the existing instance
    }


    connectRedis() {
        this.client.connect().then(() => {
            console.log('Redis connected')
        }).catch(err => console.error(err))
    }

    StoreToken(token: string, timer: number) {
        this.client.set("activationToken", token, { EX: timer });
        return true;
    }
    async checkStore() {
        const value = await this.client.get("activationToken");
        console.log("value from redis check",value);
    }


    verifyUserToken(token: string) {
        try {
            const decode = Jwt.verify(token, process.env.EMAIL_VERIFICATION_KEY!) as CustomJwtPayload;
            return decode;
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.error("error from verifyUserToken,FN",err);
            }
        }
    }

   async verifyRedisToken() {
            const redisToken = await this.client.get("activationToken");
            if (!redisToken) {
                throw new ApiError("token expired", 404);
            }
            else {
                const decodeRedisToken = Jwt.verify(redisToken, process.env.EMAIL_VERIFICATION_KEY!) as CustomJwtPayload;
                return decodeRedisToken;
            }
        } 
    

    async verifyCurrentUser(token: string) {
        try {
            const userpayload = this.verifyUserToken(token);
            const redispayload = await this.verifyRedisToken();
            if (userpayload && redispayload && userpayload.id === redispayload.id) {
                return redispayload as CustomJwtPayload;
            }
            else if (userpayload && redispayload && userpayload.id !== redispayload.id) {
                throw new ApiError("user did not matched", 404);
            }
        }
        catch (err) {
            throw err;
        }
    }
}


export default ConnectRedis;


