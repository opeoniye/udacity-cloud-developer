import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('NewsS3')

// NEWS: Implement fileStorage logic

export class NewsS3 {

    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly s3bucket = process.env.TRIPLE_LOVE_NEWS_BUCKET,
        //private readonly urlTimeout = process.env.SIGNED_URL_EXPIRATION
        ) {
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

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        logger.info('Getting attachment url')

        const attachmentUrl = `https://${this.s3bucket}.s3.amazonaws.com/${attachmentId}`
        return attachmentUrl

    }

}