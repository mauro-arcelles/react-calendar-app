
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import moment from 'moment';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartUpdate, startStartAddNew } from '../../../actions/events';
import { act } from 'react-dom/test-utils';
import Swal from 'sweetalert2';




jest.mock('../../../actions/events', () => {
  return {
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    startStartAddNew: jest.fn()
  };
});
jest.mock('sweetalert2', () => {
  return {
    fire: jest.fn(),
  };
});

const middlewars = [thunk];
const mockStore = configureStore(middlewars);

const now = moment().minutes(0).seconds(0).add(1, 'hour');
const nowPlus1 = now.clone().add(1, 'hour');

const initialState = {
  calendar: {
    events: [],
    activeEvent: {
      title: 'Hola mundo',
      notes: 'Algunas notas',
      start: now.toDate(),
      end: nowPlus1.toDate(),
    },
  },
  auth: {
    uid: '123',
    name: 'Adrian',
  },
  ui: {
    modalOpen: true,
  }
};
const store = mockStore(initialState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <CalendarModal />
  </Provider>
);



describe('Pruebas en <CalendarModal />', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe de mostrar el modal', () => {
    expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
  });

  test('debe de llamar la accion de actualizar y cerrar modal', () => {
    wrapper.find('form').simulate('submit', {
      preventDefault() { }
    });

    expect(eventStartUpdate).toHaveBeenCalledWith(initialState.calendar.activeEvent);
    expect(eventClearActiveEvent).toHaveBeenCalled();
  });

  test('debe de mostrar error si falta el titulo', () => {

    wrapper.find('form').simulate('submit', {
      preventDefault() { }
    });

    expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);

  });

  test('debe de crear un nuevo evento', () => {

    const initialState = {
      calendar: {
        events: [],
        activeEvent: null,
      },
      auth: {
        uid: '123',
        name: 'Adrian',
      },
      ui: {
        modalOpen: true,
      }
    };
    const store = mockStore(initialState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <CalendarModal />
      </Provider>
    );

    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Hola pruebas'
      }
    });

    wrapper.find('form').simulate('submit', {
      preventDefault() { }
    });

    expect(startStartAddNew).toHaveBeenCalledWith({
      end: expect.anything(),
      start: expect.anything(),
      title: 'Hola pruebas',
      notes: ''
    });

    expect(eventClearActiveEvent).toHaveBeenCalled();

  });


  test('debe de validar las fechas', () => {

    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Hola pruebas'
      }
    });

    const hoy = new Date();

    act(() => {
      wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy);

    });

    wrapper.find('form').simulate('submit', {
      preventDefault() { }
    });

    expect(Swal.fire).toHaveBeenCalledWith("Error", "La fecha fin debe ser mayor a la fecha inicio", "error")

  });

});