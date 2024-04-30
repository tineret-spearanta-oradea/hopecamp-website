class MessageData {
  constructor(uid, text, isRead = false, sentDate = new Date()) {
    this.uid = uid;
    this.text = text;
    this.isRead = isRead;
    this.sentDate = sentDate;
  }
}

export default MessageData;
