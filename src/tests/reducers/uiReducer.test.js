import { uiCloseModal, uiOpenModal } from '../../actions/ui';
import { uiReducer } from '../../reducers/uiReducer';

const initialState = {
  modalOpen: false
};

describe('Pruebas en uiReducer', () => {

  test('debe de retornar el estado por defecto', () => {
    const state = uiReducer(initialState, {});
    expect(state).toEqual(initialState);
  });

  test('debe de abrir y cerrar el modal', () => {
    const action = uiOpenModal();
    const state = uiReducer(initialState, action);

    expect(state).toEqual({ modalOpen: true });

    const modalClose = uiCloseModal();
    const state2 = uiReducer(state, modalClose);

    expect(state2).toEqual({ modalOpen: false });

  });

});