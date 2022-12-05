
/**
 * @param {import('@t/chat').Message} data
 * @returns {import('@t/chat').Message}
 */
export function transformMessage(data) {
  return {
    ...data,
    timestamp: new Date(data.timestamp)
  }
}

/**
 * @param {string} userId
 * @param {import('@t/chat').Group} group
 * @returns {import('@t/chat').Group}
 */
export function transformGroup(userId, group) {
  const friend_id = group.friend_id === userId ? group.owner_id : group.friend_id

  return {
    ...group,
    friend_id,
    last_message_time: group.last_message_time && new Date(group.last_message_time),
    created: new Date(group.created),
    modified: new Date(group.modified),
  }
}
