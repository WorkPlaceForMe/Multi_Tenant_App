const ws = require('ws')
const { v4: uuidv4 } = require('uuid')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.sender = async function(){
    try{
        const connection = new ws('ws://localhost:3301/ws/connect/algorithm')
        let ts, uuid, message, dwell = 10, analytic, parameters, track_id = 1, zone = 0

        setInterval(async ()=>{
            uuid = uuidv4()
            ts = Math.round((new Date()).getTime() / 1000)
            dwell = dwell + 5
            if(dwell % 2 == 0){
                zone = 1
            }else{
                zone = 0
            }
            if(dwell === 80) dwell = 10
            track_id++
            parameters = {
                camera_name: "test House",
                dwell: dwell,
                track_id: 1
            }
            analytic = 2
            message = {
                "id": `${uuid}`,
                "TimeStamp": ts,
                "Analytic": analytic,
                "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
                "Parameters": parameters,
                "Detail": "string",
                "UrlImage": "string"
            }
            connection.send(JSON.stringify(message))

            parameters = {
                camera_name: "test House",
            }
            analytic = 66
            await delay(1000)
            message = {
                "id": `${uuidv4()}`,
                "TimeStamp": Math.round((new Date()).getTime() / 1000),
                "Analytic": analytic,
                "CameraId": "94d9d7fc-4c29-49da-8758-0079ac973e0c",
                "Parameters": parameters,
                "Detail": "string",
                "UrlImage": "string"
            }
            connection.send(JSON.stringify(message))
            parameters = {
                camera_name: "test House",
                zone: zone,
                track_id: track_id
            }
            analytic = 17
            await delay(1000)
            message = {
                "id": `${uuid}`,
                "TimeStamp": ts,
                "Analytic": analytic,
                "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
                "Parameters": parameters,
                "Detail": "string",
                "UrlImage": "string"
            }
            connection.send(JSON.stringify(message))
            parameters = {
                camera_name: "test House",
                zone: 0,
                track_id: track_id
            }
            analytic = 16
            await delay(1000)
            message = {
                "id": `${uuid}`,
                "TimeStamp": ts,
                "Analytic": analytic,
                "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
                "Parameters": parameters,
                "Detail": "string",
                "UrlImage": "string"
            }
            connection.send(JSON.stringify(message))
        }, 5000)
    }catch(err){
        console.error(err)
    }
}