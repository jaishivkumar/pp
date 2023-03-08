const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) {
        return false
    }
    //value given by user should not be undefined and null
    if (typeof value === 'string' && value.trim().length == 0) {
        return false
    }
    //value given by user should  be string and not with only space 
    return true

}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
// function for title validation
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}
const isValidDate = function (date) {
    let dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    return dateFormatRegex.test(date)
}

const isValidName = function (name) {
    let nameRegex = /^[.a-zA-Z\s,-]+$/
    return nameRegex.test(name)
}
//regex for name 
const isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}
// regex for email validation

const isValidPhone = function (phone) {
    let mobileRegex = /^[0]?[6789]\d{9}$/
    return mobileRegex.test(phone)
}
//10 didgit mobile number stating with any(6,7,8,9) and 0 if you want to use in mobile number 

const isValidPincode = function (pincode) {
    let pincodeRegex = /^\d{6}$/
    return pincodeRegex.test(pincode)
}

const isValidPassword = function (password) {
    let passwordregex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#@$%&? "])[a-zA-Z0-9!#@$%&?]{8,15}$/
    return passwordregex.test(password)

}
//  One digit, one upper case , one lower case , its b/w 8 to 15

module.exports = {
    isValid,
    isValidDate,
    isValidEmail,
    isValidName,
    isValidObjectId,
    isValidPassword,
    isValidPhone,
    isValidRequestBody,
    isValidTitle
}