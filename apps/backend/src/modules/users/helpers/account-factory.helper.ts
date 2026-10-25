// ==============================================================================
// ACCOUNT FACTORY HELPER (Unified Account & Role Construction for Manual & Bulk)
// ==============================================================================

import bcrypt from 'bcryptjs';

export interface GeneratedAccountData {
  username: string;
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  isActive: boolean;
}

export class AccountFactoryHelper {
  static getDefaultInitialPassword(): string {
    if (process.env.NODE_ENV === 'production' && !process.env.DEFAULT_INITIAL_PASSWORD) {
      throw new Error('DEFAULT_INITIAL_PASSWORD must be configured in production.');
    }
    return process.env.DEFAULT_INITIAL_PASSWORD || 'Utc2@123456';
  }

  /**
   * Tạo thông tin Account mặc định với mật khẩu được băm bcrypt
   */
  static async createInitialAccount(
    code: string,
    email: string,
    customPassword?: string,
  ): Promise<GeneratedAccountData> {
    const rawPassword = customPassword || this.getDefaultInitialPassword();
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    return {
      username: code.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      passwordHash,
      mustChangePassword: true,
      isActive: true,
    };
  }
}
