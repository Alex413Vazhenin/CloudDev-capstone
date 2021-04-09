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
        private readonly todosTable = process.env.MAGAZINES_TABLE,
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
        logger.info('All todos are collected', {
        // Additional info stored in logs
            userId
        })
        return items as MagazineItem[]
    }

    async createTodo(todo: MagazineItem): Promise<MagazineItem> {
        await this.docClient.put({
          TableName: this.magazinesTable,
          Item: todo
        }).promise()
    
        logger.info('Magazine has been succesfully created')
        return todo
    }

    async updateMagazine(update: UpdateMagazineRequest, userId: string, todoId: string ): Promise<String> {
        const { name,dueDate,done } = update
        const params = {
            TableName: this.magazinesTable,
            Key:                  
              {todoId,
              userId},
            UpdateExpression: "set #name=:n, #dueDate=:dD, #done=:d",
            ExpressionAttributeValues: {
              ':n': name,
              ':dD': dueDate,
              ':d': done
            },
            ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
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

    async deleteTodo (todoId: string, userId:string) {
        const params = {
            TableName: this.todosTable,
            Key:                  
            { todoId, userId },
        }

        await this.docClient.delete(params, function(err) {
            if (err) {
              logger.info("Unable to delete item.", { todoId, userId, message: err.message });
            } else {
              logger.info("Item has been sucessfully deleted");
            }
        }).promise();
    }

    generateUploadUrl(todoId: string) {
        const bucketName = process.env.ATTACHMENTS_S3_BUCKET
        const urlExpiration = process.env.urlExpiration
      
        const signedUrl = this.s3.getSignedUrl('putObject', {
          Bucket: bucketName,
          Key: todoId,
          Expires: urlExpiration
        })
        logger.info("Signed URL has been succefully created")
        return signedUrl
      }
    
    async updateTodoUrl(userId: string, todoId: string ): Promise<String> {
      const bucketName = process.env.ATTACHMENTS_S3_BUCKET
      const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
      
      const params = {
        TableName: this.todosTable,
        Key:                  
          {todoId,
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

    logger.info("URL update in progress", {todoId, userId})

    await this.docClient.update(params, function(err) {
      if (err) {
        logger.info("Unable to update an item", {todoId, userId, message: err.message});
      } else {
        logger.info("Item update has been successful",{todoId, userId});
      }
  }).promise();
  
  return 
  }
}



