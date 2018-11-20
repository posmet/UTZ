class Notify {
  constructor(toastr) {
    this.toastr = toastr;
    this.SUCCESSFUL = "УСПЕШНО!";
    this.ERROR = "ОШИБКА!";
    this.WARNING = "ПРЕДУПРЕЖДЕНИЕ!";
    this.SUCCESS_SAVED = "СОХРАНЕНО УСПЕШНО";
    this.SUCCESS_DELETED = "УСЕШНО УДАЛЕНО";
    this.SAVE_REQUEST_ERROR = "ОШИБКА СОХРАНЕНИЯ";
    this.REQUEST_ERROR = "ОШИБКА ЗАПРОСА";
    this.ACCESS_DENIED = "ДОСТУП ЗАПРЕЩЕН";
  }

  info(title, body, options) {
    this.toastr.info(body || "", title, options || {});
  }

  success(title, body, options) {
    this.toastr.success(body || "", title, options || {});
  }

  warning(title, body, options) {
    this.toastr.warning(body || "", title, options || {});
  }

  error(title, body, options) {
    this.toastr.error(body || "", title, options || {});
  }

  errors(err, options) {
    if (err && err.data && err.data.messages) {
      err.data.messages.forEach(item => {
        if (item.type && this[item.type.toLowerCase()]) {
          this[item.type.toLowerCase()](item.message, null, options);
        } else {
          this.error(item.message, null, options);
        }
      });
      return false;
    }
    let title = "Ошибка получения данных";
    if (err) {
      switch (err.status) {
        case 404:
          title = 'Неверная конфигурация сервера';
          break;
        case 500:
          title = err.data ? err.data.title : "Ошибка получения данных";
          break;
      }
    }
    this.error(title, null, options || {});
  }
}

Notify.$inject = ['toastr'];

export default Notify;
