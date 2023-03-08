const express= require('express');

const router= express.Router()


router.post("/register", usercontroller.createUser) 

router.post("/login", usercontroller.userLogIn)
router.post('/users/:userId/orders', ordercontroller.createOrder)
router.put('/users/:userId/orders', ordercontroller.updateOrder)

router.get('/users/userId',  ordercontroller.getorder) 

router.get('/user/:bookId', ordercontroller.getorderbyId)

module.exports= router