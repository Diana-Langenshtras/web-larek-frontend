import { IProductsData, IUser, IProduct, IProductCard } from '../types';
import { CDN_URL, colors } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { Component } from './base/Component';

export class Card extends Component<IProduct> {
	protected events: IEvents;
	protected basketButton?: HTMLButtonElement;
	protected closeButton?: HTMLButtonElement;
    protected deleteButton?: HTMLButtonElement;
	protected cardImage?: HTMLImageElement;
	protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardDescription?: HTMLElement;
    protected cardCategory?: HTMLElement;
	protected cardId: string;
    protected cardIndex?: HTMLElement; 

	constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
		this.events = events;

        this.closeButton = this.container.querySelector('.modal__close');
		this.basketButton = this.container.querySelector('.button');
		this.deleteButton = this.container.querySelector('.basket__item-delete');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardTitle = this.container.querySelector('.card__title');
        this.cardPrice = this.container.querySelector('.card__price');
        this.cardDescription = this.container.querySelector('.card__text');
        this.cardCategory = this.container.querySelector('.card__category');
        this.cardIndex = this.container.querySelector('.basket__item-index');

        if (this.cardImage)
        {
            this.cardImage.addEventListener('click', () =>
                this.events.emit('product:select', { card: this })
            );
        }

        if (this.deleteButton)
        {
            this.deleteButton.addEventListener('click', () =>
                this.events.emit('product:delete', { card: this })
            );
        }

        if (this.basketButton)
        {
            this.basketButton.addEventListener('click', () =>
                    this.events.emit('product:add', { card: this })
            );
        }
	}

    render(productData: Partial<IProduct> | undefined ) { 
        const { ...allProductData} = productData;
        Object.assign(this, allProductData); 
        return this.container;
    } 

	set image (image: string) {
		if (this.cardImage) {
            this.cardImage.src = CDN_URL + image;
        }
	}

	set title (title: string) {
		this.cardTitle.textContent = title;
	}

    set price (price: number) {
		if (price) {
            this.cardPrice.textContent = String(price) + ' синапсов';
        }
        else this.cardPrice.textContent = 'Бесценно';
	}

    set description (description: string) {
		if (this.cardDescription) {
            this.cardDescription.textContent = description;
        }
	}

    set category (category: string) {
		if (this.cardCategory) {
            this.cardCategory.textContent = category;
            this.cardCategory.classList.remove('card__category_other');
            this.cardCategory.classList.add(colors[category as keyof typeof colors]);
        } 
	}

	set id (id) {
		this.cardId = id;
	}
    
	get id() {
		return this.cardId;
	}

    set index (id:number) {
		if (this.cardIndex) {
            this.cardIndex.textContent = String(id);
        } 
	}

	deleteCard() {
		this.container.remove();
		this.container = null;
	}

    setDisabledBasketButton(value: boolean){
        this.setDisabled(this.basketButton, value);
    }
}
