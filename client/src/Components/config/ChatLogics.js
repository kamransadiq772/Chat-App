export const getsender = (loggeduser, users) => {
    return users[0]._id === loggeduser._id ? users[1].name : users[0].name
}
export const getsenderuser = (loggeduser, users) => {
    return users[0]._id === loggeduser._id ? users[1] : users[0]
}
export const issamesender = (messages, msg, index, userId) => {
    return (
        index < messages.length - 1 &&
        (messages[index + 1].sender._id !== msg.sender._id ||
            messages[index + 1].sender._id === undefined) &&
        messages[index].sender._id !== userId
    )
}

export const isLastMessage = (messages, index, userId) => {
    return (
        index === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}