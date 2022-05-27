const fs = require('fs')
require('dotenv').config({ path: '../../config.env' })

let connections = []

exports.ws =  (ws ,req) => {
    const id = req.params.id

    let dev = true
    if(process.env.NODE_ENV === 'production'){
        dev = false
    }

    if (!id) {
        ws.send('No id provided')
        return ws.close()
    }

    if (id !== 'client' && id !== 'algorithm'){
        ws.send('Unauthorized')
        return ws.close()
    }

    try{
        const mess = `connection from: ${id} in ${req._remoteAddress} at ${req._startTime}.`
        const line = '\n'
        const initialMess =`Started ${mess}`
        const file = './resources/logs/wsAccess.log'

        if(dev === true) console.log(initialMess)

        let writer = fs.createWriteStream(file, { flags: 'a' }) 
        writer.write(initialMess + line);

        const connectionMessage = {
            success: true,
            time: new Date()
        }
        ws.send(JSON.stringify(connectionMessage))
        
        if(id === 'algorithm'){
            ws.id = 'algorithm'
            connections.push(ws)
            ws.on('message', function incoming(message) {
                if(dev === true) console.log(`${id} said: ${message}`);
                const value = checkStructure(message)
                if(value.result === false){
                    const messa = {
                        success: false,
                        error: value.reason
                    }
                    ws.send(JSON.stringify(messa));
                }else{
                    broadcast(message, ws)
                }
            });
        }else if (id === 'client'){
            ws.id = 'client'
            connections.push(ws)
            ws.on('message', function incoming(message) {
                if(dev === true) console.log(`${id} said: ${message}`);
                const messa = {
                    success: false,
                    error: "Message can't be sent"
                }
                ws.send(JSON.stringify(messa));
            });
        }
    
        ws.on('close', () => {
            const finalMess = `Stopped ${mess}`
            let writer = fs.createWriteStream(file, { flags: 'a' }) 
            writer.write(finalMess + line);
            if(dev === true) console.log(finalMess)
        })
    }catch(err){
        if(dev === true) console.log(err)
    }

}

function broadcast(message){
    connections.forEach( (ws) => {
        if(ws.id === 'algorithm'){
            return;
        }
        ws.send(message)
    })
}

function checkStructure(message){
    let result = {
        result: false,
        reason: ''
    }

    const type = {
        id: "string",
        TimeStamp: "number",
        Analytic: "string",
        CameraId: "string",
        Parameters: "object",
        Detail: "string",
        UrlImage: "string"
    }

    try{
        message = JSON.parse(message)
        for(const ty in type){
            if(message[ty] === undefined){
                result.reason = `${ty} needs to exist and be ${type[ty]} type.`
                return result
            }
            if(typeof(message[ty]) !== type[ty]){
                result.reason = `${ty} needs to be ${type[ty]} type.`
                return result
            }
        }
        delete result.reason
        result.result = true
        return result
    }catch(err){
        console.log(err)
        result.reason = 'Message needs to be JSON type.'
        return result
    }
}