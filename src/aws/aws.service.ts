import { Injectable } from '@nestjs/common';
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"

@Injectable()
export class AwsService {
  async imageToText(file: Express.Multer.File) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    console.log('AWS_ACCESS_KEY_ID:', accessKeyId)
    console.log('AWS_SECRET_ACCESS_KEY:', secretAccessKey)
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not set');
    }

    const client = new TextractClient({})
    
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
