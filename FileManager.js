
const upload = require('multer')

const storage = upload.diskStorage({
    destination:((req,file,callback) => {
      callback(null,'./Uploads')
    }),
    filename:((req,filename,callback) =>{
       callback(null,'pfe'+'-'+filename.fieldname + new Date())
    })
})
const file_manager = upload({storage:storage});

module.exports = {file_manager}