import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';


jest.mock('sweetalert2', () => {
  return {
    fire: jest.fn(),
  };
});

const middlewars = [thunk];
const mockStore = configureStore(middlewars);

const initialState = {};
let store = mockStore(initialState);

Storage.prototype.setItem = jest.fn();

let token = '';

describe('Pruebas en las acciones Auth', () => {

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  test('startLogin correcto', async () => {

    await store.dispatch(startLogin('adrian@gmail.com', '123456'));

    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: expect.any(String),
        name: expect.any(String),
      }
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
    expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

    token = localStorage.setItem.mock.calls[0][1];

  });

  test('startLogin incorrecto', async () => {
    await store.dispatch(startLogin('adrian@gmail.com', '123456789'));
    let actions = store.getActions();

    expect(actions).toEqual([]);
    expect(Swal.fire).toHaveBeenCalled();

  });

  test('startRegister correcto', async () => {

    fetchModule.fetchSinToken = jest.fn(() => {
      return {
        json: () => {
          return {
            ok: true,
            uid: '123',
            name: 'Adrian',
            token: '123456789',
          };
        }
      };
    });


    await store.dispatch(startRegister('test@test.com', '123456', 'test'));

    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: '123',
        name: 'Adrian',
      }
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', '123456789');
    expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

  });

  test('startChecking correcto', async () => {

    fetchModule.fetchConToken = jest.fn(() => {
      return {
        json: () => {
          return {
            ok: true,
            uid: '123',
            name: 'Adrian',
            token: '123456789',
          };
        }
      };
    });

    await store.dispatch(startChecking());

    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: '123',
        name: 'Adrian',
      }
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', '123456789');

  });

});