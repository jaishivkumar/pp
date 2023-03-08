const userModel = require('../model/userModel');
const jwt = require("jsonwebtoken");

const { isValid,
    isValidEmail,
    isValidName,
    isValidPassword,
    isValidRequestBody,
    isValidTitle,
    isValidPhone
} = require("../validation/validation")


/*______________________________________---====> CREATE A USER <=====---___________________________________*/ 
const createUser = async function (req, res) {
    try {
        let data = req.body

        let { title, name, phone, email, password,  } = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide author details" })
        }
        //here checking the data come from request body should not be empty

        if (!isValid(title))
            return res.status(400).send({ status: false, message: "Title is required" })
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Title should be among Mr, Mrs, Miss" })
        }
        //validating the title with above two function

        if (!isValid(name))
            return res.status(400).send({ status: false, message: "First name is required" })

        if (!(isValidName(name))) {
            return res.status(400).send({ status: false, message: "please provide correct user name" })
        }
        //    validating the name with regex       

        if (!isValid(phone))
            return res.status(400).send({ status: false, message: "phone number is required" })

        if (!(isValidPhone(phone))) {
            return res.status(400).send({ status: false, message: "Please provide a valid mobile number, it should start 6-9.(you can also use STD code 0)" })
        } //    validating the phone with regex       
        const isUniquePhone = await userModel.findOne({ phone })
        if (isUniquePhone) return res.status(400).send({ status: false, message: "phone no already exists. Please provide another phone number" })

        if (!isValid(email))
            return res.status(400).send({ status: false, message: "E-mail is required" })
        // validating the email

        if (!(isValidEmail(email))) {
            return res.status(400).send({ status: false, message: "E-mail should be a valid e-mail address" })
        }
        // validating the email with regex

        let isUniqueEmail = await userModel.findOne({ email: email })
        if (isUniqueEmail)
            return res.status(400).send({ status: false, message: "This e-mail address is already exist , Please enter valid E-mail address" })
        //checking the user email is correct or not 

        if (!isValid(password))
            return res.status(400).send({ status: false, message: "password is not exist" })
        // password is present or not

        if (!(isValidPassword(password))) {
            return res.status(400).send({ status: false, message: "password should contain at least One digit, one upper case , one lower case , its b/w 8 to 15" })
        }
        //validating the password with regex
      
        

        let userCreated = await userModel.create(data)
        return res.status(201).send({ status: true, message: "user created successfully", data: userCreated })

    }
    catch (err) {
        return res.status(500).send({ message: "Error", error: err.message })
    }

}
// =========================login api=======================================================
const userLogIn = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data
        if (!isValid(email))
            return res.status(400).send({ status: false, message: "E-mail is required" })
        // validating the email

        if (!(isValidEmail(email))) {
            return res.status(400).send({ status: false, message: "E-mail should be a valid e-mail address" })
        }
        // validating the email with regex
        if (!isValid(password))
            return res.status(400).send({ status: false, message: "password is required" })
        // password is present or not

        if (!(isValidPassword(password))) {
            return res.status(400).send({ status: false, message: "password should contain at least One digit, one upper case ,one lower case , its b/w 8 to 15" })
        }
        let isUser = await userModel.findOne({ email: email, password: password });
        if (!isUser) {
            return res.status(404).send({ status: false, data: "you are not a valid user" });
        }
        let token = jwt.sign(
            {
                userId: isUser._id.toString(),
                project: " user"
            },
            { expiresIn: "12000000000s" }
        );
        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, message: 'Success', data: { token: token } });
    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }

};

module.exports.userLogIn = userLogIn;
module.exports.createUser = createUser;