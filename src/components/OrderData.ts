/*
#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _basket: IProduct[] - массив товаров в корзине
- _userData: IUserData - данные о пользователе
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- cleanOrder(): void - очищает данные заказа
- addOrderUserData(userData: IUserData):void - добавляем данные о пользователе в заказ
- addOrderBasketData(products: IProduct[]):void - добавляем данные о корзине в заказ
- checkValidation(data: Record<keyof TUserPublicInfo, string>): boolean - проверяет объект с данными пользователя на валидность
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса
 */

import { IOrder, IUser, IProduct, IBasket } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrder {
    protected _basket: IBasket;
    protected _userData: IUser;
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
        this._userData = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        }
    }

    set basket(basket:IBasket) {
        this._basket = basket;
    }

    get basket () {
        return this._basket;
    }


    get userData () {
        return this._userData;
    }

    get total () {
        return this.basket.total;
    }

    cleanOrder() {
        this._userData = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        }
    }

    setOrderField(field: keyof IUser, value: string) {
        if (value)
        this._userData[field] = value;
        this.events.emit('order:ready', this._userData);
    }

    setContactsField(field: keyof IUser, value: string) {
        if (value)
        this._userData[field] = value;
        this.events.emit('contacts:ready', this._userData);
    }

    checkOrderData(){
        if (this._userData.payment && this._userData.address)
            return true;
        else return false;
    }

    checkContactsData(){
        if (this._userData.phone && this._userData.email)
            return true;
        else return false;
    }   
}
