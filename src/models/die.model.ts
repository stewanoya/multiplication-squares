import { Subject, firstValueFrom, flatMap, last, map, mergeMap, switchMap, take, tap, timer } from "rxjs";

export class DieModel {
  value = new Subject<number>();
  maxValue: number;
  minValue = 1;
  values: number[] = [];
  start$ = new Subject();

  constructor(maxValue: number) {
    this.maxValue = maxValue;
    this.values = Array.from({length: maxValue}, (_, i) => i + 1)
  };

  rolling$ = this.start$
    .pipe(
      mergeMap(max => {
        return timer(0, 50)
          .pipe(
            take(10),
            map(_ => this.values[Math.floor(Math.random() * this.values.length)]),
            tap(val => {
              this.value.next(val);
            })
          )
      }),
    )


  // () {
  //   let rolling = true;

  //   const startTime = Date.now();

  //   for (let i = 0; i < Array.from(Array(10000).keys()).length; i++) {
  //     this.value = this.values[Math.floor(Math.random() * this.values.length)];
  //   }
  //     // console.log("value", this.value);
  //     // if (Date.now() - startTime < 1000) {
  //     //   rolling = false;
  //     // }
  // }
}
