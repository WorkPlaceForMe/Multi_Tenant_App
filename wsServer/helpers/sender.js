const ws = require('ws')
const { v4: uuidv4 } = require('uuid')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.sender = async function(){
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzMzMtNjY2NjY2LWNjY2NjYy1ubm5ubm4iLCJpZF9hY2NvdW50IjoiMzMzMy02NjY2NjYtY2NjY2NjLW5ubm5ubiIsImlkX2JyYW5jaCI6IjMzMzMtNjY2NjY2LWNjY2NjYy1ubm5ubm4iLCJpYXQiOjE2NzUxNzk3NjgsImV4cCI6MTY3NTIyMjk2OH0.ppveAXWWzz0zh66_SRLKzt8jANRjEiJDvUTMz9tSQtI'
    try{
        const connection = new ws('ws://localhost:3301/ws/connect/algorithm', token)
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
                "Analytic": `'${analytic}'`,
                "CameraId": "bffdb3cf-8cf3-4454-9474-3a47cf99ef10",
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
                "Analytic": `'${analytic}'`,
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
                "Analytic": `'${analytic}'`,
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