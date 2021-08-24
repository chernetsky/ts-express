import * as bcrypt from 'bcrypt';
import * as express from 'express';
import UserEmailAlreadyExists from 'exceptions/UserEmailAlreadyExists';
import Controller from '../interfaces/controlles.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import userModel from '../users/user.model';
