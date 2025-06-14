import { Router } from "express"
import profileController from "../controllers/profile.controller.js"
const profileRouter = Router() 


profileRouter.post('/profile', profileController.createProfile)
profileRouter.get('/profile/:id', profileController.getProfileById)
profileRouter.get('/profile/transactions/:id', profileController.showTransactions)
profileRouter.put('/profile/withdrawal', profileController.withdrawalMoney)
profileRouter.put('/profile/deposit', profileController.depositMoney)
profileRouter.put('/profile/send', profileController.sendMoney)


export default profileRouter