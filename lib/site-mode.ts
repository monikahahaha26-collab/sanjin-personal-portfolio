/**
 * Public static builds are deliberately read-only.
 * Content management remains available only while running `npm run dev`
 * in the owner's local workspace; this is not presented as public auth.
 */
export const CAN_MANAGE_CONTENT = process.env.NODE_ENV !== "production";
