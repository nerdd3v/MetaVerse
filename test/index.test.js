const axios2 = require("axios");
const backendURL = 'http://localhost:3000'

const axios = {
  post: async(...args)=>{
    try{
      const res = await axios2.post(...args)
      return res;
    }
    catch(e){
      return e.response
    }
  },

  get : async(...args)=>{
    try {
      const res = axios2.get(...args)
      return res;
    } catch (error) {
      return error.response
    }
  },

  delete : async(...args)=>{
    try {
      const res = axios2.delete(...args)
    } catch (error) {
      return error.response
    }
  },

  get : async(...args)=>{
    try {
      const res = axios2.get(...args)
    } catch (error) {
      return error.response
    }
  }
}

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

    expect(response.status).toBe(200);
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
    expect(updatedResponse.status).toBe(400)
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

    expect(signinResponse.status).toBe(200);
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

    expect(signinResponse.status).toBe(400);
  })

})

// describe('user avatar',()=>{
//   let token = '';
//   let avatarId = '';

//   beforeAll(async()=>{
//     const username = 'harDick'+Math.random();
//     const password = '12345';

//     await axios.post(`${backendURL}/api/v1/signup`,{
//       username,
//       password,
//       role:'admin'
//     })

//     const response = await axios.post(`${backendURL}/api/v1/signin`,{
//       username,
//       password
//     })

//     token = response.data.token;

//     const avatarResponse = await axios.post(`${backendURL}/api/v1/admin/avatar`,{
//       imageUrl :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
//       avatarName: 'tricky'
//     })

//     avatarId = avatarResponse.data.avatarId;

//   })

//   test('user cant update their metadata with wrong avatar id', async()=>{
//     const response = await axios.post(`${backendURL}/api/v1/user/metadata`,{
//       avatarId: 'wrongAvatarId'
//     },{
//       headers:{
//         Authorization: `Bearer ${token}`
//       }
//     })
//     expect(response.statusCode).toBe(400)
//   })

//   test('user can update their avatar with correct avatar id', async()=>{
//     const response = await axios.post(`${backendURL}/api/v1/user/metadata`,{
//       avatarId
//     },{
//       headers:{
//         Authorization: `Bearer ${token}`
//       }
//     })
//     expect(response.statusCode).toBe(200)
//   })


//   test('user does not send authorisation header', async()=>{
//     const response = await axios.post(`${backendURL}/api/v1/user/metadata`,{
//       avatarId: 'wrongAvatarId'
//     })
//     expect(response.statusCode).toBe(400)
//   })

// })

// describe('user metadata',()=>{
//   let token = '';
//   let avatarId = '';
//   let userId = '';

//   beforeAll(async()=>{
//     const username = 'bigDihh'+Math.random()*6;
//     const password = '12345';

//     const response = await axios.post(`${backendURL}/api/v1/signup`,{
//       username,
//       password,
//       role: 'admin'
//     })

//     userId = response.data.userId;

//     const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
//       username,
//       password
//     })

//     token = signinResponse.data.token;
    
//     const avatarResponse = await axios.post(`${backendURL}/api/v1/admin/avatar`, {
//       imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//       name : 'tricky'
//     },{
//       headers:{
//         Authorization: `Bearer ${token}`
//       }
//     })

//     avatarId = avatarResponse.data.avatarId
//   })

//   test('Get back avatar information for a user', async()=>{
//     const response = await axios.get(`${backendURL}/api/v1/user/metadata/bulk?ids=${userId}`,{
//       headers:{
//         Authorization: `Bearer ${token}`
//       }
//     })

//     expect(response.data.avatars.length).not.toBe(0) 
//     /*
//     here avatar means the avatars object {
//       "avatars": [{
//         "userId": 1,
//         "imageUrl": "https://image.com/cat.png"
//       }, {
//         "userId": 3,
//         "imageUrl": "https://image.com/cat2.png"
//       }, {
//         "userId": 55,
//         "imageUrl": "https://image.com/cat3.png"
//       }]
//     }
//   */
//  expect(response.data.avatars[0].userId).toBe(userId);

