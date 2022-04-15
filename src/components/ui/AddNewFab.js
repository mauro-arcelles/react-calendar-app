import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';

export const AddNewFab = () => {

  const dispatch = useDispatch();
  const { activeEvent } = useSelector(state => state.calendar);

  const handleOpenModal = () => {
    dispatch(uiOpenModal());
  };

  return (
    <button className='btn btn-primary fab' onClick={handleOpenModal}>
      {
        !activeEvent
          ? (<i className='fas fa-plus'></i>)
          : (<i className='fas fa-edit'></i>)
      }
    </button>
  );
};
