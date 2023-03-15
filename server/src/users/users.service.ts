import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { throwError } from 'src/common/error/domain';
import { UserErrors } from 'src/common/error/user.errors';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async formatUserData(user: User & { _id: Types.ObjectId }) {
    return {
      _id: user._id,
      email: user.email,
      username: user.userName,
    };
  }
  async formatUserListData(users: Array<User & { _id: Types.ObjectId }>) {
    const usersExtended = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const formatedUser = await this.formatUserData(user);
      usersExtended.push(formatedUser);
    }
    return usersExtended;
  }

  async create(createUserDto: CreateUserDto) {
    Logger.verbose(`Creates one user: ${createUserDto.username}`);

    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // create admin if it not exists
    const admins = await this.userModel.find({ isAdmin: true });
    const isAdmin = admins.length === 0;

    const user = await this.userModel.create({
      userName: createUserDto.username,
      email: createUserDto.email,
      passwordHash,
      isAdmin,
    });
    return this.formatUserData(user);
  }

  async findAll() {
    Logger.verbose(`This action returns all users`);
    const users = await this.userModel.find().lean();
    return this.formatUserListData(users);
  }

  async findOneByEmail(email: string) {
    Logger.verbose(`This action returns a user with ${email}`);
    const user = await this.userModel.findOne({ email }).lean();
    return user;
  }

  async findOne(id: string) {
    Logger.verbose(`This action returns a #${id} user`);
    const user = await this.userModel.findById(id).lean();
    if (!user) throwError(UserErrors.USER_NOT_FOUND);
    return this.formatUserData(user);
  }

  async isAdmin(id: string) {
    Logger.verbose(
      `This action returns boolean if the #${id} user has admin permitions`,
    );
    const user = await this.userModel.findById(id).lean();
    if (!user) throwError(UserErrors.USER_NOT_FOUND);
    return user.isAdmin;
  }

  async update(id: string, userId: string, updateUserDto: UpdateUserDto) {
    Logger.verbose(`This action updates a #${id} user`);
    if (id !== userId) throwError(UserErrors.USER_HAS_NO_PERMISION);

    let updateData: any = updateUserDto;

    if (!updateUserDto.password) {
      const saltOrRounds = 10;
      const passwordHash = await bcrypt.hash(
        updateUserDto?.password,
        saltOrRounds,
      );
      updateData = { ...updateUserDto, passwordHash };
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return this.formatUserData(updatedUser);
  }

  async remove(id: string, userId: string) {
    Logger.verbose(`This action removes a #${id} user`);
    if (id !== userId) throwError(UserErrors.USER_HAS_NO_PERMISION);
    const deltedUser = await this.userModel.findByIdAndRemove(id);
    return this.formatUserData(deltedUser);
  }
}
