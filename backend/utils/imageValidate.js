const imageValidate = (images) => {
    let imagesArray = []
    if(Array.isArray(images)) { //check if images(req.files.images) is array or not
        imagesArray = images
    } else {
        imagesArray.push(images)
    }

    if(imagesArray.length > 3) {
        return { error: "Send only 3 images at once" }
    }
    const maxFileSize = 1024*1024;
    for(let image of imagesArray) {
        if(image.size > maxFileSize) {
            return ({error: "Size too large (above 1 MB)"})
        }
        const Allowedfiletypes = /jpg|jpeg|png/ //allowed file type
        //check if mimetype is jpg|jpeg|png
        const fileType = Allowedfiletypes.test(image.mimetype); //mimetype = media file extension  
        if(!fileType) {
            return ({ error: "Incorrect mime type (should be jpg,jpeg or png" })
        }
    }
    return { error: false }
}

module.exports = imageValidate
