import { IOrder, IOrderResult, IProduct, ProductsCatalog } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export interface IShopAPI {
    catalog: ProductsCatalog[];
    getProducts: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class ShopAPI extends Api implements IShopAPI {
    readonly cdn: string;
    catalog: ProductsCatalog[];

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image.replace('.svg', '.png'),
            }))
        );
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get<IProduct>(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image.replace('.svg', '.png'),
            })
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}