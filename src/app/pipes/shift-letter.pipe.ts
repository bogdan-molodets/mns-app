import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'shiftLetter'})
export class ShiftLetterPipe implements PipeTransform{
    transform(value: String, isShift: Boolean){
        if(!isShift){
            return value;
        }else{
            return value.toUpperCase();
        }
    }
}