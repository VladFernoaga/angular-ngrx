import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { UserService } from '../../services/user.service';
import {
  GetUser,
  EUserActions,
  GetUserSuccess,
  GetUsers,
  GetUsersSuccess
} from '../actions/user.actions';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { selectUserList } from '../selectors/user.selectors';
import { of } from 'rxjs';
import { IUserHttp } from '../../model/http-models/user-http.interface';
@Injectable()
export class UserEffects {
  @Effect()
  getUser$ = this._actions$.pipe(
    ofType<GetUser>(EUserActions.GetUser),
    map(action => action.payload),
    withLatestFrom(this._store.pipe(select(selectUserList))),
    switchMap(([id, users]) => {
      const selectedUser = users.filter(user => user.id === +id)[0];
      return of(new GetUserSuccess(selectedUser));
    })
  );

  @Effect()
  getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(EUserActions.GetUsers),
    switchMap(() => this._userService.getUsers()),
    switchMap((userHttp: IUserHttp) => of(new GetUsersSuccess(userHttp.users)))
  );

  constructor(
    private _userService: UserService,
    private _actions$: Actions,
    private _store: Store<IAppState>
  ) {}
}
