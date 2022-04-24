import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

jest.mock('../../../actions/events', () => {
  return {
    eventStartDelete: jest.fn(),
  };
})

const middlewars = [thunk];
const mockStore = configureStore(middlewars);

const initialState = {};
const store = mockStore(initialState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <DeleteEventFab />
  </Provider>
);


describe('Pruebas en <DeleteEventFab />', () => {

  test('debe de mostrarse correctamente', () => {

    expect(wrapper).toMatchSnapshot();

  });

  test('debe de llamar el eventStartDelete al hacer click', () => {

    wrapper.find('button').prop('onClick')();

    expect(eventStartDelete).toHaveBeenCalled();


  });

});