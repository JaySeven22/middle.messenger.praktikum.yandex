import type { Indexed } from '../../utils/merge';
import type { UserData } from '../../entities/User';
import { resolveAvatar } from './resolveAvatar';

/**
 * Селектор для `connect`: превращает пользователя из стора (`state.user`)
 * в набор props, которые ожидают страницы профиля (Profile, ProfileEdit,
 * PasswordEdit).
 */
export function mapUserToProps(state: Indexed): Indexed {
  const user = state.user as Partial<UserData> | undefined;
  if (!user) return {};
  return {
    email: user.email ?? '',
    login: user.login ?? '',
    firstName: user.first_name ?? '',
    secondName: user.second_name ?? '',
    displayName: user.display_name ?? '',
    phone: user.phone ?? '',
    avatar: resolveAvatar(user.avatar),
  };
}
