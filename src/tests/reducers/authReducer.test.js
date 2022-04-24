import { authReducer } from '../../reducers/authReducer';
import { types } from '../../types/types';

const initialState = {
  checking: true,
};

describe('Pruebas en authReducer', () => {

  test('debe retornar el estado por defecto', () => {

    const action = {};
    const state = authReducer(initialState, action);

    expect(state).toEqual(initialState);

  });

  test('debe de autenticas al usuario', () => {

    const action = {
      type: types.authLogin,
      payload: {
        uid: '123',
        name: 'Adrian',
      }
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      checking: false,
      uid: action.payload.uid,
      name: action.payload.name,
    });


  });

});