export const generateAssignmentId = () => {
    const date = new Date();
    return `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMilliseconds()}`;
}