const renderEmoji = require('../plugins/renderEmoji');

module["exports"] = class Utils {
    static RenderEmoji(ctx, msg, x, y, Width) {
        return renderEmoji(ctx, msg, x, y, Width);
      }

    static Shorten(message, length) {
      if (typeof message !== 'string') return '';
      if (message.length <= length) return message;
      return message.substring(0, length).trim() + '...';
    }
}