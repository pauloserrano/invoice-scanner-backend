import { Injectable } from '@nestjs/common';
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"

@Injectable()
export class AwsService {
  async imageToText(file: Express.Multer.File) {
    const client = new TextractClient({ 
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })
    
    const res = await client.send(new AnalyzeDocumentCommand({ 
      Document: { Bytes: file.buffer },
      FeatureTypes: [ "FORMS", "TABLES" ]
    }))

    return res.Blocks
  }
}
