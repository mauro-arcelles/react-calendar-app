
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import React from 'react';
import { messages } from '../../../helpers/calendar-messages';
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/events';
import { act } from 'react-dom/test-utils';

Storage.prototype.setItem = jest.fn();

jest.mock('../../../actions/events', () => {
  return {
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn()
  };
});

const middlewars = [thunk];
const mockStore = configureStore(middlewars);

const initialState = {
  calendar: {
    events: [],
  },
  auth: {
    uid: '123',
    name: 'Adrian',
  },
  ui: {
    openModal: false,
  }
};
const store = mockStore(initialState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <CalendarScreen />
  </Provider>
);

describe('Pruebas en <CalendarScreen />', () => {

  test('debe de mostrarse correctamente', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('pruebas con las interacciones del calendario', () => {

    const calendar = wrapper.find('Calendar');
    const calendarMessages = calendar.prop('messages');
    expect(calendarMessages).toEqual(messages);

    calendar.prop('onDoubleClickEvent')();
    expect(store.dispatch).toHaveBeenCalledWith({
      type: types.uiOpenModal
    });

    calendar.prop('onSelectEvent')({ start: 'Hola' });
    expect(eventSetActive).toHaveBeenCalledWith({ start: 'Hola' });

    act(() => {
      calendar.prop('onView')('week');
      expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
    });
  });




});