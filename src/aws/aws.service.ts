import { Injectable } from '@nestjs/common';
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"

@Injectable()
export class AwsService {
  async imageToText(file: Express.Multer.File) {
    const credentials = {
      accessKeyId: process.env.AWS_SDK_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SDK_SECRET_ACCESS_KEY,
    };

    const client = new TextractClient({
      region: process.env.AWS_SDK_REGION,
      credentials,
    })
    
    try {
      const res = await client.send(new AnalyzeDocumentCommand({ 
        Document: { Bytes: file.buffer },
        FeatureTypes: [ "FORMS", "TABLES" ]
      }))

      return res.Blocks
      
    } catch (error) {
      console.error("Textract error: " + error)
      throw error
    }
  }
}
