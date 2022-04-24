import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';
import Swal from 'sweetalert2';


jest.mock('../../../actions/auth', () => {
  return {
    startLogin: jest.fn(),
    startRegister: jest.fn()
  };
});

jest.mock('sweetalert2', () => {
  return {
    fire: jest.fn(),
  };
});

const middlewars = [thunk];
const mockStore = configureStore(middlewars);

const initialState = {};
const store = mockStore(initialState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <LoginScreen />
  </Provider>
);


describe('Purbeas en <LoginScreen />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe de mostrarse correctamente', () => {

    expect(wrapper).toMatchSnapshot();

  });

  test('debe de llamar el dispatch del login', () => {

    wrapper.find('input[name="lEmail"]').simulate('change', {
      target: {
        name: 'lEmail',
        value: 'juan@gmail.com'
      }
    });

    wrapper.find('input[name="lPassword"]').simulate('change', {
      target: {
        name: 'lPassword',
        value: '123456'
      }
    });

    wrapper.find('form').at(0).prop('onSubmit')({
      preventDefault: () => { }
    });

    expect(startLogin).toHaveBeenCalledWith('juan@gmail.com', '123456');

  });

  test('no hay registro si las contraseñas no coinciden', () => {

    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword1',
        value: '123456'
      }
    });

    wrapper.find('input[name="rPassword2"]').simulate('change', {
      target: {
        name: 'rPassword2',
        value: '1234567'
      }
    });

    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault: () => { }
    });

    expect(startRegister).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Las contraseñas no coinciden', 'error');

  });

  test('Registro con contraseñas iguales', () => {

    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword1',
        value: '123456'
      }
    });

    wrapper.find('input[name="rPassword2"]').simulate('change', {
      target: {
        name: 'rPassword2',
        value: '123456'
      }
    });

    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault: () => { }
    });

    expect(Swal.fire).not.toHaveBeenCalled();
    expect(startRegister).toHaveBeenCalledWith("", "123456", "");

  });

});