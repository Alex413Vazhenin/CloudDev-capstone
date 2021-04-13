import * as AWS  from 'aws-sdk'
process.env._X_AMZN_TRACE_ID = '_X_AMZN_TRACE_ID'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateMagazineRequest } from '../requests/UpdateMagazineRequest'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'
const logger = createLogger('dataLayer')

import { MagazineItem } from '../models/MagazineItem'
import { S3 } from 'aws-sdk'

export class MagazinesAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly magazinesTable = process.env.MAGAZINES_TABLE,
        private readonly indexName = process.env.INDEX_NAME,
        private readonly s3: S3 =  new XAWS.S3({
          signatureVersion: 'v4'
        })) {
      }

    async getAllMagazines(userId): Promise<MagazineItem[]> {
        logger.info('Getting all Magazines')

    const result = await this.docClient.query({
        TableName: this.magazinesTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
        }).promise();

    const items = result.Items
        logger.info('All magazines are collected', {
        // Additional info stored in logs
            userId
        })
        return items as MagazineItem[]
    }

    async createMagazine(magazine: MagazineItem): Promise<MagazineItem> {
        await this.docClient.put({
          TableName: this.magazinesTable,
          Item: magazine
        }).promise()
    
        logger.info('Magazine has been succesfully created')
        return magazine
    }

    async updateMagazine(update: UpdateMagazineRequest, userId: string, magazineId: string ): Promise<String> {
        const { title, topic } = update
        const params = {
            TableName: this.magazinesTable,
            Key:                  
              {magazineId,
              userId},
            UpdateExpression: "set #title=:ti, #topic=:to",
            ExpressionAttributeValues: {
              ':ti': title,
              ':to': topic
            },
            ExpressionAttributeNames: {
              '#title': 'title',
              '#topic': 'topic'
            },
            ReturnValues:"UPDATED_NEW"       
        };

        logger.info('Item update in progress ...', {
            // Additional info added in logs
            userId
        })

        await this.docClient.update(params, function(err) {
            if (err) {
              logger.info("Item update failed.", { message: err.message });
            } else {
              logger.info("Item has been sucessfully updated.");
            }
        }).promise();

    return 
    }

    async deleteMagazine (magazineId: string, userId:string) {
        const params = {
            TableName: this.magazinesTable,
            Key:                  
            { magazineId, userId },
        }

        await this.docClient.delete(params, function(err) {
            if (err) {
              logger.info("Unable to delete item.", { magazineId, userId, message: err.message });
            } else {
              logger.info("Item has been sucessfully deleted");
            }
        }).promise();
    }

    generateUploadUrl(magazineId: string) {
        const bucketName = process.env.ATTACHMENTS_S3_BUCKET
        const urlExpiration = process.env.urlExpiration
      
        const signedUrl = this.s3.getSignedUrl('putObject', {
          Bucket: bucketName,
          Key: magazineId,
          Expires: urlExpiration
        })
        logger.info("Signed URL has been succefully created")
        return signedUrl
      }
    
    async updateMagazineUrl(userId: string, magazineId: string ): Promise<String> {
      const bucketName = process.env.ATTACHMENTS_S3_BUCKET
      const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${magazineId}`
      
      const params = {
        TableName: this.magazinesTable,
        Key:                  
          {magazineId,
          userId},

        UpdateExpression: "set #attachmentUrl = :a",
        ExpressionAttributeValues : {
          ':a': attachmentUrl
        },
        ExpressionAttributeNames:{
          '#attachmentUrl': 'attachmentUrl'
        },
        ReturnValues:"UPDATED_NEW"
    };

    logger.info("URL update in progress", {magazineId, userId})

    await this.docClient.update(params, function(err) {
      if (err) {
        logger.info("Unable to update an item", {magazineId, userId, message: err.message});
      } else {
        logger.info("Item update has been successful",{magazineId, userId});
      }
  }).promise();
  
  return 
  }
}



