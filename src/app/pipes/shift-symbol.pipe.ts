import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shiftSymbol' })
export class ShiftSymbolPipe implements PipeTransform {
    transform(value: String, isShift: Boolean) {
        if (!isShift) {
            return value
        } else {
            switch (value) {
                case '`':
                    return '@';
                case '1':
                    return '!';
                case '2':
                    return '"';
                case '3':
                    return '№';
                case '4':
                    return ';';
                case '5':
                    return ';';
                case '6':
                    return '^';
                case '7':
                    return '?';
                case '8':
                    return '*';
                case '9':
                    return '(';
                case '0':
                    return ')';
                case '-':
                    return '_';
                case '=':
                    return '+';
                case '.':
                    return ',';
                default:
                    return value;
            }
        }
    }
}