//   })

//   test('available avatars lists the recently created avatar', async()=>{
//     const response = await axios.get(`${backendURL}/api/v1/avatars`)
//     expect(response.data.avatars.length).not.toBe(0)

//     const currentAvatar = response.data.avatars.find(a => a.id = avatarId)
//     expect(currentAvatar).toBeDefined()
//   })
// })

// describe('Space block',()=>{
  
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let userToken;
//   let userId;

//   let adminId;
//   let adminToken;

//   beforeAll(async()=>{
//     const username = 'bigDihh'+Math.random()*6;
//     const password = '12345';

//     const response = await axios.post(`${backendURL}/api/v1/signup`,{
//       username,
//       password,
//       role: 'admin'
//     })

//     adminId = response.data.userId;

//     const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
//       username,
//       password
//     })

//     adminToken = signinResponse.data.token;


//     const userResponse = await axios.post(`${backendURL}/api/v1/signup`,{
//       username: username + "-user",
//       password,
//       role: 'user'
//     })

//     userId = userResponse.data.userId;

//     const userSigninResponse = await axios.post(`${backendURL}/api/v1/signin`,{
//       username: username + "-user",
//       password
//     })

//     userToken = userSigninResponse.data.token;

//     const element1 = await axios.post(`${backendURL}/api/v1/admin/element`,{
//       imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       width: 1,
//       height: 1,
//       static: true
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
    
//     element1Id = element1.data.id;

//     const element2 = await axios.post(`${backendURL}/api/v1/admin/element`,{
//       imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       width: 1,
//       height: 1,
//       static: true
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })

//     element2Id = element2.data.id

//     const map = await axios.post(`${backendURL}/api/v1/admin/map`,{
//       thumbnail: 'https://thumbnail.com/a.png',
//       dimensions: "100x200",
//       defaultElements:[{
//         elementId: element1Id,
//         x:20,
//         y:20
//       },{
//         elementId: element2Id,
//         x:18,
//         y:20
//       }]
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })

//     mapId = map.data.mapId
//   })

//   test('user is able to create a space', async()=>{
//    const res =  await axios.post(`${backendURL}/api/v1/space`,{
//       name: 'test',
//       dimensions: '100x679',
//       mapId: mapId 
//     },{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })

//     expect(res.spaceId).toBeDefined()

//   })
//   test('user is able to create a space without mapId (empty space)', async()=>{
//    const res =  await axios.post(`${backendURL}/api/v1/space`,{
//       name: 'test',
//       dimensions: '100x679',
//     },{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })

//     expect(res.spaceId).toBeDefined()

//   })
//   test('user is not able to create a space without mapId and dimensions (empty space)', async()=>{
//    const res =  await axios.post(`${backendURL}/api/v1/space`,{
//       name: 'test',
//     },{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })

//     expect(res.statusCode).toBe(400);

//   })

//   test('user is not able to delete a space that doesnt exist', async()=>{
//     const res = await axios.delete(`${backendURL}/api/v1/map/anyRandomIdThatDoesntExist`,{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })
  
//     expect(res.statusCode).toBe(400);

//   })

//   test('user is able to delete a space', async()=>{

//     const space = await axios.post(`${backendURL}/api/v1/space`,{
//       name:'mySpace',
//       dimensions: '100x200'
//     },{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })

//     const deleteRes = axios.delete(`${backendURL}/api/v1/space/${space.data.spaceId}`,{
//       headers:{
//         Authorization:`Bearer ${userToken}`
//       }
//     })
  
//     expect(deleteRes.statusCode).toBe(200);

//   })

//   test('user should not be able to delete another person space',async()=>{
//     const space = await axios.post(`${backendURL}/api/v1/space`,{
//       name:'mySpace',
//       dimensions: '100x200'
//     },{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })

