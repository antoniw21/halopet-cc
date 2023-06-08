const { admin, db, bucket } = require('./initialize');
const path = require('path');

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
    // add user to authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // check whether user is created or not
    if (typeof userRecord === 'undefined') {
      const response = h.response({
        status: 'fail',
        message: 'Failed to created new user account!'
      })
      response.code(500);
      return response;
    }

    console.log('Successfully created new user:', userRecord.uid);
    console.log('email: ', email);

    // add user to firestore
    const newUser = {
      age: '',
      birthdate: '',
      city: '',
      email: '',
      password: '',
      gender: '',
      name: '',
      phone: '',
      picture: '',
      email: email,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    const newUserPet = {
      age: '',
      birthday: '',
      breed: '',
      color: '',
      height: '',
      name: '',
      weight: '',
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    const colFoto = {
      gambar: '',
      hasil: '',
    }

    const addUserToFirestore = await db.collection('users').doc(`${userRecord.uid}`).set(newUser);
    // const addPetToFirestore = await db.collection('pets').doc(`${userRecord.uid}`).set(newUserPet);
    // const fotToFirestore = await db.collection('users').doc(`${userRecord.uid}`).collection('foto').doc('1').set(colFoto);
    // console.log('user added to firestore');

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

    const response = h.response({
      status: 'fail',
      message: `Failed to add new user!`,
    });
    response.code(500);
    return response;
  }
}

const getResultHandler = async (request, h) => {
  const { id, id_doc } = request.params;

  try {
    const foto = db.collection('users').doc(`${id}`).collection('foto').doc(`${id_doc}`);
    const doc = await foto.get();
    if (!doc.exists) {
      console.log('No such document!');

      const response = h.response({
        status: 'fail',
        message: 'No such document!!'
      })
      response.code(404);
      return response;
    } else {
      console.log('Document data:', doc.data());

      const { gambar, hasil } = doc.data()
      console.log('Document data:', gambar);
      console.log('Document data:', hasil);

      const response = h.response({
        status: 'success',
        message: `Document found`,
        data: {
          gambar: gambar,
          hasil: hasil
        }
      });
      response.code(200);
      return response;
    }

  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: `Error : ${error}!`
    })
    response.code(500);
    return response;
  }
}

const deleteImageHandler = async (request, h) => {
  const { id, id_doc } = request.params;

  try {
    // check in firebase storage
    // Lists files in the bucket
    var found = false;
    var eks = null;

    const [files] = await bucket.getFiles();
    files.forEach(file => {
      const filepath = file.name;
      const filewithouteks = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)));
      console.log(filewithouteks);
      if (filewithouteks === `${id}\\${id_doc}`) {
        found = true;
        eks = path.extname(filepath)
        console.log(eks);
        console.log(`${found}!, Image ${file.name} found`);
      }
    });

    console.log(found);

    if (!found) {
      const response = h.response({
        status: 'fail',
        message: 'No such image!!'
      })
      response.code(404);
      return response;
    }

    // check whether doc is exist or not
    const foto = db.collection('users').doc(`${id}`).collection('foto').doc(`${id_doc}`);
    const doc = await foto.get();
    if (!doc.exists) {
      console.log('No such document!');

      const response = h.response({
        status: 'fail',
        message: 'No such document!!'
      })
      response.code(404);
      return response;
    }

    console.log('Document available');

    // delete doc
    // https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=en&authuser=0#delete_documents
    const res = await db.collection('users').doc(`${id}`).collection('foto').doc(`${id_doc}`).delete();

    // delete from firebase storage:
    // delete object from bucket
    await bucket.file(`${id}/${id_doc}${eks}`).delete();
    console.log(`success deleted image`);

    const response = h.response({
      status: 'success',
      message: `Document successfully deleted`,
    });
    response.code(200);
    return response;

  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: `Error: ${error}!`,
    });
    response.code(500);
    return response;
  }
}

module.exports = {
  registerNewUserHandler,
  getResultHandler,
  deleteImageHandler,
}