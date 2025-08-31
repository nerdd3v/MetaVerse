const { default: axios } = require("axios");
const backendURL = 'http://localhost:3000'


describe('Authentication',()=>{
  test('user signup with correct username, password and role', async()=>{
    const username = 'saket'+Math.random();
    const password = '12345';
    const role = 'admin';

    const response = await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role 
    })

    expect(response.statusCode).toBe(200);
    expect(response.data.userId).toBeDefined();
  })

  test('signin fails if username is not provided',async()=>{
    const username = 'saket'+Math.random();
    const password = '12345';
    const role = 'admin';
    const response = await axios.post(`${backendURL}/api/v1/signin`,{
      password,
      role 
    })
    expect(response.statusCode).toBe(400);
  })
})