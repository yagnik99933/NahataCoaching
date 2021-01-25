const admin = require("firebase-admin");
const functions = require("firebase-functions");
const cors = require('cors')({origin: true});

var serviceAccount = require("./nahatacoaching-firebase-adminsdk-7dhlj-2a4bd66d59.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nahatacoaching.firebaseio.com"
});


// The Firebase Admin SDK to access Cloud Firestore.

// Function to check whether students exist or not . If not exists then it creates the user.
exports.studentCheck = functions.https.onRequest((request, response) => {


  var name = request.body.name;
  var mobileNo = request.body.mobileNo;

  if (!name || !mobileNo) {
    return "Please Enter Name";
  } else {
    admin
      .database()
      .ref("/student/" + mobileNo)
      .once("value")
      // eslint-disable-next-line promise/always-return
      .then((snapshot) => {
        var data = snapshot.val();
        // eslint-disable-next-line promise/always-return
        if (!data) {
          admin
            .database()
            .ref("/student/" + mobileNo)
            .set({ mobileNo, name, verified: false })
            .then((snapshot) => {
              response.status(200).send("Created New User...!!!");
            })
            .catch((errorObject) => {
              response.status(500).send("Error");
            });
        } else {
          response.status(200).send(" User Already Exists...!!!");
          return "User Already Exists";
        }
      })
      .catch((errorObject) => {
        response.status(500).send("Error");
      });
  }
});

// To get list of all courses :
exports.getAllCourses = functions.https.onRequest((request, response) => {
  admin
    .database()
    .ref("course")
    .once("value")
    .then((snapshot) => {
      var data = snapshot.val();
      response.end(data);
    })
    .catch((error) => {
      console.log("Error");
      response.send(500).send(error);
    });
});

// To update Student Course :
exports.updateStudentCourse = functions.https.onRequest(
  async (request, response) => {
    var courseEnrollmentStatus = "Pending";
    await admin
      .database()
      .ref("student/" + request.body.mobileNo)
      .update({
        courseId: request.body.courseId,
        courseName: request.body.courseName,
        courseCode: request.body.courseCode,
        courseEnrollmentStatus: courseEnrollmentStatus,
      })
      .then((snapshot) => {
        console.log("updated");
        response.send(snapshot);
      })
      .catch((error) => {
        console.log("Error");
        response.status(500).send(error);
      });
  }
);

// For testing only , Student Chat :
exports.studentChat = functions.https.onRequest(async (request, response) => {
  var val = Math.floor(Math.random() * 10000000);
  this.chatId = "CHAT" + val;

  await admin
    .database()
    .ref("chat/" + request.body.mobileNo + "/" + this.chatId)
    .set({
      chatText: request.body.chatText,
      chatId: this.chatId,
      entryDate: new Date().getTime(),
      senderName: request.body.senderName,
      sender: "student",
      senderId: request.body.mobileNo,
      status: true,
      teacherId: request.body.teacherId,
      mobileNo: request.body.mobileNo,
    })
    .then((snapshot) => {
      console.log("Sent");
      response.send(snapshot);
    })
    .catch((error) => {
      console.log("Error");
      response.status(500).send(error);
    });
});

// Push Notification (Internal):
exports.studentChatRecent = functions.https.onRequest(
  async (request, response) => {
    var val = Math.floor(Math.random() * 10000000);
    this.internalChatId = "INTCHAT" + val;

    await admin
      .database()
      .ref("notification/internal/" + this.internalChatId)
      .set({
        notificationType: "chatInput",
        chatText: request.body.chatText,
        internalChatId: this.internalChatId,
        entryDate: new Date().getTime(),
        senderName: request.body.senderName,
        sender: "student",
        senderId: request.body.mobileNo,
        status: true,
      })
      .then((snapshot) => {
        console.log("Sent");
        response.send(snapshot);
      })
      .catch((error) => {
        console.log("Error");
        response.status(500).send(error);
      });
  }
);

// Push Notification (External) :
exports.sendNotification = functions.https.onRequest(async (request, response) => { cors(request, response, () => {

if(request.body.notification.sendingToTopic){
  console.log(' IF Working')
  var message = {
    notification: {
      title: ''+request.body.notification.title,
      body: ''+request.body.notification.body
    },
    topic: request.body.notification.topic
  };

  admin.messaging().send(message)
    .then((snapshot) => {
      // Response is a message ID string.

      console.log('Successfully sent message:', snapshot);
      response.send(snapshot);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      response.status(500).send(error);
    });

    // If the notification is for all the students :
    if(request.body.notification.topic == 'nahata'){

      var entryDate = new Date().getTime();
      admin.database().ref('notification/external/nahata/'+entryDate)
      .set({ title: request.body.notification.title, body: request.body.notification.body, entryDate: entryDate,
        topic: request.body.notification.topic})
      .catch((error)=>{
        return error;
      });
    }

      // If the notification is for students of pariticular course :
      else{
        var entryDate = new Date().getTime();
        admin.database().ref('notification/external/course/' + request.body.notification.topic +'/'+ entryDate)
        .set({ title: request.body.notification.title, body: request.body.notification.body, entryDate: entryDate,
          topic: request.body.notification.topic})
        .catch((error)=>{
          return error;
        });
      }
  }

  else{
    console.log('Else Working')
    var registrationToken = ''+request.body.notification.token;
    console.log('Token'+ registrationToken);
    var message = {
      notification: {
        title: ''+request.body.notification.title,
        body: ''+request.body.notification.body
      }
    };

    admin.messaging().sendToDevice(registrationToken, message)
      .then((snapshot) => {
        // Response is a message ID string.

        console.log('Successfully sent message:', snapshot);
        response.send(snapshot);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
        response.status(500).send(error);
      });

     // Storing in DB the message of indiviual student :
     var entryDate = new Date().getTime();
     admin.database().ref('notification/external/student/' + request.body.notification.mobileNo +'/'+ entryDate)
     .set({ title: request.body.notification.title, body: request.body.notification.body, entryDate: entryDate,
         mobileNo: request.body.notification.mobileNo})
     .catch((error)=>{
       return error;
     });
  }
})
});



// //  Cron Job
// exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
//   console.log('This will be run every 5 minutes!');
//   return 'Working';
// });
