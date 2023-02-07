  const values = (req, res, next) => {
    const data = req.body

    let values = ''


    for(let i = 0; i < data.values.length; i++){
        if(i === data.values.length - 1){
            values += `"${data.values[i]}"`
        }else{
            values += `"${data.values[i]}", `
        }
         // if(key.includes('bye'))
    }

    req.body.values = values

    next()
  }

const verifyInsertion = {
  values: values
}

module.exports = verifyInsertion