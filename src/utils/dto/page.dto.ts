import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';


export class PageRequestDto {
    // Properti 'page'
    //   * Diharuskan bertipe integer (bilangan bulat)
    //   * Nilai default adalah 1
    @IsInt() // Pastikan nilai adalah integer
    @Type(() => Number) // Konversi nilai menjadi tipe Number
    page = 1;


    @IsInt() // Pastikan nilai adalah integer
    @Type(() => Number) // Konversi nilai menjadi tipe Number
    pageSize = 10;

    
    // @IsInt() // Pastikan nilai adalah integer
    // @Type(() => Number) // Konversi nilai menjadi tipe Number
    // Limit : number;
    }