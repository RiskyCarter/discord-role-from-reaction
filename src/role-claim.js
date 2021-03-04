const firstMessage = require('./first-message')

module.exports = (client) => {
  const channelId = '816941269564653588'

  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName)

  const emojis = {
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    aws: 'CloudService',
    golang: 'Golang',
    htmlcss: 'WebDeveloper',
  }

  const reactions = []

  let emojiText = 'Add a reaction to claim a role\n\n'
  for (const key in emojis) {
    const emoji = getEmoji(key)
    reactions.push(emoji)

    const role = emojis[key]
    emojiText += `${emoji} = ${role}\n`
  }

  firstMessage(client, channelId, emojiText, reactions)

  const handleReaction = (reaction, user, add) => {
    if (user.id === '816947108879007765') {
      return
    }
    console.log(reaction)

    const emoji = reaction._emoji.name
    console.log("========= Emoji.name ======="+emoji)

    const { guild } = reaction.message

    const roleName = emojis[emoji]
    if (!roleName) {
      return
    }
    console.log("========= role.name ======="+roleName)

    const role = guild.roles.cache.find((role) => role.name === roleName)
    const member = guild.members.cache.find((member) => member.id === user.id)
    console.log("========= found role ======="+role)
    if (add) {
      member.roles.add(role).catch(console.error);
      console.log("role has been added."+role)
    } else {
      member.roles.remove(role)
      console.log("role has been removed."+role)

    }
  }

  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, true)
    }
  })

  client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, false)
    }
  })
}
