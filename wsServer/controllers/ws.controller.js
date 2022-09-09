const fs = require('fs')
require('dotenv').config({ path: '../../config.env' })
const check = require('../helpers/structure').checkStructure
const file = `${process.env.resourcePath}logs/wsAccess.log`
const line = '\n'
const { v4: uuidv4 } = require('uuid')
const connections = []

exports.ws =  (ws ,req) => {
    const id = req.params.id
    let dev = true
    if(process.env.NODE_ENV === 'production'){
        dev = false
    }
    let writer = fs.createWriteStream(file, { flags: 'a' }) 

    if (id !== 'client' && id !== 'algorithm'){
        const messa = {
            success: false,
            error: "Unauthorized"
        }
        ws.send(JSON.stringify(messa));
        const mess = `Tried to connect ${req._remoteAddress} using id: ${id} at ${req._startTime}.`
        writer.write(mess + line);
        if(dev === true) console.log(mess);
        return ws.close()
    }

    try{
        const mess = `connection from: ${id} in ${req._remoteAddress} at ${req._startTime}.`
        const initialMess =`Started ${mess}`
        ws.uuid = uuidv4()

        if(dev === true) console.log(initialMess)

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
                const value = check(message)
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
            writer.write(finalMess + line);
            rem(ws.uuid)
            if(dev === true) console.log(finalMess)
        })
    }catch(err){
        if(dev === true) console.log(err)
    }

}

function rem(uuid){
    for(let i = 0; i < connections.length; i++){
        if(connections[i].uuid === uuid){
            connections.splice(i, 1)
        }
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