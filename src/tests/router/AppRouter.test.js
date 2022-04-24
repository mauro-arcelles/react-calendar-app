import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { AppRouter } from '../../router/AppRouter';


const middlewars = [thunk];
const mockStore = configureStore(middlewars);


// store.dispatch = jest.fn();


describe('Pruebas en <AppRouter />', () => {

  test('debe de mostrar el espere...', () => {
    const initialState = {
      auth: {
        checking: true,
      }
    };
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    // expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h1').exists()).toBe(true);
  });


  test('debe de mostrar la ruta publica', () => {

    const initialState = {
      auth: {
        checking: false,
        uid: null
      }
    };
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.login-container').exists()).toBe(true);
  });

  test('debe de mostrar la ruta privada', () => {

    const initialState = {
      auth: {
        checking: false,
        uid: '123',
        name: 'Adrian'
      },
      calendar: {
        events: [],
      },
      ui: {
        modalOpen: false
      }
    };
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.calendar-screen').exists()).toBe(true);
  });

});
