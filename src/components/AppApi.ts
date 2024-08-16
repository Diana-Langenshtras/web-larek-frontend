import { IApi, IOrderResult, IData } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<IData> {
		return this._baseApi.get<IData>(`/product`).then((data: IData) => data);
	}

	setProducts(data: IOrderResult): Promise<IData> {
		return this._baseApi.post<IData>(`/order`, data).then((data: IData) => data);
	}
}
