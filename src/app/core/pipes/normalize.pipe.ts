import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalize',
})
export class NormalizePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    let normalizedString: string =
      value.toLowerCase(); /* .replace(/(\s)/g, '') */

    let a = 'á'.charCodeAt(0);
    let e = 'é'.charCodeAt(0);
    let o = 'ó'.charCodeAt(0);
    let i = 'í'.charCodeAt(0);
    let u = 'ú'.charCodeAt(0);

    let dict = {
      a: 'a',
      e: 'e',
      o: 'o',
      i: 'i',
      u: 'u',
    };

    return normalizedString
      .split('')
      .map((c: string) => {
        let ascii = c.charCodeAt(0);

        if (ascii === a) {
          return 'a';
        } else if (ascii === e) {
          return 'e';
        } else if (ascii === o) {
          return 'o';
        } else if (ascii === i) {
          return 'i';
        } else if (ascii === u) {
          return 'u';
        } else {
          return c;
        }
      })
      .join('')
      .toUpperCase();
  }
}
