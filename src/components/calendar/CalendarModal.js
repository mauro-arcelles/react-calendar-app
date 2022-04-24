import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartUpdate, startStartAddNew } from '../../actions/events';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hour');
const nowPlus1 = now.clone().add(1, 'hour');

const initEvent = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: nowPlus1.toDate(),
};

export const CalendarModal = () => {

  const { modalOpen: isOpen } = useSelector(state => state.ui);
  const { activeEvent } = useSelector(state => state.calendar);
  const dispatch = useDispatch();

  const [dateStart, setDateStart] = useState(now.toDate());
  const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
  const [titleValid, setTitleValid] = useState(true);

  const [formValues, setFormValues] = useState(initEvent);

  const { title, notes, start, end } = formValues;

  useEffect(() => {
    if (activeEvent) {
      setFormValues(activeEvent);
    } else {
      setFormValues(initEvent);
    }

  }, [activeEvent]);


  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const closeModal = () => {
    dispatch(uiCloseModal());
    dispatch(eventClearActiveEvent());
    setFormValues(initEvent);
  };

  const handleStartDateChange = (e) => {
    setDateStart(e);
    setFormValues({
      ...formValues,
      start: e,
    });
  };

  const handleEndDateChange = (e) => {
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e,
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const momentStart = moment(start);
    const momentEnd = moment(end);

    if (momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire('Error', 'La fecha fin debe ser mayor a la fecha inicio', 'error');
    }

    if (title.trim().length < 2) {
      return setTitleValid(false);
    }

    if (activeEvent) {
      dispatch(eventStartUpdate(formValues));

    } else {
      dispatch(startStartAddNew(formValues));

    }

    setTitleValid(true);
    closeModal();

  };

  return (
    <Modal
      isOpen={isOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={100}
      className='modal'
      overlayClassName='modal-fondo'
      ariaHideApp={ !process.env.NODE_ENV === 'test' }
    >
      <h1> {activeEvent ? 'Editar evento' : 'Nuevo evento'} </h1>
      <hr />
      <form
        className="container"
        onSubmit={handleSubmitForm}
      >

        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={(activeEvent) ? activeEvent.start : dateStart}
            className='form-control'
            format="y-MM-dd h:mm:ss a"
            amPmAriaLabel="Select AM/PM"
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndDateChange}
            value={(activeEvent) ? activeEvent.end : dateEnd}
            minDate={dateStart}
            className='form-control'
            format="y-MM-dd h:mm:ss a"
            amPmAriaLabel="Select AM/PM"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid'}`}
            placeholder="Título del evento"
            name="title"
            value={title}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>

      </form>
    </Modal>
  );
};
