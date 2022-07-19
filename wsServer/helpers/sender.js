const ws = require('ws')
const { v4: uuidv4 } = require('uuid')

exports.sender = function(){
    try{
        const connection = new ws('ws://localhost:3301/ws/connect/algorithm')
        let ts, uuid, message, dwell = 10

        setInterval(()=>{
            uuid = uuidv4()
            ts = Math.round((new Date()).getTime() / 1000)
            dwell = dwell + 5
            if(dwell === 80) dwell = 10
            message = {
                "id": `${uuid}`,
                "TimeStamp": ts,
                "Analytic": "Loitering",
                "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
                "Parameters": {
                    camera_name: "test House",
                    dwell: 35,
                    track_id: 1
                },
                "Detail": "string",
                "UrlImage": "string"
            }
            connection.send(JSON.stringify(message))
        }, 5000)
    }catch(err){
        console.error(err)
    }
}