import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.username = username;
        user.password = await this.hashPassword(password, user.salt);
        await user.save();
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && user.validatePassword(password))
            return user;
        else
            return null;
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}
