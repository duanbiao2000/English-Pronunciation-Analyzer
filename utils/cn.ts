
/**
 * A simple utility function to conditionally join class names together.
 * It filters out any falsy values (e.g., false, null, undefined) before joining.
 * This is a common pattern in React projects using utility-first CSS frameworks like Tailwind CSS.
 * 
 * @param classes A list of strings, booleans, or undefined values.
 * @returns A single string of space-separated class names.
 * 
 * @example
 * cn('p-4', isPrimary && 'bg-blue-500', 'rounded');
 * // returns 'p-4 bg-blue-500 rounded' if isPrimary is true
 * // returns 'p-4 rounded' if isPrimary is false
 */
export const cn = (...classes: (string | boolean | undefined | null)[]) => {
    return classes.filter(Boolean).join(' ');
}
