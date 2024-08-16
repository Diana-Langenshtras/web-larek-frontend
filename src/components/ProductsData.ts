/*
#### Класс ProductsData
Класс отвечает за хранение и логику работы с каталогом товаров.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив объектов карточек продуктов
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addProduct(product: IProduct): void - добавляет товар в начало массива
- deleteProduct(productId: string, payload: Function | null = null): void - удаляет товар из массива. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменения массива.
- getProduct(productId: string): IProduct - возвращает товар по его id
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса
 */

import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";

export class ProductsData implements IProductsData {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
     }

    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:changed')
    }

    get products () {
        return this._products;
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
}