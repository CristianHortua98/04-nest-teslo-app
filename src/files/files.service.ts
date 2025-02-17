import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import * as path from 'path';

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string){

        const path = join(__dirname, '../../static/products', imageName);

        if(!existsSync(path)){
            throw new BadRequestException(`No product found with image ${imageName}`);
        }

        return path;

    }

    getFolderProductImage(imageName: string){

        const path = join(__dirname, '../../../archivos-teslo-shop/products', imageName);

        if(!existsSync(path)){
            throw new BadRequestException(`No product found with image ${imageName}`);
        }

        return path;

    }

}
