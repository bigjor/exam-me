const express = require('express');
const router = express.Router();
const Utils = require('./utils/utils');

router.get('/', function(req, res) {
  res.json({ ok: true });  
});


// UPLOAD FILE
router.post('/uploadFile', async (req, res) => {
  const { file } = req.files
  const { 
    path = file.path, 
    id = 'UNKNOWN' 
  } = req.body

  const newPath = `./files/${id}/${path}`
  try {
    await file.mv(newPath)
    res.json({"ok": true});
  } catch (error) {
    res.json({ ok: false, message: err })
  }
})

// CREATE ACCESS MQTT
router.post('/createAccessMqtt', async (req, res) => {
  if (!globalThis.mqttClient.connected) {
    res.status(500).json({ ok: false, message: 'mqtt service is not connected' })
  } else {
    const data = {
      timestamp: (new Date()).getTime(),
    }
  
    globalThis.db.collection('access').insertOne(data, async (err, result) => {
      if (err) {
        res.status(500).json({ ok: false, message: err })
      } else {
        // subscribe to mqtt
        if (req.body.admin) {
          globalThis.adminClients.push(data._id)
        } else {
          globalThis.clients.push(data._id)
        }
        globalThis.mqttClient.subscribe(`examme/${data._id}`, { qos: 1 }, async (err) => {
          if (err) {
            res.status(500).json({ ok: false, message: err })
          } else {
            setTimeout(() => {
              globalThis.actions.sendRooms()
            }, 200)
            res.json({ ok: true, ...data });
          }
        });
      }
    })
  }
})
router.post('/updateAccessMqtt', async (req, res) => {
  setTimeout(() => {
    globalThis.actions.sendRooms()
  }, 200)
  res.json({ ok: true });
})

// router.post('/createRoom', async (req, res) => {
//   const code = Utils.randomString()
//   const { name } = req.body
//   await globalThis.db
//     .collection('rooms')
//     .insertOne({ 
//       code,
//       name,
//     })

//   await globalThis.actions.sendRooms()

//   res.json({ ok: true, code })
// })

router.get('/room/:code', async (req, res) => {
  const code = req.params.code;

  db.collection('rooms').findOne({ code }, (err, result) => {
    if (err || !result) { 
      res.status(404).json({ ok: false, message: err || 'room not found' })
    } else {
      res.json(result);
    }
  })
})

module.exports.router = router;