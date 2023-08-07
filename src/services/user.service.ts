import User from '../models/user.model'
import BaseService from './base.service'

class UserService extends BaseService {

}

const userService = new UserService(User)
export default userService;