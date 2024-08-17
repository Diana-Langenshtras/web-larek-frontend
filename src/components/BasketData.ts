/*
#### Класс BasketData
Класс отвечает за хранение и логику работы с товарами, добавленными в корзину.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив товаров в корзине
- _total: number - сумма товаров в корзине
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addProduct(product: IProduct): void - добавляет товар в начало массива
- deleteProduct(productId: string, payload: Function | null = null): void - удаляет товар из массива. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменения массива.
- getProduct(productId: string): IProduct - возвращает товар по его id
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса
 */

import { IBasket, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasket {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected _total: number;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._products = [];
     }

    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:changed')
    }

    get products () {
        return this._products;
    }

    addProduct(product: IProduct): void {
        if (!this._products.includes(product) && product.price !== null)
        {
            this._products = [product, ...this._products]
            this.events.emit('products:changed')
        }
    }

    deleteProduct(productId: string): void {
        this._products = this._products.filter(product => product.id !== productId);
        this.events.emit('products:changed') 
    }

    cleanBasket(){
        this._products = [];
        this.events.emit('products:changed') 
    }

    getProduct(productId: string) {
        return this._products.find(product => product.id === productId)
    }

    set preview(productId: string | null) {
        if (!productId) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this._preview = productId;
            this.events.emit('product:selected')
        }
    }

    get preview () {
        return this._preview;
    }

    get total () {
        console.log(this.products)
        let summ = 0;
        if (this.products) this.products.map(product => 
            summ = summ + product.price
        )
        this._total = summ
        return this._total;
    }
}