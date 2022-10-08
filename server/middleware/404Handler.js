import Express from 'express';
import { CustomException, ErrorCode, ErrorMessage } from '../utils/index.js';

/**
 * Handles 404 routes messages
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 * @param  {function} next
 */
export default (req, res, next) => {
    res.status(404);
    next(new CustomException(ErrorMessage.NOT_FOUND, ErrorCode.NOT_FOUND))
}
