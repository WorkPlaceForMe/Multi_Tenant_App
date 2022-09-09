exports.checkStructure = function(message){
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
        result.reason = 'Message needs to be JSON type.'
        return result
    }
}

// {
//     "id": "string",
//     "TimeStamp": 1231,
//     "Analytic": "string",
//     "CameraId": "string",
//     "Parameters": {},
//     "Detail": "string",
//     "UrlImage": "string"
// }