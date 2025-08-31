const { default: axios } = require("axios");
const backendURL = 'http://localhost:3000'



describe('Authentication',()=>{
  const username = "n3rddev" + Math.random();
  const password = '12345';
  
  test('user is able to signup',async ()=>{
    const response = await axios.post(`${backendURL}/api/v1/signup`, {
      username,
      password,
      type:'admin'
    })
    expect(response.statusCode).toBe(200);

    const responseUpdated = await axios.post(`${backendURL}/api/v1/signup`, {
      username,
      password,
      type:'admin'
    })
    expect(responseUpdated.statusCode).tobe(400);
  })

  test('signup fails if the username is empty', async()=>{
    const username = 'saket'+Math.random();
    const password = "12345";

    const response = axios.post(`${backendURL}/api/v1/signup`,{
      password,
      type: 'admin'
    })
    expect(response.statusCode).toBe(400)
  })

  test('signin succeds if correct username & password are correct', async()=>{
    const username = 'saket'+"LLLL"+Math.random();
    const password = '12345';

    await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password
    })

    const response = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    })

    expect(response.statusCode).toBe(200);  
    expect(response.token).toBeDefined();
  })

    test('signin fails if correct username & password are incorrect', async()=>{
    const username = 'saket'+"LLLL"+Math.random();
    const password = '12345';

    await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password
    })

    const response = await axios.post(`${backendURL}/api/v1/signin`,{
      username:"wrong-username",
      password
    })

    expect(response.statusCode).toBe(403);  
    expect(response.token).toBeUndefined();
  })

})


describe('User-avatar',()=>{
  let token = '';
  let avatarId = '';


  beforeAll(async()=>{
    const username = 'dhruv'+Math.random();
    const password = 'harDick';

    await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password 
    });

    const reponse = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    });

    token = reponse.data.roken;

    const avatarResponse = await axios.post(`${backendURL}/api/v1/avatar`,{
      imageUrl: "xyz.com",
      name:"trikky"
    })

    avatarId = avatarResponse.data.avatarId;
  })

  test('user cant update their avatar with a wrong avatarID', async()=>{
    const avatarId = 'wrongAvatarID'
    const response = await axios.post(`${backendURL}/api/v1/metadata`,{
      avatarId
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(400)
  })

  test('user can update their avatar with the right avatar id', async()=>{
    const response = await axios.post(`${backendURL}/api/v1/metadata`,{
      avatarId
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(200)
  })

  test('user does not send authorization header', async()=>{
    const response = axios.post(`${backendURL}/api/vi/metadata`,{
      avatarId
    })
    expect(response.statusCode).toBe(403);
  })
})

describe('user-metadata',()=>{
  const userId ='';
  const token = '';

  beforeAll(async()=>{
    const username = "bigdihh"+Math.random();
  })
  test()
})
//describe blocks
