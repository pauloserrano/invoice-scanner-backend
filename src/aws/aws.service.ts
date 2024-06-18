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

  async imageToTextMock(file: Express.Multer.File) {
    console.log({file})
    return [
      'INVOICE NUMBER #982093',
      'INVOICE',
      'COMPANY DESIGNS',
      '850 Sylvan Street',
      'South Angelino, SW',
      'INVOICE',
      'CLIENT',
      '20 AUGUST 2020',
      'NUMBER #982',
      '(04) 298 1092 1092',
      '+76 209 3095 1092',
      'philstanford@email.com',
      'DESCRIPTION',
      'QTY.',
      'PRICE',
      'TOTAL',
      'Web Design',
      '1',
      '$ 200.00',
      '$ 200.00',
      'Branding',
      '1',
      '$ 350.00',
      '$ 350.00',
      'Graphic Design',
      '27',
      '$55.00',
      '$ 1485.00',
      'Web Development',
      '1',
      '$ 450.00',
      '$ 450.00',
      'SUB TOTAL',
      '$2485.00',
      'TAX(15%)',
      '$2112.25',
      'GRAND TOTAL',
      '$ 2112.25',
      'SIGNATURE:',
      'THANK YOU!',
      'PLEASURE DOING BUSINESS WITH YOU!',
      'M',
      'General Manager',
      "Molly's I (04) 092 1092 3095 +76 209 5096 1092 I info@mollys.com",
      'Rodeo Drive, Beverly Hills, California, 4511'
    ].join("\n")
  }
}
