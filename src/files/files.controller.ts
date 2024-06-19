import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(@Res() res: Response, @Param('imageName') imageName: string){

    const path = this.filesService.getStaticProductImage(imageName);
    // const path = this.filesService.getFolderProductImage(imageName);

    res.sendFile(path);

  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, //VALIDACIONES DEL FILE RECIBIDO
    storage: diskStorage({ //MOVER IMAGEN A CARPETA DONDE SE GUARDARA
      destination: './static/products',
      filename: fileNamer
    })
    // FUNCIONA
    // storage: diskStorage({
    //   destination: path.resolve(__dirname, '../../../archivos-teslo-shop/products'),
    //   filename: fileNamer
    //   // destination: (req, file, cb) => {
    //   //   const destinationPath = path.resolve(__dirname, '../../../archivos-teslo-shop/products');
        
    //   //   // // Verificar si el directorio existe, si no, crearlo
    //   //   // if (!existsSync(destinationPath)) {
    //   //   //   mkdirSync(destinationPath, { recursive: true });
    //   //   // }
        
    //   //   cb(null, destinationPath);
    //   // }
    // })
    // limits: {fileSize: 1000}
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File){

    if(!file){
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    }

  }

  // CARGA DE MAS DE 1 ARCHIVO
  // @Post('product')
  // @UseInterceptors(FilesInterceptor('files', 2,{
  //   fileFilter: fileFilter,
  //   // limits: {fileSize: 1000}
  // }))
  // uploadProductImage(@UploadedFiles() files: Express.Multer.File[]){

  //   if(!files){
  //     throw new BadRequestException('Make sure that the file is an image');
  //   }

  //   return files.map(file => ({
  //     fileName: file.originalname
  //   }));

  // }

}
