import { leadingComment } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { createReducer } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, distinctUntilChanged, map, share, shareReplay } from 'rxjs';
//4. create interface for sate  <generic> => new BehaviorSubject<AppState>
export interface AppState {
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  //3. create state by BehaviorSubject
  private state = new BehaviorSubject<AppState>(
    // 5. define initial state
    {
      limit: 10,
      offset: 0
    })


  // 1 create action
  private increaseLimitAction = new Subject<number>();
  private decreaseLimitAction = new Subject<number>();
  private increaseOffsetAction = new Subject<number>();
  private decreaseOffsetAction = new Subject<number>();

  // 9.create selector
  // ใส่ $ เพื่อให้รับรู้ว่าเป็น observable

  // จาก state ต้องการจะดึงค่า limit ออกจาก state
  limit$ = this.createSelector(state => state.limit)
  offset$ = this.createSelector(state => state.offset)

  constructor() {
    // 7. create reducer
    // เมื่อไรก็ตาม ที่เกิด action increate  limit ให้เพิ่มค่า limit เข้าไปที่ state
    //และทำการ return
    // state ใหม่ ออกไป

    this.createReducer(this.increaseLimitAction, (state, limit) => {
      state.limit += limit;
      return state;
    });

    this.createReducer(this.decreaseLimitAction, (state, limit) => {
      state.limit -= limit;
      return state;
    });

    this.createReducer(this.increaseOffsetAction, (state, offset) => {
      state.offset += offset;
      return state;
    });

    this.createReducer(this.decreaseOffsetAction, (state, offset) => {
      state.offset -= offset;
      return state;
    });
  }

  // 2 Encapsulate  action
  increaseLimit(limit: number) {
    this.increaseLimitAction.next(limit)
  }

  decreaseLimit(limit: number) {
    this.decreaseLimitAction.next(limit)
  }

  increaseOffset(limit: number) {
    this.increaseOffsetAction.next(limit)
  }

  decreaseOffset(limit: number) {
    this.decreaseOffsetAction.next(limit)
  }


  // 8.create method ที่ใช้ ช่วย สร้าง selector return new state
  // การดังค่าจาก state เพื่อไปยัง component ที่ต้องการใช้งาน

  private createSelector<T>(selector: (state: AppState) => T): Observable<T> {
    // return observable อ้างอิงถึง state (Behavior subject)
    return this.state.pipe(
      // มาทำการ map เป็นค่าที่ต้องการ ด้วย func selector
      map(selector),
      distinctUntilChanged(),
      // ถ้า state ไม่เปลี่ยนไม่ต้องทำงานซ้ำ
      shareReplay(1)
      // เพื่อให้ component ไหนที่ทำการ subscribe จะได้ state ล่าสุดออกไป จาก observable
    );
  }

  // 6.create method ที่ใช้ ช่วย สร้าง reducer return new state
  private createReducer<T>(
    action$: Observable<T>,
    accumulator: (state: AppState, action: T) => AppState
  ) {
    // เมื่อไหร่ก็ตามที่ เกิด action ให้มาทำใน  block นี้
    action$.subscribe((action) => {

      const state = { ...this.state.value };
      //get and clone old state
      const newState = accumulator(state, action);
      // return new state
      // send to BehaviorSubject return new state
      this.state.next(newState)
    });
  }
}


