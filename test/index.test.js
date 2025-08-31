const { default: axios } = require("axios");


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

  test('signup fails if username is not provided',async()=>{
    const password = '12345';
    const role = 'admin';
    const response = await axios.post(`${backendURL}/api/v1/signin`,{
      password,
      role 
    })
    expect(response.statusCode).toBe(400);
  })

  test('signup fails if credentails are sent twice', async()=>{
    const username = 'saket'+Math.random();
    const password = '12345';
    const role = 'admin';

    const response = await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role 
    })

    const updatedResponse = await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role 
    })
    expect(updatedResponse.statusCode).toBe(400)
  })

  test('signin succeds if the username and passwords are correct', async()=>{
    const username = 'saket'+Math.random();
    const password = '12345';
    const role = 'admin';
    
    await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role 
    })

    const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    })

    expect(signinResponse.statusCode).toBe(200);
  })
  test('signin fails if the username is incorrect', async()=>{
    const username = 'saket'+Math.random();
    const password = '12345';
    const role = 'admin';
    
    await axios.post(`${backendURL}/api/v1/signup`,{
      username: "wrong username",
      password,
      role 
    })

    const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    })

    expect(signinResponse.statusCode).toBe(400);
  })

})

describe('user avatar',()=>{
  let token = '';
  let avatarId = '';

  beforeAll(async()=>{
    const username = 'harDick'+Math.random();
    const password = '12345';

    await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role:'admin'
    })

    const response = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    })

    token = response.data.token;

    const avatarResponse = await axios.post(`${backendURL}/api/v1/admin/avatar`,{
      imageUrl :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
      avatarName: 'tricky'
    })

    avatarId = avatarResponse.data.avatarId;

  })

  test('user cant update their metadata with wrong avatar id', async()=>{
    const response = await axios.post(`${backendURL}/api/v1/user/metadata`,{
      avatarId: 'wrongAvatarId'
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(400)
  })

  test('user can update their avatar with correct avatar id', async()=>{
    const response = await axios.post(`${backendURL}/api/v1/user/metadata`,{
      avatarId
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(200)
  })


  test('user does not send authorisation header', async()=>{
    const response = await axios.post(`${backendURL}/api/v1/user/metadata`,{
      avatarId: 'wrongAvatarId'
    })
    expect(response.statusCode).toBe(400)
  })

})

describe('user metadata',()=>{
  let token = '';
  let avatarId = '';
  let userId = '';

  beforeAll(async()=>{
    const username = 'bigDihh'+Math.random()*6;
    const password = '12345';

    const response = await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role: 'admin'
    })

    userId = response.data.userId;

    const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    })

    token = signinResponse.data.token;
    
    const avatarResponse = await axios.post(`${backendURL}/api/v1/admin/avatar`, {
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name : 'tricky'
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    avatarId = avatarResponse.data.avatarId
  })

  test('Get back avatar information for a user', async()=>{
    const response = await axios.get(`${backendURL}/api/v1/user/metadata/bulk?ids=${userId}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    expect(response.data.avatars.length).not.toBe(0) 
    /*
    here avatar means the avatars object {
      "avatars": [{
        "userId": 1,
        "imageUrl": "https://image.com/cat.png"
      }, {
        "userId": 3,
        "imageUrl": "https://image.com/cat2.png"
      }, {
        "userId": 55,
        "imageUrl": "https://image.com/cat3.png"
      }]
    }
  */
 expect(response.data.avatars[0].userId).toBe(userId);

  })

  test('available avatars lists the recently created avatar', async()=>{
    const response = await axios.get(`${backendURL}/api/v1/avatars`)
    expect(response.data.avatars.length).not.toBe(0)

    const currentAvatar = response.data.avatars.find(a => a.id = avatarId)
    expect(currentAvatar).toBeDefined()
  })
})

describe('Space block',()=>{
  
  let mapId;
  let element1Id;
  let element2id;
  let token;
  let userId;

  beforeAll(async()=>{
    const username = 'bigDihh'+Math.random()*6;
    const password = '12345';

    const response = await axios.post(`${backendURL}/api/v1/signup`,{
      username,
      password,
      role: 'admin'
    })

    userId = response.data.userId;

    const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
      username,
      password
    })

    token = signinResponse.data.token;

    const element1 = await axios.post(`${backendURL}/api/v1/admin/element`,{
      imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      width: 1,
      height: 1,
      static: true
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    
    element1Id = element1.data.id;

    const element2 = await axios.post(`${backendURL}/api/v1/admin/element`,{
      imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      width: 1,
      height: 1,
      static: true
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    element2id = element2.data.id

  })
})

