//данные, полученные с сервера
export interface IData {
    total: number;
    products: IProduct[];
}

//выводимые карточки
export interface IProductsData {
    products: IProduct[];
    preview: string | null; //указатель на карточку
    addProduct(product: IProduct): void;
	deleteProduct(productId: string, payload: Function | null): void;
	getProduct(productId: string): IProduct;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IOrder { 
    data: IUserData;
    products: IBasket; 
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IUserData {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IBasket {
    products: IProduct[];
    total: number;
}

export type IProductCard = Pick<IProduct, 'image' | 'title' | 'category' | 'price'> //карточка товара на главной странице
    
export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'> //попап товара
    
export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' > //товар в корзине
     
export type IProductOrderPrice = Pick<IProduct, 'price'> //после оформления заказа сколько списано
    
export type IOrderProducts = Pick<IOrder, 'products'> // список товаров в корзине

export type IOrderFormWtihPaymentMethod = Pick<IUserData, 'payment' | 'address'> // первая форма

export type IOrderFormWtihPersonalData = Pick<IUserData, 'email' | 'phone'> // вторая форма