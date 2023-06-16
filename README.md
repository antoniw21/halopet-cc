
# Allopet

Allopet is an Android application that functions to detect early skin diseases in pets using machine learning technology. For now, Allopet can detect dogs's skin diseases.

This repository contains back-end source code for handle our application request (including integration with machine learning model for making prediction) and support the operation of the application to run properly.

## Authors

- Cloud Computing [@antoniw21](https://www.github.com/antoniw21)
- Cloud Computing [@valyasandria](https://www.github.com/valyasandria)

## Team Member

- Cloud Computing [@antoniw21](https://www.github.com/antoniw21)
- Cloud Computing [@valyasandria](https://www.github.com/valyasandria)
- Machine Learning [@Salma87-glitch](https://www.github.com/Salma87-glitch)
- Machine Learning [@MushabTinumbang](https://www.github.com/MushabTinumbang)
- Machine Learning [@azminurf](https://www.github.com/azminurf)
- Mobile Development [@Ragnarom-kun](https://www.github.com/Ragnarom-kun)

## Features

- Register new user
- Upload image and get prediction
- Show home page
- Show user's profile
- Show list of analysis history
- Show detail of analysis history
- Update user's profile
- Delete analysis history

## Installation

### Firebase as our authentication and database

1. Go to Firebase console (<https://console.firebase.google.com>).
2. Create a project.
3. Enable for Authentication, Firebase Database, and Storage services.
4. Get your firebase-sdk.json with Generate new private key in Service accounts tab (project settings > Service accounts).

### Store our model in Google Cloud Bucket Storage

1. Go to Google Cloud console (<https://console.cloud.google.com>).
2. Create a project.
3. Navigate to Cloud Storage tab and choose Bucket.
4. Create a new bucket.
5. Store the .json model here and retrieve the link for machine learning handler model reference.

### Get the project to your local machine

1. Clone this project.
2. In your local machine terminal, change directory to this project.
3. Install Node.js dependencies:

```bash
npm install
```

4. Add firebase-sdk.json and .env file.
5. Run the project:

```bash
npm run start-prod
```

## Configuration

You need to specify this configuration in .env file:

```bash
PROJECT_ID=your_firebase_project_id
PORT=your_port
HOST=your_host_name
BUCKET=your_firebase_storage_name
CODE=your_environtment
OTHER=your_ipadress_in_deployment
```

## Deployment

To deploy this project on compute engine with these steps:

1. Create instance of compute engine in Google Cloud.
2. Open the ssh.
3. Clone this repository to your instance.
4. Change directory to the project.
5. Add your firebase sdk and .env file.
6. Install Node.js dependencies:

```bash
npm install
```

7. Run the project with pm2:

```bash
pm2 start npm --name "your-project" -- run "start-prod"
```

## API Documentation

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
|`POST`  |`/register`           |Create new user                 |
|`GET`   |`/home/{id}`          |Show user's data in home section|
|`GET`   |`/profile/{id}`       |Show all of user's data         |
|`PUT`   |`/profile/{id}`       |Update user's data              |
|`GET`   |`/image/{id}`         |Show all of analysis history    |
|`POST`  |`/image/{id}`         |Upload photo for prediction     |
|`GET`   |`/image/{id}/{id_doc}`|Show detail of analysis history |
|`DELETE`|`/image/{id}/{id_doc}`|Delete analysis history         |

For details, please check our postman API documentation:
(<https://documenter.getpostman.com/view/22799311/2s93shy9PT#4e026764-8c31-4a30-8027-844eb980cc5f>)

## Reference

- Firebase (<https://firebase.google.com/docs>)
- Google Cloud Platfrom (<https://cloud.google.com/docs>)
- Tensorflow.js (<https://www.tensorflow.org/js/tutorials/setup>)
