import { Injectable } from '@nestjs/common';
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"

@Injectable()
export class AwsService {
  async imageToText(file: Express.Multer.File) {
    const client = new TextractClient({})
    
    try {
      const res = await client.send(new AnalyzeDocumentCommand({ 
        Document: { Bytes: file.buffer },
        FeatureTypes: [ "FORMS", "TABLES" ]
      }))

      return res.Blocks
      
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
