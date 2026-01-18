/**
 * Censors an email address for privacy.
 * Example: john.doe@example.com -> j*******e@example.com
 */
export function censorEmail(email: string | undefined): string {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [user, domain] = parts;
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
}
