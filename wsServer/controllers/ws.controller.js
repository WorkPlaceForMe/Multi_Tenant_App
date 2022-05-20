const fs = require('fs')

let connections = []

exports.ws =  (ws ,req) => {
    const id = req.params.id

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
        console.log(initialMess)

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
                console.log(`${id} said: ${message}`);
                broadcast(message, ws)
            });
        }else if (id === 'client'){
            ws.id = 'client'
            connections.push(ws)
            ws.on('message', function incoming(message) {
                console.log(`${id} said: ${message}`);
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
            console.log(finalMess)
        })
    }catch(err){
        console.log(err)
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