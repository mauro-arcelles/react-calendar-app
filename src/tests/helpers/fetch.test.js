import { fetchConToken, fetchSinToken } from '../../helpers/fetch';

describe('Pruebas el helper fetch', () => {

  let token = '';

  test('fetchSinToken debe de funcionar', async () => {
    const resp = await fetchSinToken('auth', { email: 'adrian@gmail.com', password: '123456' }, 'POST');

    expect(resp instanceof Response).toBe(true);

    const body = await resp.json();
    expect(body.ok).toBe(true);

    token = body.token;
  });


  test('fetchConToken debe de funcionar', async () => {
    localStorage.setItem('token', token);

    const resp = await fetchConToken('events/625b1601f27bf5a1d8ad6adf', {}, 'DELETE');
    const body = await resp.json();

    expect(body.msg).toBe('No existe el evento');
  });


});