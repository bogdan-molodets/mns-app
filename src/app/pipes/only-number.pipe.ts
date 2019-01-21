import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'onlyNumber'})
export class OnlyNumberPipe implements PipeTransform{
    transform(array: Array<any>, isNumber: Boolean, isRealNumber: Boolean){
        if(!isNumber){
            return array;
        }else{
            if(isRealNumber){return [1,2,3,4,5,6,7,8,9,0,'.']}else{return [1,2,3,4,5,6,7,8,9,0]}
        }
    }
}