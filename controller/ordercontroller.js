const userModel = require("../model/usermodel")
const { isValid, isValidObjectId, isValidRequestBody } = require("../validation/validation")
const ordermodel = require("../model/ordermodel")

const createOrder = async function (req, res) {

    try {

        const userId = req.params.userId
        let userIdFromToken = req.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId in path params." })
        }
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            return res.status(404).send({ status: false, msg: " user not found" })
        }
        if (userId != userIdFromToken) {
            return res.status(403).send({ status: false, message: `authentication fail ` })
        }

        let data = req.body;
        const { cartId, cancellable } = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, Message: ' Please provide data' });
        }

        if (!isValid(cartId)) {
            return res.status(400).send({ status: false, Message: ' Please provide cartId' })
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, Message: ' Please provide a valid cartId' })
        }
        if(cancellable){
        if (typeof cancellable != "boolean") {
            return res.status(400).send({ status: false, message: `Cancellable must be either 'true' or 'false'.` });
        }}
        const cart = await cartModel.findOne({ userId })
        if (!cart) {
            return res.status(404).send({ status: false, Message: ' user cart unavailable' })
        }

        if (cart.totalItems == 0) {
            return res.status(400).send({ status: false, message: "The cart is Empty" });
        }

        // get cart info like items, totalPrice, totalItems and totalQuantity
        let { items, totalPrice, totalItems } = cart
        let totalQuantity = 0;

        items.forEach(each => totalQuantity += each.quantity);

        const orderdata = { userId, items, totalPrice, totalItems, totalQuantity, cancellable }

        const createProduct = await orderModel.create(orderdata);

        await cartModel.findOneAndUpdate({ _id: cartId, userId: userId }, /*cart will be empty after the order is done */
        { $set: { items: [], totalPrice: 0, totalItems: 0, } });

        res.status(201).send({ status: true, Message: ' sucesfully created order', data: createProduct })

    } catch (error) {
        return res.status(500).send({ status: false, Message: error.message })
    }
}



/**________________________________________getorder _______________________________________________________________ */
const getorder = async function (req, res) {
    try {
        const data = req.query;

        if (!isValidRequestBody(data)) return res.status(400).send({
            status: false, message: "Invalid request parameters. Please provide book details"
        })

        let obj = { isDeleted: false }

        let { userId, totalPrice, item } = data;

        if (userId) {
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "userId is not valid author id please check it" })
            }
        }
        if (isValid(userId)) {
            let user = await ordermodel.find({ userId: userId });
            if (user.length == 0) {
                res.status(400).send({ status: false, msg: "no data found with this user id " })
                return;
            }
            obj.userId = userId
        }

        if (isValid(totalPrice)) {
            let cat = await orderModel.find({ totalPrice: totalPrice });
            if (totalPrice.length == 0) {
                res.status(400).send({ status: false, msg: "price  is not matching " })
                return;
            }
            obj.totalPrice = totalPrice
        }

        if (isValid(item)) {
            let subcat = await ordermodel.find({ item: item });
            if (item.length == 0) {
                res.status(400).send({ status: false, msg: "item is not matching " })
                return;
            }
            obj.item = item
        }
        
        res.status(200).send({ status: true, message: 'getorder list', data: findBook })

    }
    catch (err) { return res.status(500).send({ message: "Error", error: err.message }) }

}
/**_____________________________________get orderbyid_________________________________________________________________ */

const getorderById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: " invalid  BookId" })

        const data = await ordermodel.findOne({ _id: userId })

        if (!data) return res.status(404).send({ status: false, message: "user does not exist" })

        if (data.isDeleted) return res.status(404).send({
            status: false, message: "Book already deleted"
        })
       
        const releasedAt1 = new Date(data.releasedAt).toISOString().slice(0, 10)



        return res.status(200).send({ status: true, message: "Book List", data: obj })
    }
    catch (err) { return res.status(500).send({ message: "Error", error: err.message }) }
}

const updateOrder = async function (req, res) {
    try {

        const userId = req.params.userId
        let userIdFromToken = req.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId " })
        }
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            return res.status(404).send({ status: false, msg: " user not found" })
        }
        if (userId != userIdFromToken) {
            return res.status(403).send({ status: false, message: `authentication fail ` })
        }
        let data = req.body

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "please provide request body" })
        }
        const { orderId, status } = data


        if (!isValid(orderId)) {
            return res.status(400).send({ status: false, msg: 'provide orderId' })

        }
        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, msg: ' productId is invalid' })
        }
        const findOrder = await orderModel.findById(orderId)
        console.log(findOrder)
        if (!findOrder) {
            return res.status(400).send({ status: false, msg: 'orderId is wrong' })
        }

        if (!isValid(status)) {
            return res.status(400).send({ status: false, msg: 'provide valid status like [pending,completed,cancelled]' })
        }
        if (status) {
            if (!(['pending', 'completed', 'cancelled'].includes(status))) {
                return res.status(400).send({ status: false, message: `Status must be among ['pending','completed','cancelled'].`, });
            }
        }

        if (status === 'pending') {
            if (findOrder.status === 'completed') {
                return res.status(400).send({ status: false, msg: 'order can not be update to pending.because it is completed' })
            }
            if (findOrder.status === 'cancelled') {
                return res.status(400).send({ status: false, msg: 'order can not be update to pending. because it is cancelled' })
            }
            if (findOrder.status === 'pending') {
                return res.status(400).send({ status: false, msg: 'order is already pending' })
            }
        }

        if (status === 'completed') {
            if (findOrder.status == 'cancelled') {
                return res.status(400).send({ status: false, message: "Order can not be updated to completed. because it is cancelled." })
            }
            if (findOrder.status == 'completed') {
                return res.status(400).send({ status: false, message: "Order is already completed." })
            }
            const orderStatus = await orderModel.findOneAndUpdate({ _id: orderId },
                { $set: { status:'completed' } }, { new: true });
            return res.status(200).send({ status: true, message: "order completed successfully", data: orderStatus })
        }


        if (status === 'cancelled') {
            if (findOrder.cancellable == false) {
                return res.status(400).send({ status: false, message: "Item can not be cancelled, because it is not cancellable." })
            }
            if (findOrder.status === 'completed') {
                return res.status(400).send({ status: false, message: "Order is already completed." })
            }

            if (findOrder.status === 'cancelled') {
                return res.status(400).send({ status: false, message: "Order is already cancelled." })
            }
            const findOrderAfterDeletion = await orderModel.findOneAndUpdate({ _id: orderId },
                { $set: { status: 'cancelled' } }, { new: true })
            return res.status(200).send({ status: true, message: "Order is cancelled successfully", data: findOrderAfterDeletion })
        }

    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

module.exports.createOrder = createOrder
module.exports.updateOrder = updateOrder
module.exports.getorderById=getorderById
module.exports.getorder=getorder