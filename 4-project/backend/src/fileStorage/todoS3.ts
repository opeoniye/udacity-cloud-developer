import 'source-map-support/register'
import * as AWS from 'aws-sdk'
//import { XavcSlowPal } from 'aws-sdk/clients/mediaconvert'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('todoS3')

// TODO: Implement the fileStogare logic

export class TodoS3 {

    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly s3bucket = process.env.ATTACHMENT_S3_BUCKET,
        //private readonly urlTimeout = process.env.SIGNED_URL_EXPIRATION
        ) {
    }

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        logger.info('Getting attachment url')

        const attachmentUrl = `https://${this.s3bucket}.s3.amazonaws.com/${attachmentId}`
        return attachmentUrl

    }

    async getUploadUrl(attachmentId: string, urlTimeout: number): Promise<string> {
        logger.info('Getting upload url')

        const uploadurl = this.s3.getSignedUrl('putObject', {
            Bucket: this.s3bucket,
            Key: attachmentId,
            Expires: urlTimeout
        })

        return uploadurl
    }






}