//     const deleteRes = axios.delete(`${backendURL}/api/v1/space/${space.data.spaceId}`,{
//       headers:{
//         Authorization:`Bearer ${adminToken}`
//       }
//     })
  
//     expect(deleteRes.statusCode).toBe(400);
//   })

//   test('admin has no spaces initially', async()=>{
//     const res = await axios.get(`${backendURL}/api/v1/space/all`,{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })

//     expect(res.data.spaces.length).toBe(0);
//   })

//   test('admin has spaces after creation', async()=>{
//     const res = await axios.post(`${backendURL}/api/v1/space`,{
//       name: 'abc',
//       dimensions: '100x230'
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })

//     const resp = await axios.get(`${backendURL}/api/v1/space/all`,{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
//     const filteredSpace = resp.data.spaces.find(x => x.id = res.data.spaceId)
//     expect(resp.data.spaces.length).not.toBe(0);
//     expect(filteredSpace).toBeDefined()
//   })

// })

// describe('arena endPoints',()=>{
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let userToken;
//   let userId;

//   let adminId;
//   let adminToken;

//   let spaceId;

//   beforeAll(async()=>{
//     const username = 'bigDihh'+Math.random()*6;
//     const password = '12345';

//     const response = await axios.post(`${backendURL}/api/v1/signup`,{
//       username,
//       password,
//       role: 'admin'
//     })

//     adminId = response.data.userId;

//     const signinResponse = await axios.post(`${backendURL}/api/v1/signin`,{
//       username,
//       password
//     })

//     adminToken = signinResponse.data.token;


//     const userResponse = await axios.post(`${backendURL}/api/v1/signup`,{
//       username: username + "-user",
//       password,
//       role: 'user'
//     })

//     userId = userResponse.data.userId;

//     const userSigninResponse = await axios.post(`${backendURL}/api/v1/signin`,{
//       username: username + "-user",
//       password
//     })

//     userToken = userSigninResponse.data.token;

//     const element1 = await axios.post(`${backendURL}/api/v1/admin/element`,{
//       imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       width: 1,
//       height: 1,
//       static: true
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
    
//     element1Id = element1.data.id;

//     const element2 = await axios.post(`${backendURL}/api/v1/admin/element`,{
//       imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//       width: 1,
//       height: 1,
//       static: true
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })

//     element2Id = element2.data.id

//     const map = await axios.post(`${backendURL}/api/v1/admin/map`,{
//       thumbnail: 'https://thumbnail.com/a.png',
//       dimensions: "100x200",
//       defaultElements:[{
//         elementId: element1Id,
//         x:20,
//         y:20
//       },{
//         elementId: element2Id,
//         x:18,
//         y:20
//       }]
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })

//     mapId = map.data.mapId

//     const space = await axios.post(`${backendURL}/api/v1/space`,{
//       name: 'test',
//       dimensions: '100x678',
//       mapId
//     },{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })
//     spaceId = space.data.spaceId
//   })

//   test('Incorrect spacId returns a 400', async()=>{
//     let incorrectSpace = 'randomAssSpaceid';
//     const res = await axios.get(`${backendURL}/api/v1/space/${incorrectSpace}`,{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     });

//     expect(res.statusCode).toBe(400);
//   })

//   test('correct spaceId returns a 200',async()=>{
//     let spaceId = 'spaceSahiId'
//     const res = await axios.get(`${backendURL}/api/v1/space/${spaceId}`,{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     });

//     expect(res.statusCode).toBe(200);
//     expect(res.data.dimensions).toBe('100x678');
//     expect(res.data.elements).toBe(3);
//   })

//   test('delete endpoint', async()=>{
//     const res = await axios.delete(`${backendURL}/api/v1/spaces/${spaceId}`,{
//       headers:{
//         Authorization: `Bearer ${userToken}`
//       }
//     })
//   })
// })