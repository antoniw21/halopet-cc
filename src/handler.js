const admin = require('firebase-admin');

const registerNewUserHandler = async (request, h) => {
  //const { age, birthdate, city, email, password, gender, name, phone, picture,
  //p_age, p_birthday, p_breed, p_color, p_height, p_name, p_weight }
  const { age } = request.payload;

  // https://firebase.google.com/docs/auth/admin/manage-users?hl=id#create_a_user
  // bentuk code dirubah dari promise ke async/await

  //const createUser = async () => {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'user@example.com',
      emailVerified: false,
      phoneNumber: '+11234567890',
      password: 'secretPassword',
      displayName: 'John Doe',
      photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: false,
    });

    console.log('Successfully created new user:', userRecord.uid);

    const response = h.response({
      status: 'success',
      message: `User berhasil ditambahkan`,
    });
    response.code(201);
    return response;

  } catch (error) {
    console.log('Error creating new user:', error);

    const response = h.response({
      status: 'fail',
      message: `User gagal ditambahkan`,
    });
    response.code(500);
    return response;
  }
  //}

  //createUser();
  // add user to firestore

}

module.exports = { registerNewUserHandler }