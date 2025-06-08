import { userRepository } from '@/repositories/userRepository';

import { logger } from '../utils/logger';

class UserService {
    private logger = logger.child({
        module: '[Nexelis][UserService]',
    });

    /**
     * Update the password of a user
     * @param userId - The id of the user
     * @param hashedPassword - The hashed password
     * @returns The updated user
     */
    async updatePassword(userId: string, hashedPassword: string): Promise<any> {
        const user = await userRepository.findById(userId);

        if (!user) {
            this.logger.error('User not found');
            throw new Error('User not found');
        }

        return userRepository.update(userId, { password: hashedPassword });
    }
}

export const userService = new UserService();
