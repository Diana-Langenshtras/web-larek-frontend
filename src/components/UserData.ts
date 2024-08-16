/*
#### Класс UserData
Класс отвечает за хранение и логику работы с данными текущего пользователя.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- payment: string - способ оплаты пользователя
- address: string - адрес пользователя
- email: string - email пользователя
- phone: string - телефон пользователя

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setUserInfo(userData: IUser): void - записываем данные пользователя
- getUserInfo(): IUser - получаем данные пользователя
- checkUserValidation(data: Record<keyof IUser, string>): boolean - проверяет объект с данными пользователя на валидность
*/

import { IUser, IUserData } from "../types";
import { IEvents } from "./base/events";

export class UserData implements IUserData {
    protected payment: string;
    protected address: string;
    protected email: string;
    protected phone: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
     }

    getUserInfo(): IUser{
      return { payment: this.payment, address: this.address, email: this.email, phone: this.phone };
    }

    setUserInfo(userData: IUser): void {
      this.payment = userData.payment;
      this.address = userData.address;
      this.email = userData.email;
      this.phone = userData.phone;
      this.events.emit('user:changed');
    }
   
    checkUserValidation(data: Record<keyof IUser, string>): boolean {
      if (data.payment && data.address && data.email && data.phone) return true;
          else return false;
    }
}