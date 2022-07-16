import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager'
import * as AWS from 'aws-sdk'
import { AuthConfig } from './config/auth.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authConfig: AuthConfig,
  ) { }

  private cognitoIsp() {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: this.authConfig.region });

    return cognitoISP
  }

  async registerUser( password: string, email: string): Promise<any> {
    let cognitoISP = this.cognitoIsp()
    return new Promise((resolve, reject) => {
      let params = {
        "ClientId": this.authConfig.clientId,
        "Password": password,
        "UserAttributes": [
          {
            "Name": "email",
            "Value": email
          }
        ],
        "Username": email,
      }
      cognitoISP.signUp(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async validateUser(code: string, email: string):Promise<any> {
    let cognitoISP = this.cognitoIsp()

    return new Promise((resolve, reject) => {
      let params = {
        "ClientId": this.authConfig.clientId,
        "ConfirmationCode": code,
        "Username": email
      }

      cognitoISP.confirmSignUp(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async resendConfirmationCode(email: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()

    return new Promise((resolve, reject) => {
      let params = {
        "ClientId": this.authConfig.clientId,
        "Username": email
      }

      cognitoISP.resendConfirmationCode(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async updateEmail(newEmail: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    const accessToken: string = await this.cacheManager.get('access-token');

    return new Promise((resolve, reject) => {
      let params = {
        "AccessToken": accessToken,
        "UserAttributes": [
          {
            "Name": "email",
            "Value": newEmail
          }
        ]
      }
      cognitoISP.updateUserAttributes(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async validateUpdateEmail(code: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    const accessToken: string = await this.cacheManager.get('access-token');
    const params = {
      "AccessToken": accessToken,
      "AttributeName": "email",
      "Code": code
    }
    return new Promise((resolve, reject)  => {
      cognitoISP.verifyUserAttribute(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async forgotPassword(email: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    this.cacheManager.set('user-email', email, { ttl: 900 })

    return new Promise((resolve, reject) => {
      let params = {
        "ClientId": this.authConfig.clientId,
        "Username": email
      }
      cognitoISP.forgotPassword(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    return new Promise((resolve, reject) => {
      let params = {

        "ClientId": this.authConfig.clientId,
        "ConfirmationCode": code,
        "Password": newPassword,
        "Username": email
      }
      cognitoISP.confirmForgotPassword(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async changePassword(oldPassword: string, newPassword: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    const accessToken: string = await this.cacheManager.get('access-token');
    console.log(accessToken)
    const params = {
      "AccessToken": accessToken,
      "PreviousPassword": oldPassword,
      "ProposedPassword": newPassword
    }
    return new Promise((resolve, reject) => {
      cognitoISP.changePassword(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }


  async deleteuser():Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    const accessToken: string = await this.cacheManager.get('access-token');
    console.log(accessToken)
    const params = {
      "AccessToken": accessToken
    }
    return new Promise((resolve, reject) => {
      cognitoISP.deleteUser(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async authUser(email: string, password: string):Promise<any>  {
    let cognitoISP = this.cognitoIsp()

    const params = {
      "AuthFlow": "USER_PASSWORD_AUTH",
      "AuthParameters": {
        "USERNAME": email,
        "PASSWORD": password
      },
      "ClientId": this.authConfig.clientId,
    }
    return new Promise((resolve, reject) => {
      cognitoISP.initiateAuth(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        const accessToken = data.AuthenticationResult.AccessToken
        this.cacheManager.set('access-token', accessToken, { ttl: 3600 })
        return resolve(data)
      });
    });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto):Promise<any>  {
    let cognitoISP = this.cognitoIsp()
    const { token } = refreshTokenDto

    const params = {
      "AuthFlow": "REFRESH_TOKEN_AUTH",
      "AuthParameters": {
        "REFRESH_TOKEN": token,
      },
      "ClientId": this.authConfig.clientId,
    }
    return new Promise((resolve, reject) => {
      cognitoISP.initiateAuth(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        const accessToken = data.AuthenticationResult.AccessToken
        this.cacheManager.set('access-token', accessToken, { ttl: 3600 })
        return resolve(data)
      });
    });
  }
}

