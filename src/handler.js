const { admin, db, bucket } = require('./initialize');
const path = require('path');
const { nanoid } = require('nanoid');
const fs = require('fs');
const fs_ex = require('fs-extra');
const loadModelAndMakePredictions = require('./ml');

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

    const addUserToFirestore = await db.collection('users').doc(`${userRecord.uid}`).set(newUser);
    const addPetToFirestore = await db.collection('pets').doc(`${userRecord.uid}`).set(newUserPet);
    console.log('user added to firestore');

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

const getListResultHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const showresult = db.collection('users').doc(id).collection('foto');
    const snapshot = await showresult.get();

    const result = [];
    snapshot.forEach(doc => {
      const { gambar, uploadedAt } = doc.data()
      const docid = doc.id

      result.push(
        {
          [docid]: {
            gambar: gambar,
            uploadedAt: uploadedAt
          }
        }
      );
    });

    const response = h.response({
      status: 'success',
      message: `Document successfully displayed.`,
      data: result
    });
    response.code(200);
    return response;

  } catch (error) {
    console.log(error);
    const response = h.response({
      status: 'fail',
      message: `Failed to add new user!`,
    });
    response.code(500);
    return response;
  }
}

const getDetailResultHandler = async (request, h) => {
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

    const [files] = await bucket.getFiles();
    files.forEach(file => {
      console.log(file.name);
      if (file.name === `${id}/${id_doc}`) {
        found = true;
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
    await bucket.file(`${id}/${id_doc}`).delete();
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

//

const getHomeProfileById = async (request, h) => {
  // show summary user profile (user's name, pet's name)
  const { id } = request.params
  const docRef1 = db.collection('users');
  const docRef2 = db.collection('pets');

  try {
    const [doc1, doc2] = await Promise.all([
      docRef1.doc(id).get(),
      docRef2.doc(id).get(),
    ]);

    if (!doc1.exists || !doc2.exists) {
      console.log('No such document!');
      const response = h.response({
        status: 'fail',
        message: 'Data not found!',
      });
      response.code(404);
      return response;
    }

    var username = doc1.get('name');
    if (username === '') {
      username = doc1.get('email');
    }
    console.log(username);

    var petname = doc2.get('name')
    if (!petname) {
      petname = 'complete your profile'
    }
    console.log(petname);

    const response = h.response({
      status: 'success',
      message: 'Data found',
      data: {
        username: username,
        petname: petname
      }
    });
    response.code(200);
    return response;

  } catch (error) {
    console.error('Error getting document: ', error);
    const response = h.response({
      status: 'fail',
      message: `Error: ${error}`
    });
    response.code(500);
    return response;
  }
};

const addSkinImage = async (request, h) => {
  // add skin diseases image for further analysis
  const { id } = request.params;
  const data = request.payload;

  const filename = data.data.hapi.filename;
  console.log(filename);

  try {
    // rename filename with nanoid.file extension
    // use nanoid as id_doc and storage file name
    const fileid = nanoid(7);

    if (!data) {
      const response = h.response({
        status: 'fail',
        message: `Image not found!`
      });
      response.code(404);
      return response;
    }

    const destination = id + '/' + fileid + '.' + filename.split('.').pop();
    const file_doc_id = fileid + '.' + filename.split('.').pop();
    console.log(destination);

    // upload to local 'uploads' directory
    const uploadLocal = __dirname + '/uploads/' + file_doc_id;
    fs.mkdirSync(__dirname + '/uploads', { recursive: true });

    const file = fs.createWriteStream(uploadLocal);

    file.on('error', (err) => {
      console.error(err)
      const response = h.response({
        status: 'fail',
        message: `in try: ${err}`
      });
      response.code(500);
      return response;
    });

    data.data.pipe(file);

    file.on('finish', (err) => {
      const ret = {
        filename: filename,
        headers: data.data.hapi.headers
      }
      console.log(JSON.stringify(ret));
    })

    // upload to firebase storage
    const fileUpload = bucket.file(destination);

    data.data.pipe(fileUpload.createWriteStream())
      .on('error', (err) => {
        console.error(err);
        const response = h.response({
          status: 'fail',
          message: `Image failed to upload, ${error}`
        });
        response.code(500);
        return response;
      })
      .on('finish', async () => {
        console.log('File uploaded successfully!');
        console.log(`Storage location: ${destination}`);
      });

    const uploadedAt = new Date().toLocaleString()
    console.log(`${destination} uploaded at ${uploadedAt}`);

    // get image link
    const url = await bucket.file(destination).getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    const link = `${url[0]}`;
    console.log(link);

    // call ml handler and get prediction
    const hasil = await loadModelAndMakePredictions(`src/uploads/${file_doc_id}`);
    console.log(hasil);

    // delete local stored image
    const filePath = `src/uploads/${file_doc_id}`;

    fs_ex.remove(filePath)
      .then(() => {
        console.log('File deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });

    //upload to firebase storage
    const colFoto = {
      gambar: link,
      hasil: hasil,
      uploadedAt: uploadedAt
    }

    const storeImage = await db.collection('users').doc(id).collection('foto').doc(file_doc_id).set(colFoto);
    console.log('Image stored!');

    const response = h.response({
      status: 'success',
      message: `Image uploaded`,
      id: `${file_doc_id}`
    });
    response.code(201);
    return response;

  } catch (error) {
    console.error("Error storing image:", error);
    const response = h.response({
      status: 'fail',
      message: `Image failed to upload, ${error}`
    });
    response.code(500);
    return response;
  }
};

const getDetailProfileById = async (request, h) => {
  // show detail user's profile(profile page)
  const { id } = request.params;
  const collection1Ref = db.collection('users');
  const collection2Ref = db.collection('pets');

  try {
    const [doc1, doc2] = await Promise.all([
      collection1Ref.doc(id).get(),
      collection2Ref.doc(id).get(),
    ]);

    if (!doc1.exists || !doc2.exists) {
      console.log('No such document!');
      const response = h.response({
        status: 'error',
        message: `Document not found!`,
      });
      response.code(404);
      return response;
    }

    const data1 = doc1.data();
    const data2 = doc2.data();

    console.log('Data user:', data1);
    console.log('Data pet:', data2);

    // user's data
    const {
      createdAt,
      birthdate,
      gender,
      city,
      phone,
      age,
      email,
      picture,
      updatedAt,
      name
    } = data1

    // pet's data
    const {
      birthday: p_birthday,
      color: p_color,
      weight: p_weight,
      age: p_age,
      breed: p_breed,
      height: p_height,
      name: p_name
    } = data2

    const response = h.response({
      status: 'success',
      message: 'Data available',
      data: {
        user: {
          birthdate: birthdate,
          gender: gender,
          city: city,
          phone: phone,
          age: age,
          email: email,
          picture: picture,
          name: name,
          createdAt: createdAt,
          updatedAt: updatedAt
        },
        pet: {
          birthday: p_birthday,
          color: p_color,
          weight: p_weight,
          age: p_age,
          breed: p_breed,
          height: p_height,
          name: p_name
        }
      }
    });
    response.code(200);
    return response;

  } catch (error) {
    console.error('Error getting documents: ', error);
    const response = h.response({
      status: 'error',
      message: `${error}`,
    });
    response.code(500);
    return response;
  }
};

const editProfileById = async (request, h) => {
  // mengubah data profile (user & pet)
  const {
    birthdate,
    gender,
    city,
    phone,
    age,
    picture,
    name,
    p_birthday,
    p_color,
    p_weight,
    p_age,
    p_breed,
    p_height,
    p_name
  } = request.payload;
  const { id } = request.params;
  const updatedAt = new Date().toISOString();

  try {
    const docRef = db.collection('users').doc(id);
    const doc2Ref = db.collection('pets').doc(id);

    // update for user
    const updateuser = await docRef.update({
      birthdate: birthdate,
      gender: gender,
      city: city,
      phone: phone,
      age: age,
      picture: picture,
      name: name,
      updatedAt: updatedAt
    }, { ignoreUndefinedProperties: true });

    const updatepet = await doc2Ref.update({
      birthday: p_birthday,
      color: p_color,
      weight: p_weight,
      age: p_age,
      breed: p_breed,
      height: p_height,
      name: p_name,
      updatedAt: updatedAt
    }, { ignoreUndefinedProperties: true });

    const response = h.response({
      status: 'success',
      message: `Data updated successfully`,
    });
    response.code(201);
    return response;

  } catch (error) {
    console.log(error)
    const response = h.response({
      status: 'fail',
      message: `${error}`,
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  registerNewUserHandler,
  getDetailResultHandler,
  deleteImageHandler,
  getListResultHandler,
  //
  getHomeProfileById,
  addSkinImage,
  getDetailProfileById,
  editProfileById
}