//данные, полученные с сервера
export interface IData {
    total: number;
    items: IProduct[];
}

//выводимые карточки
export interface IProductsData {
    products: IProduct[];
    preview: string | null; //указатель на карточку
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
    userData: IUser;
    basket: IBasket; 
}
//какой запрос ожидает сервер
export interface IOrderResult {
    payment: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[],
}

export interface IUser {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IUserData{
	getUserInfo(): IUser;
	setUserInfo(userData: IUser): void;
	checkUserValidation(data: Record<keyof IUser, string>): boolean;
}

export interface IBasket {
    products: IProduct[];
    total: number;
    addProduct(product: IProduct): void;
	deleteProduct(productId: string, payload: Function | null): void;
    getProduct(productId: string): IProduct;
    cleanBasket(): void;
}

export type IProductCard = Pick<IProduct, 'image' | 'title' | 'category' | 'price'> //карточка товара на главной странице
    
export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'> //попап товара
    
export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' > //товар в корзине
         
//export type IOrderProducts = Pick<IOrder, 'products'> // список товаров в корзине

export type IOrderFormWtihPaymentMethod = Pick<IUser, 'payment' | 'address'> // первая форма

export type IOrderFormWtihPersonalData = Pick<IUser, 'email' | 'phone'> // вторая форма

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}
