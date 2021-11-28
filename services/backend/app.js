const Utils       = require('./utils/utils');
const fileUpload  = require('express-fileupload');
const express     = require('express')
const morgan      = require('morgan')
const mqtt        = require('mqtt');
const cors        = require('cors')
const path        = require('path')
const fs          = require('fs')
const app         = express()

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://mongodb_service/exam-me';

const adminCode = Utils.randomString()

//Configuraciones
app.set('port', process.env.PORT || 9999);
app.set('json spaces', 2)

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json({ limit: '1024mb' }));
app.use(fileUpload({ createParentPath: true }));

// Cors
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Router
var router = require('./router').router
app.use('/api', router);

//Iniciando el servidor
app.listen(app.get('port'), () => {
  console.log(`Import-Service listening on ${app.get('port')}`);
});

// MQTT
var client  = mqtt.connect('mqtt://mqtt_service', { clientId: 'backend_service' });
client.on('connect', () => {	
  console.log('Connected to Mqtt');
})
client.on('error', () => {	
  console.log('Mqtt Error Connection');
})

client.on('message', (topic, message, packet) => {
	console.log('message is '+ message);
	console.log('topic is '+ topic);
	
  let isAdmin = false
  for (let adminClient of globalThis.adminClients)
    if (adminClient == topic.split('/')[1])
      isAdmin = true

  const data = JSON.parse(message.toString());
  const action = data.action

  if (action == 'room/create' && isAdmin) {
    globalThis.actions.actionRoomCreate(data)
  } else if (action == 'room/update' && isAdmin) {
    globalThis.actions.actionRoomUpdate(data)
  } else if (action == 'room/details' && isAdmin) {
    globalThis.actions.actionRoomDetails(data)
  }
});
globalThis.mqttClient = client;

// Mongodb
MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log('Error connecting to MongoDB');
    return;
  }
  globalThis.db = db;
  console.log('Connected to MongoDB');

  // Generate admin code
  {
    
    globalThis.db.collection('rooms').updateOne({ _id: 'admin' }, { $set: { code: adminCode } }, { upsert: true })

    console.log('ADMIN CODE: ' + adminCode)
  }
});

globalThis.clients = []
globalThis.adminClients = []

globalThis.actions = {
  sendRooms: () => {
    return new Promise((resolve) => {
      globalThis.db.collection('rooms').find({}).toArray((err, result) => {
        if (!err) {
          for (const adminClient of globalThis.adminClients) {
            globalThis.mqttClient.publish(`examme/${adminClient}`, JSON.stringify({
              content: 'rooms',
              rooms: result.sort((a, b) => -(a.timestamp - b.timestamp)).filter(room => room._id != 'admin')
            }))
          }
        }
        resolve()
      })
    })
  },
  sendRoom: (room, requester) => {
    let data = { content: 'room' }
    if (room) data.room = room
    globalThis.mqttClient.publish(`examme/${requester}`, JSON.stringify(data))
  },
  actionRoomCreate: async (data) => {
    const code = Utils.randomString()
    const { name } = data.body
    globalThis.db
      .collection('rooms')
      .insertOne({ 
        active: true,
        code,
        name,
        timestamp: new Date().getTime()
      }, (err) => !err && globalThis.actions.sendRooms())
  },
  actionRoomUpdate: async (data) => {
    data.body._id = ObjectId(data.body._id)
    globalThis.db
      .collection('rooms')
      .save(data.body)
      .then(() => globalThis.actions.sendRooms())
  },
  actionRoomDetails: async (data) => {
    const { _id, access } = data.body
    globalThis.db
      .collection('rooms')
      .findOne({ _id: ObjectId(_id) })
      .then(room => globalThis.actions.sendRoom(room, access))
  },
  actionRoomToggleState: async (data) => {
    globalThis.db
      .collection('rooms')
      .updateOne({ _id: data.body._id }, { $set: { active: false } }, { upsert: false })
      .then(() => globalThis.actions.sendRooms())
      
  },
  actionRoomUpdateName: async (data) => {
    globalThis.db
      .collection('rooms')
      .update({ _id: data.body._id }, { $set: { name: data.body.name } }, { upsert: false })
      .then(() => globalThis.actions.sendRooms())
  },
  
}