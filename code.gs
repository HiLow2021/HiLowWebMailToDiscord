function hook() {
  // 未読のスレッドを取得
  const threads = GmailApp.search('subject:HiLow Web is:unread');

  if (threads.length == 0) {
    Logger.log('新規メッセージなし');
    return
  }

  threads.reverse().forEach(function (thread) {
    const messages = thread.getMessages();

    const payloads = messages.reverse().map(function (message) {
      // メールを既読に設定する
      message.markRead();

      const subject = message.getSubject();
      const plainBody = message.getPlainBody();

      const webhook = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');

      Logger.log(subject);
      const payload = {
        username: subject,
        embeds: [{
          title: subject,
          url: 'https://mail.google.com/mail/u/0/#all/' + message.getId(),
          color: 15258703,
          description: plainBody.substring(0, 2000),
        }],
      }
      return {
        url: webhook,
        contentType: 'application/json',
        payload: JSON.stringify(payload),
      }
    })

    Logger.log(payloads);
    UrlFetchApp.fetchAll(payloads);
  })
}