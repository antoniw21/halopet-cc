const admin = require('firebase-admin');
const db = require('./index')
var uid = null;

const registerNewUserHandler = async (request, h) => {
  const { email, password, confirm_password } = request.payload;

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // https://firebase.google.com/docs/auth/admin/manage-users?hl=id#create_a_user
  // bentuk code dirubah dari promise ke async/await

  if (password !== confirm_password) {
    const response = h.response({
      status: 'fail',
      message: 'password and confirm password do not matchs!'
    })
    response.code(400);
    return response;
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    uid = userRecord.uid;
    console.log('Successfully created new user:', userRecord.uid);

    // add user to firestore
    const data = {
      name: 'Los Angeles',
    };
    const res = await db.collection('users').doc('contoh1').set(data);

    const response = h.response({
      status: 'success',
      message: `New user added successfully.`,
    });
    response.code(201);
    return response;

  } catch (error) {
    console.log('Error creating new user:', error);

    // https://firebase.google.com/docs/auth/admin/errors?hl=id

    if (error.code === 'auth/invalid-password') {
      const response = h.response({
        status: 'fail',
        message: 'The password must be a string with at least 6 characters!'
      })
      response.code(400);
      return response;
    }

    if (error.code === 'auth/email-already-exists') {
      const response = h.response({
        status: 'fail',
        message: 'The email address is already in use by another account!'
      })
      response.code(409);
      return response;
    }

    // admin.auth()
    //   .deleteUser(uid)
    //   .then(() => {
    //     console.log('Successfully deleted user');
    //   })

    const response = h.response({
      status: 'fail',
      message: `Failed to add new user!`,
    });
    response.code(500);
    return response;
  }
}

module.exports = { registerNewUserHandler }