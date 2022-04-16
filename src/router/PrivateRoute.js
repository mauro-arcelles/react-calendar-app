import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

export const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => {

  return (
    <Route {...rest} component={(props) => (
      (isAuthenticated)
        ? (<Component {...props} />)
        : (<Redirect to='/login' />)
    )}>

    </Route>
  );
};
